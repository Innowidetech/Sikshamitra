const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
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
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    attendance: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
            status: { type: String, enum: ['Present', 'Absent', 'Holiday', 'Leave', 'Late'], required: true },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);