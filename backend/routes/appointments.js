const express = require('express');
const router = express.Router();
const { 
  getAppointments,
  getMyAppointments,
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} = require('../controllers/appointmentsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getAppointments)
  .post(protect, createAppointment);

router.get('/my', protect, getMyAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

module.exports = router;