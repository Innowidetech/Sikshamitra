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
    amount: { 
        type: Number,
        required: true,
    },
    pendingAmount: { 
        type: Number,
        required: true,
    },
    purpose: {   // fees, inventory
        type: String,
        enum:['Fees','Other','Transportation'],
        required: true
    },
    reason: {
        type: String,
        required: function () {
          return this.purpose === 'Other';
        },
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