const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
  condition: {
    type: String,
    required: [true, 'Please add a condition'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  recommendations: [{
    food: String,
    benefits: String,
    portion: String
  }],
  foodsToAvoid: [{
    food: String,
    reason: String
  }],
  mealPlan: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String
  },
  nutrients: [{
    name: String,
    amount: String,
    unit: String
  }],
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Diet', DietSchema);