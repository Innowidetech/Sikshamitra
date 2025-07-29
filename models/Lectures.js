const mongoose = require('mongoose');

const TeacherTimetableSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    timetable: {
        monday: [{ startTime: String, endTime: String, class: String, section: { type: String, uppercase: true }, subject: String }],
        tuesday: [{ startTime: String, endTime: String, class: String, section: { type: String, uppercase: true }, subject: String }],
        wednesday: [{ startTime: String, endTime: String, class: String, section: { type: String, uppercase: true }, subject: String }],
        thursday: [{ startTime: String, endTime: String, class: String, section: { type: String, uppercase: true }, subject: String }],
        friday: [{ startTime: String, endTime: String, class: String, section: { type: String, uppercase: true }, subject: String }],
        saturday: [{ startTime: String, endTime: String, class: String, section: { type: String, uppercase: true }, subject: String }],
    }
}, { timestamps: true });

module.exports = mongoose.model('TeacherTimetable', TeacherTimetableSchema);
