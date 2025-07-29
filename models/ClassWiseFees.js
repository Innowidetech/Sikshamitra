const mongoose = require('mongoose');

const ClassWiseFeesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    class: {
        type: String,
        required: true
    },
    tutionFees: {
        type: String,
        required: true
    },
    admissionFees: {
        type: String,
        required: true
    },
    examFees: {
        type: String,
        required: true
    },
    totalFees: {
        type: String,
        required: true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
      }
}, { timestamps: true });

module.exports = mongoose.model('ClassWiseFees', ClassWiseFeesSchema);