const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    itemName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    count:{
        type:Number,
        required:true,
    },
    unitPrice:{
        type:Number,
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
      }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);