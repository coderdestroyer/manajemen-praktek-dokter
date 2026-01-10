const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  createUser,
  getUsers,
  getDoctors,
  addNurse,
  updateProfile,
  getNurses,    
  updateUser,   
  deleteUser
} = require ('../controllers/user.controller.js');

const router = express.Router();

router.use(protect);
router.put('/profile', updateProfile);
router.get('/nurses', authorize('doctor'), getNurses); 
router.get("/doctors", authorize("nurse", "doctor"), getDoctors);
router.post('/staff', authorize('doctor'), addNurse);
router.post("/", authorize("doctor"), createUser);
router.get("/", authorize("doctor"), getUsers);
router.put('/:id', authorize('doctor'), updateUser);        
router.delete('/:id', authorize('doctor'), deleteUser);     


module.exports =  router;
