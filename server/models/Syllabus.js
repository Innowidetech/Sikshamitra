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
        ref: 'Teacher',
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    syllabus: {
        subjects: [{
            subjectType: {
                type: String,
                required: true,
                enum: ['theory', 'practical']
            },
            subjectName: {
                type: String,
                required: true,
            },
            chapters: [{
                chapterNumber: { // 1, 2, 3 ,.....
                    type: Number,
                    required: true,
                },
                chapterName: {
                    type: String,
                    required: true,
                },
                lessons: [{
                    lessonNumber: { // 1.1, 1.2 ,.....
                        type: String,
                        required: true,
                    },
                    lessonName: {
                        type: String,
                        required: true,
                    }
                }]
            }]
        }]
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Syllabus', syllabusSchema);