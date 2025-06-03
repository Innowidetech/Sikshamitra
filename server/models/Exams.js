const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    examType: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    numberOfSubjects: {
        type: Number,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        uppercase: true
    },
    exam: [{
        subjectCode: {
            type: String,
            required: true,
        },
        subject: { //subjectName
            type: String,
            required: true,
        },
        syllabus: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Teacher',
    },
}, { timestamps: true });

module.exports = mongoose.model('Exams', examSchema);