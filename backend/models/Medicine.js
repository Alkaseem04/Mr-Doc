const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  uses: [{
    type: String,
    trim: true
  }],
  dosage: {
    type: String,
    required: [true, 'Please add dosage information']
  },
  sideEffects: [{
    type: String,
    trim: true
  }],
  precautions: [{
    type: String,
    trim: true
  }],
  interactions: [{
    medicine: String,
    effect: String
  }],
  imageUrl: {
    type: String,
    match: [
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', MedicineSchema);