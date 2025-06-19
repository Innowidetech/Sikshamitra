const mongoose = require('mongoose');

const SuperAdminIncomeUpdateHistorySchema = new mongoose.Schema({
    incomeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SuperAdminIncome'
    },
    incomeHistory: [{
        previousData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('SuperAdminIncomeUpdateHistory', SuperAdminIncomeUpdateHistorySchema);