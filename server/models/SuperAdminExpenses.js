const mongoose = require('mongoose');

const SuperAdminExpensesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    modeOfPayment: {
        type: String,
        enum: ['Online', 'Cash'],
        required: true,
    },
    transactionId: {
        type: String,
        required:true
    },
}, { timestamps: true });

module.exports = mongoose.model('SuperAdminExpenses', SuperAdminExpensesSchema)