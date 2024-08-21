const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { firstName, secondName, email, newPassword, conformPassword, address, city, state, zip, terms } = req.body;

  // Validate input
  if (newPassword !== conformPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    const user = new User({
      firstName,
      secondName,
      email,
      password: newPassword,
      address,
      city,
      state,
      zip,
      terms
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    res.status(200).json({ msg: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
