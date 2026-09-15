const express = require('express');
const router = express.Router();
const { 
  getHospitals, 
  getHospitalById, 
  searchHospitals,
  getNearbyHospitals,
  verifyHospital
} = require('../controllers/hospitalsController');

router.route('/')
  .get(getHospitals);

router.route('/search')
  .get(searchHospitals);

router.route('/nearby')
  .get(getNearbyHospitals);

router.route('/verify')
  .post(verifyHospital);

router.route('/:id')
  .get(getHospitalById);

module.exports = router;