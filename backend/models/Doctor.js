const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add a license number'],
    unique: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  hospital: {
    type: String,
    trim: true
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocument: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', DoctorSchema);