const mongoose = require('mongoose');

const ApplyForEntranceExamSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    academicYear: {
        type: Number,
        required: true
    },
    classApplying: {
        type: Number,
        required: true
    },
    studentDetails: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        aadharNo: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female']
        },
        photo: {
            type: String,
            required: true,
        }
    },
    previousSchoolDetails: {
        schoolName: {
            type: String,
            required: true,
        },
        lastClassAttended: {
            type: Number,
            required: true,
        },
        board: {
            type: String,
            required: true,
            enum: ['CBSE', 'ICSE', 'State Board', 'Others']
        },
        schoolBoard: {
            type: String,
            required: function () {
                return this.board === 'Others'
            }
        },
        percentage: {
            type: String,
            required: true
        }
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','sent'],
        required:true,
    },
    examId:String,
    examLink:String,
    examDate:Date,
    startTime:String,
    endTime:String
}, { timestamps: true });

module.exports = mongoose.model('ApplyForEntranceExam', ApplyForEntranceExamSchema);