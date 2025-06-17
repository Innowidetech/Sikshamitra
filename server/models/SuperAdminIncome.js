const mongoose = require('mongoose');

const SuperAdminIncomeSchema = new mongoose.Schema({
    // schoolId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'School'
    // },
    schoolCode: {
        type: String,
        required: true,
    },
    schoolName: {
        type: String,
        required: true,
    },
    principalName: {
        type: String,
        required: true,
    },
    totalFees: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    dueAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Online', 'Cash'],
        required: true,
    },
    transactionId: {
        type: String,
        required:true
    },
}, { timestamps: true });

module.exports = mongoose.model('SuperAdminIncome', SuperAdminIncomeSchema)