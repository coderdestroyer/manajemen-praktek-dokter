const Patient = require('../models/patient');
const mongoose = require('mongoose');

/**
 * CREATE patient
 */
exports.createPatient = async (req, res) => {
  const { medicalRecordNumber, name, gender, birthDate, address, phone } = req.body;

  // VALIDATION
  if (!medicalRecordNumber || !name || !gender || !birthDate || !address || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Required fields missing'
    });
  }

  const exists = await Patient.findOne({ medicalRecordNumber });
  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'Patient already exists'
    });
  }

  const patient = await Patient.create(req.body);

  res.status(201).json({  
    success: true,
    message: 'Patient created',
    data: patient
  });
};

/**
 * GET all patients
 */
exports.getPatients = async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: patients
  });
};

/**
 * GET patient by ID
 */
exports.getPatientById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient ID'
    });
  }

  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }

  res.status(200).json({
    success: true,
    data: patient
  });
};

/**
 * UPDATE patient
 */
exports.updatePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient ID'
    });
  }

  const patient = await Patient.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Patient updated',
    data: patient
  });
};

/**
 * DELETE patient
 */
exports.deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient ID'
    });
  }

  const patient = await Patient.findByIdAndDelete(id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Patient deleted'
  });
};
