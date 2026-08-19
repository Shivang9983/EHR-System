const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const AuditLog = require('../models/AuditLog');
const { protect, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const getJwt = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Public Registration - Creates a new Organization and Admin user
router.post('/register', validate(['username', 'password', 'organizationName']), async (req, res) => {
  try {
    const { username, password, organizationName } = req.body;

    // Check if user already exists
    const checkUser = await User.findOne({ username: username.trim() });
    if (checkUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    // Check if organization already exists
    let organization = await Organization.findOne({ name: organizationName.trim() });
    if (organization) {
      return res.status(400).json({ success: false, message: 'Organization name already registered.' });
    }

    organization = await Organization.create({ name: organizationName.trim() });

    const newUser = await User.create({
      username: username.trim(),
      password,
      role: 'Admin',
      organization: organization._id,
    });

    await AuditLog.create({
      operatorId: newUser._id,
      actionPerformed: 'REGISTER_ORGANIZATION_ADMIN',
    });

    res.status(201).json({
      success: true,
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      organizationName: organization.name,
      token: getJwt(newUser._id),
    });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ success: false, message: 'Server registration error' });
  }
});

// Admin-only Staff Registration
router.post('/register-staff', protect, checkRole(['Admin']), validate(['username', 'password', 'role']), async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!['Doctor', 'Receptionist'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid staff role specified.' });
    }

    const checkUser = await User.findOne({ username: username.trim() });
    if (checkUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    const newStaff = await User.create({
      username: username.trim(),
      password,
      role,
      organization: req.user.organization._id,
    });

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: `REGISTER_STAFF_${role.toUpperCase()}`,
    });

    res.status(201).json({
      success: true,
      _id: newStaff._id,
      username: newStaff.username,
      role: newStaff.role,
    });
  } catch (err) {
    console.error('Staff registration failed:', err);
    res.status(500).json({ success: false, message: 'Server staff registration error' });
  }
});

// User Login
router.post('/login', validate(['username', 'password']), async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.trim() })
      .select('+password')
      .populate('organization');
      
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
      organizationName: user.organization?.name || 'Default Health Clinic',
      token: getJwt(user._id),
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ success: false, message: 'Server login error' });
  }
});

// Get all doctors in organization
router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await User.find({ organization: req.user.organization._id, role: 'Doctor' })
      .select('username');
    res.json({ success: true, doctors });
  } catch (err) {
    console.error('Doctors fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
});

// Get User Profile
router.get('/me', protect, async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Profile error' });
  }
});

// Change User Password
router.put('/change-password', protect, validate(['oldPassword', 'newPassword']), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();

    await AuditLog.create({
      operatorId: user._id,
      actionPerformed: 'CHANGE_PASSWORD',
    });

    res.json({ success: true, message: 'Security credentials updated successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

module.exports = router;
