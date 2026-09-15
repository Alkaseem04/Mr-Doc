const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get medicine by ID
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search medicines
// @route   GET /api/medicines/search
// @access  Public
const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }
    
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { uses: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json(medicines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  searchMedicines
};