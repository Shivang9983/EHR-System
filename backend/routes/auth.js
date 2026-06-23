const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');


const getJwt = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required!' });
    }

    const checkUser = await User.findOne({ username });
    if (checkUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    const newUser = await User.create({
      username,
      password,
      role: role || 'Doctor',
    });

    
    await AuditLog.create({
      operatorId: newUser._id,
      actionPerformed: 'REGISTER_PROVIDER',
    });

    res.status(201).json({
      success: true,
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      token: getJwt(newUser._id),
    });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ success: false, message: 'Server registration error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Provide username and password.' });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const correctPassword = await user.matchPassword(password);
    if (!correctPassword) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    
    await AuditLog.create({
      operatorId: user._id,
      actionPerformed: 'LOGIN',
    });

    res.json({
      success: true,
      _id: user._id,
      username: user.username,
      role: user.role,
      token: getJwt(user._id),
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ success: false, message: 'Server login error' });
  }
});


router.get('/me', protect, async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Profile error' });
  }
});

module.exports = router;
