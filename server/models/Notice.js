const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School',
    },
    createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'createdByModel',
        },
        createdByModel: {
            type: String,
            enum: ['User', 'Teacher'],
        },
    date:{
        type:Date,
        default:Date.now,
        required:true,
    },
    title:{
        type:String,
        // required:true,
    },
    noticeMessage:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model('Notice', noticeSchema)