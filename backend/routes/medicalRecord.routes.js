// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth.middleware');
// const { authorize } = require('../middleware/role.middleware');
// const {
//   createMedicalRecord,
//   getMedicalRecordByVisit,
//   updateMedicalRecord,
//   deleteMedicalRecord
// } = require('../controllers/medrecord.controller');



// router.use(protect);

// router.post('/', authorize('doctor'), createMedicalRecord);
// router.get('/visit/:visitId', authorize('doctor'), getMedicalRecordByVisit);
// // UPDATE
// router.put('/:id', authorize('doctor'), updateMedicalRecord);

// // DELETE
// router.delete('/:id', authorize('doctor'), deleteMedicalRecord);


// module.exports = router;
