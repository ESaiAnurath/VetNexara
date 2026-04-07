const mongoose = require('mongoose');

const ResumeScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    required: true
  },
  parsedSkills: [String],
  missingSkills: [String],
  recommendations: [String],
  jobMatch: String,

  scannedAt: {
    type: Date,
    default: Date.now
  }, // ✅ FIXED (comma added)

  careerPaths: [
    {
      role: String,
      match: Number,
      timeline: String,
      focus: String
    }
  ],

  jobMatches: [
    {
      role: String,
      matchScore: Number
    }
  ],

  interviewTopics: [String],

  projectSuggestions: [String],
});

module.exports = mongoose.model('ResumeScan', ResumeScanSchema);