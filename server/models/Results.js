const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Teacher',
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
    examType:{
        type:String,
        required:true,
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Exams'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    result: [{  //class and section, exam type
        subjectCode: {
            type: String,
            required: true,
            // unique:true,
        },
        subject: {
            type: String,
            required: true,
        },
        marks: {
            type: Number,
            required: true,
        },
        outOfMarks: {
            type: Number,
            required: true,
        },
        grade: {
            type: String,
            required: true,
        },
    }],
    total: {
        type: String,
        required: true,
    },
    totalPercentage:{
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Results', resultsSchema);