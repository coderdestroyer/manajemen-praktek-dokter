const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    queueNumber: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['menunggu', 'diperiksa', 'selesai'],
      default: 'menunggu'
    },
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visit', visitSchema);
