const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const MedicalFile = require('../models/MedicalFile');
const Patient = require('../models/Patient');
const { protect, checkRole } = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('WARNING: Cloudinary credentials missing in .env. Falling back to upload simulation.');
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload patient file
router.post('/upload', protect, checkRole(['Admin', 'Doctor']), upload.single('file'), async (req, res) => {
  try {
    const { patientId, fileType, name } = req.body;
    if (!patientId || !fileType || !name) {
      return res.status(400).json({ success: false, message: 'patientId, fileType, and name are required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a file to upload' });
    }

    const patient = await Patient.findOne({ _id: patientId, organization: req.user.organization._id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found in this organization' });
    }

    let url = '';
    let cloudinaryId = '';

    if (isCloudinaryConfigured) {
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `ehr_systems/${req.user.organization.name.replace(/\s+/g, '_')}/${patientId}`,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const cloudinaryResult = await uploadStream();
      url = cloudinaryResult.secure_url;
      cloudinaryId = cloudinaryResult.public_id;
    } else {
      // Simulate Cloudinary upload by generating a temporary mock url
      url = `https://res.cloudinary.com/demo/image/upload/v1585827365/sample.jpg`;
      cloudinaryId = `mock_id_${Date.now()}`;
    }

    const medicalFile = await MedicalFile.create({
      name: name.trim(),
      url,
      cloudinaryId,
      fileType,
      patientId,
      organization: req.user.organization._id,
      uploadedBy: req.user._id,
      fileSize: req.file.size,
    });

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'UPLOAD_PATIENT_FILE',
    });

    const populatedFile = await MedicalFile.findById(medicalFile._id).populate('uploadedBy', 'username');

    res.status(201).json({ success: true, file: populatedFile });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

// Get patient files
router.get('/patient/:patientId', protect, checkRole(['Admin', 'Doctor', 'Receptionist']), async (req, res) => {
  try {
    const files = await MedicalFile.find({
      patientId: req.params.patientId,
      organization: req.user.organization._id,
    })
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: files.length, files });
  } catch (err) {
    console.error('Fetch patient files error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch patient files' });
  }
});

// Delete patient file
router.delete('/:id', protect, checkRole(['Admin', 'Doctor']), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid file ID' });
    }

    const file = await MedicalFile.findOne({ _id: req.params.id, organization: req.user.organization._id });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (isCloudinaryConfigured && !file.cloudinaryId.startsWith('mock_id_')) {
      await cloudinary.uploader.destroy(file.cloudinaryId);
    }

    await MedicalFile.findByIdAndDelete(file._id);

    await AuditLog.create({
      operatorId: req.user._id,
      actionPerformed: 'DELETE_PATIENT_FILE',
    });

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete file' });
  }
});

module.exports = router;
