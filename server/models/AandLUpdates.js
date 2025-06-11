const mongoose = require('mongoose');

const AandLUpdatesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    history: [{
        accountant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        },
        librarian: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('AandLUpdates', AandLUpdatesSchema);
