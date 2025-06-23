const mongoose = require('mongoose');

const ConnectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: Date,
    startTime: String,
    endDate: Date,
    endTime: String,
    connect: [{
        attendant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'membersModel'
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Denied'],
        },
    }],
    membersModel: {
        type: String,
        enum: ['User', 'School', 'Teacher', 'Student', 'Parent']
    },
    meetingLink: {
        type: String,
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    hostedByName: String,
    hostedByRole: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'createdByModel',
    },

}, { timestamps: true });

module.exports = mongoose.model('Connect', ConnectSchema);