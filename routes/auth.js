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
