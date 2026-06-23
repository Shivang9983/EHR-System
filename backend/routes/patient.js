const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Patient = require('../models/Patient');
const Encounter = require('../models/Encounter');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search?.trim()) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { contactNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
    });
  }
});

// Get single patient
router.get('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID',
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
    });
  }
});

// Create patient
router.post('/', protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      contactNumber,
      email,
      medicalHistory,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    const existingPatient = await Patient.findOne({
      contactNumber,
    });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient already exists',
      });
    }

    const patient = await Patient.create({
      firstName,
      lastName,
      age,
      gender,
      contactNumber,
      email,
      medicalHistory,
      createdBy: req.user._id,
    });

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'REGISTER_PATIENT',
    });

    res.status(201).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
    });
  }
});

// Update patient
router.put('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID',
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    Object.assign(patient, req.body);

    const updatedPatient = await patient.save();

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'UPDATE_PATIENT',
    });

    res.status(200).json({
      success: true,
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
    });
  }
});

// Delete patient
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID',
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Delete all encounters associated with the patient
    await Encounter.deleteMany({ patientId: req.params.id });

    // Delete patient record
    await Patient.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'DELETE_PATIENT',
    });

    res.status(200).json({
      success: true,
      message: 'Patient and associated encounters deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
    });
  }
});

module.exports = router;