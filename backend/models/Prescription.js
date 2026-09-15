const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String }
  }],
  advice: {
    type: String
  },
  followUpDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
