const express = require('express');
const router = express.Router();
const { 
  getDiets, 
  getDietById, 
  getDietByDisease
} = require('../controllers/dietController');

router.route('/')
  .get(getDiets);

router.route('/:id')
  .get(getDietById);

router.route('/disease/:diseaseName')
  .get(getDietByDisease);

module.exports = router;