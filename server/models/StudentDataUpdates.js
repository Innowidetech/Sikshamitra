// const mongoose = require('mongoose');

// const studentDataUpdatesSchema = new mongoose.Schema({
//   schoolId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'School',
//   },
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Student',
//     required: true,
//   },
//   previousData: {
//     type: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   updatedData: {
//     type: mongoose.Schema.Types.Mixed,
//     required: true,
//   },
//   reason: {
//     type: String,
//     required: true,
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//   },
// }, { timestamps: true, });

// module.exports = mongoose.model('StudentDataUpdates', studentDataUpdatesSchema);


const mongoose = require('mongoose');

const studentDataUpdatesSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'School',
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  dataHistory: [{
    previousData: {
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
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }],
});

module.exports = mongoose.model('StudentDataUpdates', studentDataUpdatesSchema);
