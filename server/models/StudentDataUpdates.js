const mongoose = require('mongoose');

const studentDataUpdatesSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'School',
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  updatedData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudentDataUpdates', studentDataUpdatesSchema);
