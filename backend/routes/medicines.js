const express = require('express');
const router = express.Router();
const { 
  getMedicines, 
  getMedicineById, 
  searchMedicines
} = require('../controllers/medicinesController');

router.route('/')
  .get(getMedicines);

router.route('/search')
  .get(searchMedicines);

router.route('/:id')
  .get(getMedicineById);

module.exports = router;