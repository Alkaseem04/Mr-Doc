const express = require('express');
const router = express.Router();
const { 
  getDoctors,
  getMyDoctorProfile,
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} = require('../controllers/doctorsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('admin'), createDoctor);

router.get('/me', protect, getMyDoctorProfile);

router.route('/:id')
  .get(getDoctorById)
  .put(protect, authorize('admin'), updateDoctor)
  .delete(protect, authorize('admin'), deleteDoctor);

module.exports = router;