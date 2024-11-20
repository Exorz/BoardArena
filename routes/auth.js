const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Din användarmodell
const router = express.Router();

// Secret key för JWT (sätt denna som en miljövariabel i din .env-fil)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register-rutt
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Kolla om användaren eller email redan finns
  User.findOne({ $or: [{ username }, { email }] })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already taken' });
      }

      // Kryptera lösenordet
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      // Skapa ny användare
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      newUser.save()
        .then(user => {
          res.json({ message: 'Registration successful', username: user.username });
        })
        .catch(err => res.status(500).json({ message: 'Error registering user' }));
    });
});

// Login-rutt
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // Uppdatera lastLogin och playerStatus vid inloggning
        user.lastLogin = Date.now();
        user.playerStatus = 'online';  // Sätt användaren till online när de loggar in

        user.save()
          .then(() => {
            // Skapa en JWT-token
            const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
res.json({
  message: 'Login successful',
  username: user.username,
  token, // Skicka token till klienten
});

          })
          .catch(err => res.status(500).json({ message: 'Error updating user', error: err }));
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Server error' }));
});

// Logout-rutt
router.get('/logout', (req, res) => {
  const { userId } = req.body;

  User.findById(userId)
    .then(user => {
      user.playerStatus = 'offline'; // Sätt användaren till offline vid utloggning
      user.save()
        .then(() => {
          res.json({ message: 'Logged out' });
        })
        .catch(err => res.status(500).json({ message: 'Error updating user status', error: err }));
    })
    .catch(err => res.status(500).json({ message: 'Error finding user', error: err }));
});

// Kontrollera om användaren är inloggad med JWT
router.get('/user', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Förväntar sig "Bearer <token>"

  if (!token) {
    return res.json({ loggedIn: false });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ loggedIn: false });
    }

    User.findById(decoded.userId)
      .then(user => res.json({ loggedIn: true, username: user.username, playerStatus: user.playerStatus }))
      .catch(err => res.status(500).json({ message: 'Error retrieving user' }));
  });
});

module.exports = router;
