const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min:1,
      max:120,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    contactNumber: {
      type: String,
      unique:true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    medicalHistory: {
      type: String,
      default: 'None', 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);
