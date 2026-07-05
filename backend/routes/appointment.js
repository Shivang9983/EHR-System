const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Get all appointments for organization
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ organization: req.user.organization._id })
      .populate('patientId', 'firstName lastName contactNumber')
      .populate('doctorId', 'username')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// Create appointment
router.post('/', protect, checkRole(['Admin', 'Receptionist']), validate(['patientId', 'doctorId', 'date', 'time', 'reason']), async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, notes } = req.body;

    // Validate patient exists in organization
    const patient = await Patient.findOne({ _id: patientId, organization: req.user.organization._id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found in this organization' });
    }

    // Validate doctor exists in organization
    const doctor = await User.findOne({ _id: doctorId, organization: req.user.organization._id, role: 'Doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found in this organization' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      organization: req.user.organization._id,
      date,
      time,
      reason,
      notes: notes || '',
      status: 'Scheduled',
    });

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'CREATE_APPOINTMENT',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'firstName lastName contactNumber')
      .populate('doctorId', 'username');

    res.status(201).json({ success: true, appointment: populatedAppointment });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ success: false, message: 'Failed to schedule appointment' });
  }
});

// Update appointment (e.g. status, date, time, doctorId)
router.put('/:id', protect, checkRole(['Admin', 'Receptionist', 'Doctor']), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOne({ _id: req.params.id, organization: req.user.organization._id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Role restriction check for specific status transitions:
    // If role is Doctor, they can change status to Completed or Cancelled but shouldn't reschedule/reassign.
    // If role is Receptionist, they can schedule, cancel, reschedule.
    const updates = { ...req.body };
    delete updates.organization; // Security block

    if (updates.doctorId) {
      const doctor = await User.findOne({ _id: updates.doctorId, organization: req.user.organization._id, role: 'Doctor' });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Selected doctor not found in this organization' });
      }
    }

    Object.assign(appointment, updates);
    const updatedAppointment = await appointment.save();

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: `UPDATE_APPOINTMENT_${updates.status ? updates.status.toUpperCase() : 'DETAILS'}`,
    });

    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patientId', 'firstName lastName contactNumber')
      .populate('doctorId', 'username');

    res.json({ success: true, appointment: populatedAppointment });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
});

// Delete appointment
router.delete('/:id', protect, checkRole(['Admin', 'Receptionist']), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, organization: req.user.organization._id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'DELETE_APPOINTMENT',
    });

    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ success: false, message: 'Failed to delete appointment' });
  }
});

module.exports = router;
