const mongoose = require('mongoose');

const EntranceExamQuestionPaperSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    class: {
        type: String,
        required: true,
    },
    questions: [{
        questionNumber: {
            type: Number,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        photo: String,
        option1: {
            text: {
                type: String,
                required: true,
            },
            isAnswer: {
                type: Boolean,
                default: false,
            }
        },
        option2: {
            text: {
                type: String,
                required: true,
            },
            isAnswer: {
                type: Boolean,
                default: false,
            }
        },
        option3: {
            text: {
                type: String,
                required: true,
            },
            isAnswer: {
                type: Boolean,
                default: false,
            }
        },
        option4: {
            text: {
                type: String,
                required: true,
            },
            isAnswer: {
                type: Boolean,
                default: false,
            }
        },
    }]
}, { timestamps: true });

module.exports = mongoose.model('EntranceExamQuestionPaper', EntranceExamQuestionPaperSchema);