const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
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
        uppercase:true
    },
    timetable: {
        monday: [{ period: String, timing: String, subject: String }],
        tuesday: [{ period: String, timing: String, subject: String }],
        wednesday: [{ period: String, timing: String, subject: String }],
        thursday: [{ period: String, timing: String, subject: String }],
        friday: [{ period: String, timing: String, subject: String }],
        saturday: [{ period: String, timing: String, subject: String }],
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);


//add time table for teacher by admin and also attendance   