const express = require('express');
const router = express.Router();
const Encounter = require('../models/Encounter');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const { protect, checkRole } = require('../middleware/auth');

// Get encounters timeline for a patient
router.get('/patient/:patientId', protect, checkRole(['Admin', 'Doctor']), async (req, res) => {
  try {
    // Make sure patient belongs to organization
    const checkPatient = await Patient.findOne({
      _id: req.params.patientId,
      organization: req.user.organization._id,
    });

    if (!checkPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found in this organization.' });
    }

    const encountersList = await Encounter.find({
      patientId: req.params.patientId,
      organization: req.user.organization._id,
    })
      .populate('providerId', 'username role')
      .sort({ date: -1 });

    res.json({ success: true, count: encountersList.length, encounters: encountersList });
  } catch (err) {
    console.error('Error fetching encounters timeline:', err);
    res.status(500).json({ success: false, message: 'Timeline fetch error' });
  }
});

// Get single encounter details
router.get('/:id', protect, checkRole(['Admin', 'Doctor']), async (req, res) => {
  try {
    const encounter = await Encounter.findOne({
      _id: req.params.id,
      organization: req.user.organization._id,
    })
      .populate({
        path: 'patientId',
        select: 'firstName lastName age gender contactNumber',
        match: { organization: req.user.organization._id },
      })
      .populate('providerId', 'username role');

    if (!encounter || !encounter.patientId) {
      return res.status(404).json({ success: false, message: 'Encounter not found' });
    }

    res.json({ success: true, encounter });
  } catch (err) {
    console.error('Error fetching encounter card:', err);
    res.status(500).json({ success: false, message: 'Error retrieving encounter record' });
  }
});

// Create clinical encounter
router.post('/', protect, checkRole(['Admin', 'Doctor']), async (req, res) => {
  try {
    const { patientId, symptoms, diagnosis, notes, vitals, date } = req.body;

    if (!patientId || !symptoms || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Required fields missing: symptoms and diagnosis' });
    }

    const checkPatient = await Patient.findOne({
      _id: patientId,
      organization: req.user.organization._id,
    });
    
    if (!checkPatient) {
      return res.status(404).json({ success: false, message: 'Patient chart not found in this organization.' });
    }

    const newEncounter = new Encounter({
      patientId,
      providerId: req.user._id,
      organization: req.user.organization._id,
      symptoms,
      diagnosis,
      notes: notes || '',
      vitals: {
        bloodPressure: vitals?.bloodPressure || '',
        temperature: vitals?.temperature || '',
        pulse: vitals?.pulse || '',
        respiratoryRate: vitals?.respiratoryRate || '',
      },
      date: date || Date.now(),
    });

    const savedEncounter = await newEncounter.save();

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'CREATE_ENCOUNTER',
    });

    const finalEncounter = await Encounter.findById(savedEncounter._id).populate('providerId', 'username role');

    res.status(201).json({ success: true, encounter: finalEncounter });
  } catch (err) {
    console.error('Error logging encounter:', err);
    res.status(500).json({ success: false, message: 'Error saving encounter note' });
  }
});

module.exports = router;
