const mongoose = require('mongoose');

const ClassExpensesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    amount:{
        type:Number,
        default:0
    },
    item:{
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    class:{
        type:Number,
        required:true,
    },
    section:{
        type:String,
        required:true,
        uppercase:true
    },
    status:{
        type:String,
        enum:['pending','success'],
        required:true,
        default:'pending'
    }
}, { timestamps: true});

module.exports = mongoose.model('ClassExpenses', ClassExpensesSchema);