const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    medicalRecordNumber: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      enum: ['L', 'P'],
      required: true
    },
        birthDate: {
      type: Date,
      required: true
    },
    address: {
      type: String
    },
    phone: {
      type: String
    },
    bloodType: {
      type: String,
      enum: ['A', 'B', 'AB', 'O']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
