const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        uppercase:true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Exams'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    result: [{  //class and section, exam type
        subjectCode: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        marksObtained: {
            type: Number,
            required: true,
        },
        totalMarks: {
            type: Number,
            required: true,
        },
        grade: {
            type: String,
            required: true,
            uppercase:true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'Teacher',
        },
    }],
    total: {
        type: String,
    },
    totalPercentage:{
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Results', resultsSchema);