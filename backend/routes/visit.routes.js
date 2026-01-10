const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  createVisit,
  getAllVisits,
  updateVisitStatus
} = require('../controllers/visit.controller');

router.use(protect);
router.post("/", authorize("nurse"), createVisit);
router.get("/today", authorize("nurse", "doctor"), getAllVisits);
router.put("/:id/status", authorize("doctor"), updateVisitStatus);

module.exports = router;
