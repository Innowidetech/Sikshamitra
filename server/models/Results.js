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
    result: [{
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
    }],
    total: {
        type: String,
        required: true,
    },
    // grade: {
    //     type: String,
    //     required: true,
    // },

}, { timestamps: true });

module.exports = mongoose.model('Results', resultsSchema);

//subject code, grade

//specific search - fetch with roll number, name, father name, year

// get contact and email