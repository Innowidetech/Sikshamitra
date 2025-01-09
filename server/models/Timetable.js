const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
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
    timetable: {
        monday: [{ period: String, timing: String, subject: String }],
        tuesday: [{ period: String, timing: String, subject: String }],
        wednesday: [{ period: String, timing: String, subject: String }],
        thursday: [{ period: String, timing: String, subject: String }],
        friday: [{ period: String, timing: String, subject: String }],
        saturday: [{ period: String, timing: String, subject: String }],
    },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);