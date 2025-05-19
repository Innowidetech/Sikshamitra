const mongoose = require('mongoose');

const addSchoolIncomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
        required:true
    },
    purpose: {
        type: String,
        enum:['Fees','Inventory','Transportation','Other'],
        required:true
    },
    purposeReason: {
        type: String,
        required: function () {
            return this.purpose === 'Other';
        }
    },
    source: {
        type: String,
        required:true,
        enum: ['student', 'other']
    },
    name: {
        type: String,
        required:true
    },
    organisation: {
        type: String,
        required: function () {
            return this.source === 'other';
        }
    },
    transactionId:String,
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
        uppercase:true,
        required: function () {
            return this.source === 'student';
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('AddSchoolIncome', addSchoolIncomeSchema)