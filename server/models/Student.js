const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    studentProfile: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
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
            required: true,
        },
        classType:{
            type:String,
            required:true,
            enum:['primary', 'secondary'],
        },
        childOf: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Parent',
        },
        rollNumber:{
            type:String,
        },
        fees:{
            type:String,
            required:true
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'createdByModel',
    },
    createdByModel: {
        type: String,
        enum: ['User', 'Teacher'], // Either 'User' or 'Teacher'
    },
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);

//previous education - study, school name, duration year
