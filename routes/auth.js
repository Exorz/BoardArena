// /routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Din användarmodell
const router = express.Router();

// Login-rutt
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user._id;  // Sätt användarens ID i sessionen
        res.json({ message: 'Login successful', username: user.username });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Server error' }));
});

// Logout-rutt
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }
    res.json({ message: 'Logged out' });
  });
});

// Register-rutt
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Kryptera lösenordet

  const newUser = new User({ username, password: hashedPassword });

  newUser.save()
    .then(user => {
      res.json({ message: 'Registration successful', username: user.username });
    })
    .catch(err => res.status(500).json({ message: 'Error registering user' }));
});

// Kontrollera om användaren är inloggad
router.get('/user', (req, res) => {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => res.json({ loggedIn: true, username: user.username }))
      .catch(err => res.status(500).json({ message: 'Error retrieving user' }));
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
