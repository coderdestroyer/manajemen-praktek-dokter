const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit',
      required: true,
      unique: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    complaint: {
      type: String,
      required: true
    },
    physicalExam: {
      type: String
    },
    diagnosis: {
      type: String,
      required: true
    },
    treatment: {
      type: String
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
