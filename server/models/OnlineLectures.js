const mongoose = require('mongoose');

const OnlineLecturesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
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
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    connect: [
        {
            attendant: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Student'
            }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('OnlineLectures', OnlineLecturesSchema);