const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctor patient', 'name email');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get my appointments (for logged in patient or doctor)
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      // Find doctor profile for this user
      const doctorProfile = await Doctor.findOne({ user: req.user.id });
      if (doctorProfile) {
        query = { doctor: doctorProfile._id };
      } else {
        query = { doctor: req.user.id };
      }
    } else {
      query = { patient: req.user.id };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('patient', 'name email phone')
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      })
      .populate('patient', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user.id && 
        appointment.doctor?.user?.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this appointment' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason, type } = req.body;
    
    // Check if double booked
    if (doctor && date && time) {
      const existing = await Appointment.findOne({
        doctor,
        date: new Date(date),
        time,
        status: { $ne: 'cancelled' }
      });
      if (existing) {
        return res.status(400).json({ message: 'This doctor is already booked for the selected date and time slot.' });
      }
    }

    const appointmentData = {
      doctor,
      date: date ? new Date(date) : new Date(),
      time: time || '10:00 AM',
      reason: reason || 'General Checkup',
      type: type || 'in-person',
      patient: req.user.id
    };

    const appointment = await Appointment.create(appointmentData);
    await appointment.populate('patient', 'name email');
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate('patient', 'name email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    });

    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};