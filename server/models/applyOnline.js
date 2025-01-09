const mongoose = require('mongoose');

const onlineSchema = new mongoose.Schema({
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
            type: String,
            required: true,
        },
        placeOfBirth: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true
        },
        aadhar: {
            type: String,
            required: true,
        },
        collegeName: {
            type: String,
            required: true,
        },
        amount:{
            type:String,
            required:true
        },
        address: {
            type: String,
            required: true,
        },
        photo: {
            url: {
                type: String,
                required: true,
            },
        },
    },
    educationDetails: [{
        school: {
            type: String,
            required: true,
        },
        class: {
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
        documents: {
            url: {
                type: String,
                required: true,
            },
        },
    }],
    parentDetails: {
        fatherName: {
            type: String,
            required: true,
        },
        motherName: {
            type: String,
            required: true,
        },
        fatherPhone: {
            type: String,
            required: true,
        },
        motherPhone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        // aadharCard: {
        //     type: String,
            // required: true,
        // },
        // voterId: {
        //     type: String,
            // required: true,
        // },
        // panCard: {
        //     type: String,
            // required: true,
        // },
    },
    paymentDetails: {
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentDate: {
            type: Date,
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Online', onlineSchema);