const express = require('express');
const router = express.Router();
const { getVitals, addVitals, deleteVital } = require('../controllers/vitalsController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getVitals)
  .post(protect, addVitals);

router.route('/:id')
  .delete(protect, deleteVital);

module.exports = router;
