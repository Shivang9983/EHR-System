const mongoose = require('mongoose');

// The clinical encounter represents a single visit where the doctor charts symptoms,
// performs vital checkups, and writes notes/prescriptions.
const encounterSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    symptoms: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    vitals: {
      bloodPressure: { type: String, default: '' },
      temperature: { type: Number, default: '' },
      pulse: { type: Number, default: '' },
      respiratoryRate: { type: Number, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Encounter', encounterSchema);
