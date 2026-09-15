const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  bodyPart: {
    type: String,
    required: [true, 'Please add a body part'],
    trim: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild'
  },
  commonConditions: [{
    type: String,
    trim: true
  }],
  relatedSymptoms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Symptom'
  }],
  imageUrl: {
    type: String,
    match: [
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Symptom', SymptomSchema);