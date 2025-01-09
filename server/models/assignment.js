const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    work:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Teacher'
    },
    assignedTo:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        ref:'Student'
    }
}, {timestamps:true});

module.exports = mongoose.model('Assignment', assignmentSchema);