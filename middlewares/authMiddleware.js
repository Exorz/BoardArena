const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model to update lastActive
const JWT_SECRET = process.env.JWT_SECRET || '9399891';

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token; // Get token from header or URL
    logger.info('[authmiddleware.js] Token received:', token); // Log token to check if it is received correctly
    

    if (!token) {
        logger.warn('[authmiddleware.js] No token provided.');
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err || !decoded._id || !decoded.username) {
            logger.error('[authmiddleware.js] Invalid token or missing fields in token payload:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = { _id: decoded._id, username: decoded.username };
        logger.info('[authmiddleware.js] Token verified, user ID:', decoded._id);

        // Update lastActive for the authenticated user
        try {
            await User.findByIdAndUpdate(req.user._id, { lastActive: Date.now() });
            logger.info('[authmiddleware.js] Updated lastActive for user ID:', req.user._id);
        } catch (updateError) {
            logger.error('[authmiddleware.js] Error updating lastActive:', updateError);
        }

        next();
    });
};

const socketAuthenticate = (socket, next) => {
    const token = socket.handshake.auth.token;
    logger.info('[authmiddleware.js] Authenticating socket connection with token.');

    if (!token) {
        logger.warn('[authmiddleware.js] No token provided for socket connection.');
        return next(new Error('No token provided'));
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err || !decoded._id || !decoded.username) {
            logger.error('[authmiddleware.js] Invalid token for socket connection or missing fields:', err);
            return next(new Error('Invalid token'));
        }

        socket.user = { _id: decoded._id, username: decoded.username };
        logger.info('[authmiddleware.js] Socket authenticated, user ID:', decoded._id, 'Username:', decoded.username);

        // Update lastActive and set isOnline to true for socket connections
        try {
            await User.findByIdAndUpdate(socket.user._id, { lastActive: Date.now(), isOnline: true });
            logger.info('[authmiddleware.js] Updated lastActive and set isOnline to true for socket user ID:', socket.user._id);
        } catch (updateError) {
            logger.error('[authmiddleware.js] Error updating lastActive and isOnline for socket connection:', updateError);
        }

        next();
    });
};

// Optional: Set isOnline to false when the socket disconnects
const socketDisconnect = async (socket) => {
    if (socket.user && socket.user._id) {
        try {
            await User.findByIdAndUpdate(socket.user._id, { isOnline: false });
            logger.info('[authmiddleware.js] Set isOnline to false for disconnected user ID:', socket.user._id);
        } catch (updateError) {
            logger.error('[authmiddleware.js] Error setting isOnline to false on disconnect:', updateError);
        }
    }
};

module.exports = { authenticateToken, socketAuthenticate, socketDisconnect };
