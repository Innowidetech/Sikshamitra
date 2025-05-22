const mongoose = require('mongoose');

const ClassTimetableSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        uppercase: true
    },
    timetable: {
        monday: [{ startTime: String, endTime: String, subject: String, teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }],
        tuesday: [{ startTime: String, endTime: String, subject: String, teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }],
        wednesday: [{ startTime: String, endTime: String, subject: String, teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }],
        thursday: [{ startTime: String, endTime: String, subject: String, teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }],
        friday: [{ startTime: String, endTime: String, subject: String, teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }],
        saturday: [{ startTime: String, endTime: String, subject: String, teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }],
    }
}, { timestamps: true });

module.exports = mongoose.model('ClassTimetable', ClassTimetableSchema);
