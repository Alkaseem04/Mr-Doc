const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: [true, 'Please add a file name']
  },
  originalName: {
    type: String,
    required: [true, 'Please add the original file name']
  },
  mimeType: {
    type: String,
    required: [true, 'Please add a MIME type']
  },
  size: {
    type: Number,
    required: [true, 'Please add file size']
  },
  description: {
    type: String,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  cloudUrl: {
    type: String
  },
  localPath: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);