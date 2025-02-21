const mongoose = require('mongoose');

const AandLUpdatesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    previousData: {
        accountants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        }],
        librarians: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        }]
    },
    updatedData: {
        accountants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        }],
        librarians: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        }]
    },
}, { timestamps: true });

module.exports = mongoose.model('AandLUpdates', AandLUpdatesSchema);
