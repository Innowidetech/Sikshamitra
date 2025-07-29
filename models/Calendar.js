const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    displayTo:{
        type:[String],
        required:true,
        enum:['admin', 'teacher', 'student', 'parent']
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
}, { timestamps: true });

module.exports = mongoose.model('Calendar', CalendarSchema);