const mongoose = require('mongoose');

const SchoolStaffTasksSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SchoolStaff',
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
        enum:['pending', 'inProgress', 'completed'],
        default:'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('SchoolStaffTasks', SchoolStaffTasksSchema);