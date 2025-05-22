const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        uppercase:true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    attendance: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
            status: { type: String, enum: ['Present', 'Absent', 'Holiday'], required: true },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);