const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', 'name email phone avatar');
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in patient profile
// @route   GET /api/patients/me
// @access  Private
const getMyPatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ user: req.user.id }).populate('user', 'name email phone avatar address gender dateOfBirth');
    if (!patient) {
      patient = await Patient.create({ user: req.user.id });
      await patient.populate('user', 'name email phone avatar address gender dateOfBirth');
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update logged in patient profile
// @route   PUT /api/patients/me
// @access  Private
const updateMyPatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      patient = await Patient.create({ user: req.user.id, ...req.body });
    } else {
      patient = await Patient.findOneAndUpdate({ user: req.user.id }, req.body, {
        new: true,
        runValidators: true,
      });
    }
    await patient.populate('user', 'name email phone avatar address gender dateOfBirth');
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private/Admin
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private/Admin
const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private/Admin
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Patient removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPatients,
  getMyPatientProfile,
  updateMyPatientProfile,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};