const mongoose = require('mongoose');

const schoolIncomeSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default:Date.now
    },
    purpose: {
        type: String,
        enum: ['Fees', 'Transportation', 'Other'],
        required: true
    },
    pendingAmount:Number,
    reason: {
        type: String,
        required: function () {
            return this.purpose === 'Other';
        }
    },
    source: {
        type: String,
        required: true,
        enum: ['student', 'other']
    },
    fullname: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: function () {
            return this.source === 'other';
        }
    },
    transactionId: String,
    registrationNumber: {
        type: String,
        required: function () {
            return this.source === 'student';
        }
    },
    class: {
        type: String,
        required: function () {
            return this.source === 'student';
        }
    },
    section: {
        type: String,
        uppercase: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    },
}, { timestamps: true });

module.exports = mongoose.model('SchoolIncome', schoolIncomeSchema)