const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    itemName:{
        type:String,
        required:true,
    },
    count:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    soldTo:{
        type:String,
        required:true,
        enum:['teacher', 'student']
    },
    soldToname:{
        type:String,
        required:true,
    },
    soldToId:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
      }
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);