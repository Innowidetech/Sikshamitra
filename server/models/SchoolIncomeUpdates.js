const mongoose = require('mongoose');

const SchoolIncomeUpdatesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    incomeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'incomeModel'
    },
    incomeModel: {
        type: String,
        enum: ['SchoolIncome', 'ParentExpenses', 'Online']
    },
    incomeHistory: [{
        previousData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        reasonForEdit: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('SchoolIncomeUpdates', SchoolIncomeUpdatesSchema);