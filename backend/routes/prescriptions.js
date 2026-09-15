const express = require('express');
const router = express.Router();
const { getMyPrescriptions, getPrescriptionById, createPrescription, getPrescriptionPdf } = require('../controllers/prescriptionsController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getMyPrescriptions)
  .post(protect, createPrescription);

router.route('/:id/pdf')
  .get(protect, getPrescriptionPdf);

router.route('/:id')
  .get(protect, getPrescriptionById);

module.exports = router;

