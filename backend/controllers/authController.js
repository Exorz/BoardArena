// authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrering av användare
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();

    // Lägg till username i token-payload
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, userId: user._id, username: user.username }); // Skicka tillbaka username och userId
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Inloggning av användare
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Lägg till username i token-payload
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id, username: user.username }); // Skicka tillbaka username och userId
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

