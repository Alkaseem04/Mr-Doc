const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email phone avatar');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current doctor profile
// @route   GET /api/doctors/me
// @access  Private (Doctor)
const getMyDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email phone avatar');
    if (!doctor) {
      // Create empty profile if first time
      doctor = await Doctor.create({
        user: req.user.id,
        specialization: 'General Physician',
        licenseNumber: 'LIC-' + Math.floor(100000 + Math.random() * 900000),
        experience: 5,
        consultationFee: 500
      });
      await doctor.populate('user', 'name email phone avatar');
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email phone avatar');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getMyDoctorProfile,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};