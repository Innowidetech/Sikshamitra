const mongoose = require('mongoose');

const AimObjectiveSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('AimObjective', AimObjectiveSchema);