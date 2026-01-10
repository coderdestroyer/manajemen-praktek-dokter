// const MedicalRecord = require('../models/medicalRecord');
// const mongoose = require('mongoose');

// /**
//  * CREATE Medical Record
//  */
// exports.createMedicalRecord = async (req, res) => {
//   try {
//     const { visit, patient, doctor, complaint, diagnosis, physicalExam, treatment, notes } = req.body;

//     // VALIDASI FIELD WAJIB
//     if (!visit || !patient || !doctor || !complaint || !diagnosis) {
//       return res.status(400).json({
//         success: false,
//         message: 'Required fields missing (visit, patient, doctor, complaint, diagnosis)'
//       });
//     }

//     // CEK APAKAH REKAM MEDIS UNTUK VISIT SUDAH ADA
//     const exists = await MedicalRecord.findOne({ visit });
//     if (exists) {
//       return res.status(409).json({
//         success: false,
//         message: 'Medical record for this visit already exists'
//       });
//     }

//     const medicalRecord = await MedicalRecord.create({
//       visit,
//       patient,
//       doctor,
//       complaint,
//       diagnosis,
//       physicalExam,
//       treatment,
//       notes
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Medical record created',
//       data: medicalRecord
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// /**
//  * GET Medical Record by Visit
//  */
// exports.getMedicalRecordByVisit = async (req, res) => {
//   try {
//     const { visitId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(visitId)) {
//       return res.status(400).json({ success: false, message: 'Invalid visit ID' });
//     }

//     const medicalRecord = await MedicalRecord.findOne({ visit: visitId })
//       .populate('patient', 'name medicalRecordNumber')
//       .populate('doctor', 'name role');

//     if (!medicalRecord) {
//       return res.status(404).json({ success: false, message: 'Medical record not found' });
//     }

//     res.status(200).json({ success: true, data: medicalRecord });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// /**
//  * UPDATE Medical Record
//  */
// exports.updateMedicalRecord = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid medical record ID' });
//     }

//     const medicalRecord = await MedicalRecord.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!medicalRecord) {
//       return res.status(404).json({ success: false, message: 'Medical record not found' });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Medical record updated',
//       data: medicalRecord
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// /**
//  * DELETE Medical Record
//  */
// exports.deleteMedicalRecord = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid medical record ID' });
//     }

//     const medicalRecord = await MedicalRecord.findByIdAndDelete(id);

//     if (!medicalRecord) {
//       return res.status(404).json({ success: false, message: 'Medical record not found' });
//     }

//     res.status(200).json({ success: true, message: 'Medical record deleted' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };
