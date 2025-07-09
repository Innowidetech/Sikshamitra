const mongoose = require('mongoose');
const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    profile: {
        fullname: {
            type: String,
            required: true
        },
        phoneNumber: {
            required: true,
            type: String,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },
        address: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        pob: {
            type: String,
            required: true,
        },
        employeeId: {
            type: String,
            required: true,
            unique:true,
        },
        class: {
            type: String,
        },
        section: {
            type: String,
            uppercase: true,
        },
        subjects: {
            type: [String],
        },
        salary: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
        },
        ifscCode: {
            type: String,
            required: true,
        },
        accountHolderName: {
            type: String,
            required: true,
        },
    },
    education: [{
        university: {
            type: String,
            required: true,
        },
        degree: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('Teacher', teacherSchema)