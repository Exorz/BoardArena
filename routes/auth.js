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

  console.log('Registering new user:', username, email);  // Logga registreringen

  // Kolla om användaren eller email redan finns
  User.findOne({ $or: [{ username }, { email }] })
    .then(existingUser => {
      if (existingUser) {
        console.log('Username or email already taken:', username, email); // Logga om användaren eller email redan finns
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
          console.log('User registered successfully:', user.username); // Logga när användaren är registrerad
          res.json({ message: 'Registration successful', username: user.username });
        })
        .catch(err => {
          console.error('Error registering user:', err); // Logga eventuella fel vid registrering
          res.status(500).json({ message: 'Error registering user' });
        });
    });
});

// Login-rutt
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt for username:', username);  // Logga inloggningsförsöket

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
            console.log('Login successful for user:', user.username);  // Logga när inloggning är framgångsrik
            res.json({
              message: 'Login successful',
              username: user.username,
              token, // Skicka token till klienten
            });
          })
          .catch(err => {
            console.error('Error updating user during login:', err); // Logga eventuella fel vid användaruppdatering
            res.status(500).json({ message: 'Error updating user', error: err });
          });
      } else {
        console.log('Invalid credentials for user:', username);  // Logga om autentisering misslyckas
        res.status(400).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => {
      console.error('Server error during login:', err);  // Logga serverfel vid inloggning
      res.status(500).json({ message: 'Server error' });
    });
});

// Logout-rutt
router.get('/logout', (req, res) => {
  const { userId } = req.body;

  console.log('Logging out user with ID:', userId);  // Logga utloggningen

  User.findById(userId)
    .then(user => {
      user.playerStatus = 'offline'; // Sätt användaren till offline vid utloggning
      user.save()
        .then(() => {
          console.log('User logged out successfully:', user.username); // Logga när användaren loggas ut
          res.json({ message: 'Logged out' });
        })
        .catch(err => {
          console.error('Error updating user status during logout:', err); // Logga eventuella fel vid utloggning
          res.status(500).json({ message: 'Error updating user status', error: err });
        });
    })
    .catch(err => {
      console.error('Error finding user during logout:', err); // Logga fel om användaren inte hittas
      res.status(500).json({ message: 'Error finding user', error: err });
    });
});

// Kontrollera om användaren är inloggad med JWT
router.get('/user', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Förväntar sig "Bearer <token>"
  
  console.log('Checking user login status with token:', token); // Logga token kontroll

  if (!token) {
    console.log('No token provided');  // Logga om ingen token finns
    return res.json({ loggedIn: false });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err); // Logga om token inte är verifierad
      return res.json({ loggedIn: false });
    }

    console.log('Token verified, decoded user:', decoded);  // Logga när token är verifierad
    User.findById(decoded.userId)
      .then(user => {
        console.log('User found:', user.username);  // Logga när användaren hittas i databasen
        res.json({ loggedIn: true, username: user.username, playerStatus: user.playerStatus });
      })
      .catch(err => {
        console.error('Error retrieving user:', err); // Logga eventuella fel vid hämtning av användare
        res.status(500).json({ message: 'Error retrieving user' });
      });
  });
});

module.exports = router;
