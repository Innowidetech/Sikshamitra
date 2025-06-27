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
    previousData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    updatedData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    reasonForEdit: {
        type: String,
        required: true,
    },
},{timestamps:true});

module.exports = mongoose.model('SchoolIncomeUpdates',SchoolIncomeUpdatesSchema);