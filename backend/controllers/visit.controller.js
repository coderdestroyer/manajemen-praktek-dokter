const Visit = require('../models/visit');
const Patient = require('../models/patient');
const mongoose = require('mongoose');

exports.createVisit = async (req, res) => {
  try {
    const { patient, nurse, doctor, visitDate } = req.body;

    if (!patient || !nurse || !doctor) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing (patient, nurse, doctor)'
      });
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const lastVisit = await Visit.findOne({
      visitDate: { $gte: today, $lt: tomorrow }
    }).sort({ queueNumber: -1 });

    const queueNumber = lastVisit ? lastVisit.queueNumber + 1 : 1;

    const visit = await Visit.create({
      patient,
      nurse,
      doctor,
      visitDate: visitDate || new Date(),
      queueNumber
    });

    res.status(201).json({
      success: true,
      message: 'Visit created',
      data: visit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllVisits = async (req, res) => {
  try {
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    
    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);

    const visits = await Visit.find({
      visitDate: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('patient', 'name medicalRecordNumber')
    .populate('nurse', 'name')
    .populate('doctor', 'name role')
    .sort({ queueNumber: 1 });

    res.status(200).json({
      success: true,
      data: visits
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid visit ID' });
    }

    if (!['menunggu', 'diperiksa', 'selesai'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const visit = await Visit.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!visit) {
      return res.status(404).json({ success: false, message: 'Visit not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Visit status updated',
      data: visit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
