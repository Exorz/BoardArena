const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model to update lastActive
const JWT_SECRET = process.env.JWT_SECRET || '9399891';

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token; // Get token from header or URL

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err || !decoded._id || !decoded.username) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = { _id: decoded._id, username: decoded.username };

        // Update lastActive for the authenticated user
        try {
            await User.findByIdAndUpdate(req.user._id, { lastActive: Date.now() });
        } catch (updateError) {
            console.error('Error updating lastActive:', updateError);
        }

        next();
    });
};

const socketAuthenticate = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('No token provided'));
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err || !decoded._id || !decoded.username) {
            return next(new Error('Invalid token'));
        }

        socket.user = { _id: decoded._id, username: decoded.username };

        // Update lastActive and set isOnline to true for socket connections
        try {
            await User.findByIdAndUpdate(socket.user._id, { lastActive: Date.now(), isOnline: true });
        } catch (updateError) {
            console.error('Error updating lastActive and isOnline for socket connection:', updateError);
        }

        next();
    });
};

// Optional: Set isOnline to false when the socket disconnects
const socketDisconnect = async (socket) => {
    if (socket.user && socket.user._id) {
        try {
            await User.findByIdAndUpdate(socket.user._id, { isOnline: false });
        } catch (updateError) {
            console.error('Error setting isOnline to false on disconnect:', updateError);
        }
    }
};

module.exports = { authenticateToken, socketAuthenticate, socketDisconnect };
