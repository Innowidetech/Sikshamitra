const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required:true,
    },
    noticeMessage: {
        type: String,
        required: true,
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
},{timestamps:true});

module.exports = mongoose.model('Notice', noticeSchema)