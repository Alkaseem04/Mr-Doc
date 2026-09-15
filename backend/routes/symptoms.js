const express = require('express');
const router = express.Router();
const { 
  analyzeSymptoms,
  getSymptoms,
  getSymptomById,
  searchSymptoms,
  getSpellSuggestions
} = require('../controllers/symptomsController');

router.route('/analyze')
  .post(analyzeSymptoms);

router.route('/search')
  .get(searchSymptoms);

router.route('/suggestions')
  .get(getSpellSuggestions);

router.route('/')
  .get(getSymptoms);

router.route('/:id')
  .get(getSymptomById);

module.exports = router;