const mongoose = require('mongoose');

const SchoolExpensesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    amount: {
        type: Number,
        required: true,
    },
    purpose: {
        type: String,
        required: true
    },
    class:Number,
    section:{
        type:String,
        uppercase:true
    },
    date:{
        type:Date,
        required:true
    }
}, { timestamps: true,});

module.exports = mongoose.model('SchoolExpenses', SchoolExpensesSchema);