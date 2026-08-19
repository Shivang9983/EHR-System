const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, checkRole } = require('../middleware/auth');
const Patient = require('../models/Patient');
const { generateSoapNote } = require('../services/aiScribeService');

// Multer memory storage for audio dictations
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max audio
});

/**
 * @route   POST /api/ai/scribe
 * @desc    Generate structured SOAP note and extract vitals from consultation notes/audio using Gemini AI
 * @access  Protected (Admin, Doctor)
 */
router.post(
  '/scribe',
  protect,
  checkRole(['Admin', 'Doctor']),
  upload.single('audio'),
  async (req, res) => {
    try {
      const { transcript, patientId } = req.body;

      if (!transcript && !req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please provide consultation transcript text or record an audio dictation.',
        });
      }

      let patientContext = {};
      if (patientId) {
        const patient = await Patient.findOne({
          _id: patientId,
          organization: req.user.organization._id,
        });
        if (patient) {
          patientContext = {
            name: `${patient.firstName} ${patient.lastName}`,
            age: patient.age,
            gender: patient.gender,
            medicalHistory: patient.medicalHistory,
          };
        }
      }

      const result = await generateSoapNote({
        transcript: transcript || '',
        patientContext,
        audioFile: req.file || null,
      });

      res.json({
        success: true,
        scribeResult: result,
      });
    } catch (err) {
      console.error('AI Scribe Endpoint Error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'AI Clinical Scribe generation failed.',
      });
    }
  }
);

module.exports = router;
