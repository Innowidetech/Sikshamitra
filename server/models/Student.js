const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({ 
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        // required:true,
        ref:'School'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    studentProfile: {
        fullname: {
            type: String,
            required: true
        },
        gender:{
            type:String,
            required:true,
            enum:['male','female']
        },
        dob: {
            type: Date,
            required: true,
        },
        photo:{
            type:String,
            required:true,
        },
        address: {
            type: String,
            required: true,
        },
        about:String,
        registrationNumber: {
            type: String,
            required: true,
            unique:true,
        },
        class: {
            type: String,
            required: true
        },
        section: {
            type: String,
            // required: true,
            uppercase:true,
        },
        classType:{
            type:String,
            required:true,
            enum:['primary', 'secondary'],
        },
        childOf: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        rollNumber:String,
        fees:{
            type:String,
            required:true
        },
        additionalFees:{
            type:Number,
            required:true,
            default:0
        },
        previousEducation:[
            {
                study:String, //class
                schoolName:String,
                duration:String, //from date - to date
            }
        ],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'createdByModel',
    },
    createdByModel: {
        type: String,
        enum: ['User', 'Teacher'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);