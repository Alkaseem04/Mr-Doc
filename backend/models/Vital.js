const mongoose = require('mongoose');

const VitalSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  systolic: {
    type: Number,
    required: false
  },
  diastolic: {
    type: Number,
    required: false
  },
  heartRate: {
    type: Number,
    required: false
  },
  bloodGlucose: {
    type: Number,
    required: false
  },
  weight: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: false
  },
  waterIntake: {
    type: Number,
    default: 0
  },
  steps: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vital', VitalSchema);
