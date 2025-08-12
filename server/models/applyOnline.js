const mongoose = require('mongoose');

const onlineSchema = new mongoose.Schema({
    studentDetails: {
        firstName: {
            type: String,
            //  required: true
        },
        lastName: {
            type: String,
            //  required: true
        },
        dob: {
            type: String,
            //    required: true,
        },
        placeOfBirth: {
            type: String,
            required: true,
        },
        email: {
            type: String,
           // required: true,
        },
        aadhar: {
            type: String,
            //     required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            //    required:true,
        },
        schoolName: {
            type: String,
            //    required: true,
        },
        classToJoin: {
            type: String,
            //    required: true,
        },
        admissionFees: { //based on class
            type: String,
            //    required:true
        },
        address: {
            type: String,
            required: true,
        },
        photo: {
            url: {
                type: String,
                //    required: true,
            },
        },
        examId: {
            type: String,
            required: true,
        },
        resultPercentage: {
            type: String,
            required: true,
        },
    },
    parentDetails: {
        fatherName: {
            type: String,
            // required: true,
        },
        motherName: {
            type: String,
        },
        fatherPhone: {
            type: String,
            // required: true,
        },
        motherPhone: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        aadharCard: {
            type: String,
            required: true,
        },
        voterId: {
            type: String,
            required: true,
        },
        panCard: {
            type: String,
            required: true,
        },
    },
    paymentDetails: {
        razorpayOrderId: {
            type: String,
            default: null
        },
        razorpayPaymentId: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed', 'not_required'],
            default: 'pending',
        },
    },
    approval: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Online', onlineSchema);
