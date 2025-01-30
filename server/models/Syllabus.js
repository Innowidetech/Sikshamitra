const mongoose = require('mongoose');
const syllabusSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        uppercase:true
    },
    syllabus: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Syllabus', syllabusSchema);