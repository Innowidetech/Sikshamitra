const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    parentProfile: {
        fatherName: {   //or guardian
            required: true,
            type: String,
        },
        motherName: {
            type: String,
        },
        fatherPhoneNumber: { //or guardian
            required: true,
            type: String,
        },
        motherPhoneNumber: {
            type: String,
        },
        fatherOccupation: {
            // required: true,
            type: String,
        },
        motherOccupation: {
            type: String,
        },
        fatherAddress: { //or guardian
            type: String,
            required: true,
        },
        // guardianName: {
        //     type: String,
        // },
        // guardianPhoneNumber: {
        //     type: String,
        // },
        // guardianAddress: {
        //     type: String,
        // },
        parentOf: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        }
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
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Parent', parentSchema);