const Vital = require('../models/Vital');

// @desc    Get patient vitals
// @route   GET /api/vitals
// @access  Private
const getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ patient: req.user.id }).sort({ date: -1 }).limit(30);
    res.status(200).json(vitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new vitals entry
// @route   POST /api/vitals
// @access  Private
const addVitals = async (req, res) => {
  try {
    const vital = await Vital.create({
      ...req.body,
      patient: req.user.id
    });
    res.status(201).json(vital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete vitals entry
// @route   DELETE /api/vitals/:id
// @access  Private
const deleteVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id);
    if (!vital) {
      return res.status(404).json({ message: 'Vital record not found' });
    }
    if (vital.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Vital.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Vital entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVitals,
  addVitals,
  deleteVital
};
