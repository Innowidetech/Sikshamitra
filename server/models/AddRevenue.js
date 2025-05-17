const mongoose = require('mongoose');

const addRevenueSchema = new mongoose.Schema({
    amount: {
        type: Number,
        // required:true
    },
    date: {
        type: Date,
        // required:true
    },
    purpose: {
        type: String,
        // required:true
    },
    source: {
        type: String,
        // required:true
        enum: ['student', 'other']
    },
    name: {
        type: String,
        // required:true
    },
    organisation: {
        type: String,
        required: function () {
            return this.source === 'other';
        }
    },
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

module.exports = mongoose.model('AddRevenue', addRevenueSchema)