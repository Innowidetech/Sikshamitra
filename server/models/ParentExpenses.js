const mongoose = require('mongoose');

const ParentExpensesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        uppercase: true
    },
    amount: { // input field to pay
        type: Number,
        required: true,
    },
    pendingAmount: { // after paying, sum of = student.studentProfile.(Number)fees + student.studentProfile.(Number)additionalFess - amount(only if the payment status is success)
        type: Number,
        required: true,
    },
    purpose: {   // fees, uniform, other inventory items...
        type: String,
        required: true
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
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Parent'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ParentExpenses', ParentExpensesSchema);