const Diet = require('../models/Diet');

// @desc    Get all diets
// @route   GET /api/diet
// @access  Public
const getDiets = async (req, res) => {
  try {
    const diets = await Diet.find();
    res.status(200).json(diets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get diet by ID
// @route   GET /api/diet/:id
// @access  Public
const getDietById = async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id);

    if (!diet) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.status(200).json(diet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get diet by disease name
// @route   GET /api/diet/disease/:diseaseName
// @access  Public
const getDietByDisease = async (req, res) => {
  try {
    const diet = await Diet.findOne({ 
      disease: { $regex: new RegExp(req.params.diseaseName, 'i') } 
    });

    if (!diet) {
      return res.status(404).json({ message: 'Diet plan not found for this disease' });
    }

    res.status(200).json(diet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDiets,
  getDietById,
  getDietByDisease
};