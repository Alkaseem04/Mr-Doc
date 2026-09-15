const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'managed', 'resolved'],
      default: 'active'
    }
  }],
  allergies: [{
    allergen: String,
    reaction: String
  }],
  currentMedications: [{
    medicine: String,
    dosage: String,
    frequency: String,
    prescribedDate: Date
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  insurance: {
    provider: String,
    policyNumber: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', PatientSchema);