const express = require('express');
const router = express.Router();
const Encounter = require('../models/Encounter');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

// Get encounters by patient
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const encountersList = await Encounter.find({ patientId: req.params.patientId })
      .populate('providerId', 'username role') // Note: using username now!
      .sort({ date: -1 });

    res.json({ success: true, count: encountersList.length, encounters: encountersList });
  } catch (err) {
    console.error('Error fetching encounters timeline:', err);
    res.status(500).json({ success: false, message: 'Timeline fetch error' });
  }
});

// Get encounter details
router.get('/:id', protect, async (req, res) => {
  try {
    const encounter = await Encounter.findById(req.params.id)
      .populate('patientId', 'firstName lastName age gender contactNumber')
      .populate('providerId', 'username role');

    if (!encounter) {
      return res.status(404).json({ success: false, message: 'Encounter not found' });
    }

    res.json({ success: true, encounter });
  } catch (err) {
    console.error('Error fetching encounter card:', err);
    res.status(500).json({ success: false, message: 'Error retrieving encounter record' });
  }
});

// Log clinical encounter
router.post('/', protect, async (req, res) => {
  try {
    const { patientId, symptoms, diagnosis, notes, vitals, date } = req.body;

    if (req.user.role === 'Receptionist') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden. Receptionists cannot log clinical notes. Doctor role required.' 
      });
    }

    if (!patientId || !symptoms || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Required fields missing: symptoms and diagnosis' });
    }

    const checkPatient = await Patient.findById(patientId);
    if (!checkPatient) {
      return res.status(404).json({ success: false, message: 'Patient chart not found' });
    }

    const newEncounter = new Encounter({
      patientId,
      providerId: req.user._id,
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

    // Log the audit event using compliant field names
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
