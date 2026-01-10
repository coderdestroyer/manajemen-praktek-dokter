const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require ('../controllers/patient.controller.js');

const router = express.Router();

router.use(protect);

router.post("/", authorize("nurse", "doctor"), createPatient);
router.get("/", authorize("nurse", "doctor"), getPatients);
router.get("/:id", authorize("nurse", "doctor"), getPatientById);
router.put("/:id", authorize("nurse", "doctor"), updatePatient);
router.delete("/:id", authorize("nurse", "doctor"), deletePatient);

module.exports =  router;
