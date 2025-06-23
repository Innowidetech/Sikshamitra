const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    parentProfile: {
        priority:{
            type:String,
            enum:['Father', 'Mother', 'Guardian']
        },
        fatherName: {   //or guardian
            type: String,
        },
        motherName: {
            type: String,
        },
        fatherPhoneNumber: { //or guardian
            type: String,
        },
        motherPhoneNumber: {
            type: String,
        },
        photo:String,
        fatherOccupation: {
            type: String,
        },
        motherOccupation: {
            type: String,
        },
        parentAddress: { //or guardian
            type: String,
            required: true,
        },
        parentOf: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        }]
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

module.exports = mongoose.model('Parent', parentSchema);