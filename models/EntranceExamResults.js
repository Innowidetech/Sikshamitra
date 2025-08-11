const mongoose = require('mongoose');

const EntranceExamResultsSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'ApplyForEntranceExam',
    },
    examId:{
        type:String,
        require:true
    },
    resultPercentage:{
        type:String,
        require:true
    },
    status:{ //result status of applicants
        type:String,
        default:'pending',
        enum:['pending','sent'],
        required:true,
    },
}, { timestamps: true });

module.exports = mongoose.model('EntranceExamResults', EntranceExamResultsSchema);