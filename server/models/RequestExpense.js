const mongoose = require('mongoose');

const RequestExpensesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    amount:{
        type:Number,
        default:0
    },
    item:String,
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
        enum:['pending','success', 'failed'],
        required:true,
        default:'pending'
    },
    remark:{
        type:String,
        required:function(){
            return this.status=='failed';
        }
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Teacher'
    }
}, { timestamps: true});

module.exports = mongoose.model('RequestExpense', RequestExpensesSchema);