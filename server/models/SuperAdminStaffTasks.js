const mongoose = require('mongoose');

const SuperAdminStaffTasksSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SuperAdminStaff',
    },
    startDate:{
        type:Date,
        required:true,
    },
    dueDate:{
        type:Date,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['pending', 'completed'],
        default:'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
}, { timestamps: true });

module.exports = mongoose.model('SSuperAdminStaffTasks', SuperAdminStaffTasksSchema);