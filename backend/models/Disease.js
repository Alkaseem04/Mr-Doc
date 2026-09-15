const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
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
  symptoms: {
    type: [String],
    required: [true, 'Please add symptoms']
  },
  treatment: {
    type: [String],
    required: [true, 'Please add treatment options']
  },
  medication: {
    type: [String],
    required: [true, 'Please add medication options']
  },
  diet: {
    type: [String],
    required: [true, 'Please add diet recommendations']
  },
  urgency: {
    type: String,
    required: [true, 'Please add urgency level'],
    enum: ['self-care', 'consult-doctor', 'emergency']
  },
  tests: {
    type: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Disease', DiseaseSchema);