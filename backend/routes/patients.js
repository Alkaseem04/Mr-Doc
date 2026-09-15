const express = require('express');
const router = express.Router();
const { 
  getPatients, 
  getMyPatientProfile,
  updateMyPatientProfile,
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
} = require('../controllers/patientsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getPatients)
  .post(protect, authorize('admin'), createPatient);

router.route('/me')
  .get(protect, getMyPatientProfile)
  .put(protect, updateMyPatientProfile);

router.route('/:id')
  .get(protect, getPatientById)
  .put(protect, authorize('admin'), updatePatient)
  .delete(protect, authorize('admin'), deletePatient);

module.exports = router;