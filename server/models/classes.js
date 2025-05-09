const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    classType: {
        type: String,
        enum: ['Primary', 'Secondary'],
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        uppercase:true,
    },
    teacher: {
        type: String
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
      }
}, { timestamps: true });

module.exports = mongoose.model('Classes', ClassSchema);