const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Encounter = require('../models/Encounter');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, async (req, res) => {
  try {
    const orgId = req.user.organization._id;

    // Fetch total counts
    const totalPatients = await Patient.countDocuments({ organization: orgId });
    const totalEncounters = await Encounter.countDocuments({ organization: orgId });
    const totalAppointments = await Appointment.countDocuments({ organization: orgId });
    const activeStaff = await User.countDocuments({ organization: orgId });

    // Fetch today's appointments count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const appointmentsToday = await Appointment.countDocuments({
      organization: orgId,
      date: { $gte: startOfToday, $lte: endOfToday },
    });

    // Fetch recent patient registry
    const recentPatients = await Patient.find({ organization: orgId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Compute monthly registration growth trend for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const patientsMonthly = await Patient.aggregate([
      {
        $match: {
          organization: orgId,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const encountersMonthly = await Encounter.aggregate([
      {
        $match: {
          organization: orgId,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format months for the UI chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1; // 1-indexed
      const y = d.getFullYear();
      const mName = monthNames[d.getMonth()];

      const patMatch = patientsMonthly.find(p => p._id.month === m && p._id.year === y);
      const encMatch = encountersMonthly.find(e => e._id.month === m && e._id.year === y);

      trendData.push({
        name: mName,
        patients: patMatch ? patMatch.count : 0,
        visits: encMatch ? encMatch.count : 0,
      });
    }

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalEncounters,
        totalAppointments,
        appointmentsToday,
        activeStaff,
      },
      recentPatients,
      trendData,
    });
  } catch (err) {
    console.error('Dashboard analytics fetch failure:', err);
    res.status(500).json({ success: false, message: 'Analytics data compilation failed' });
  }
});

module.exports = router;
