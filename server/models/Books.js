const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    bookName: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    edition: {
        type: String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    pages:{
        type:Number,
        required:true,
    },
    photo: {
        type: String,
        required:true,
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Books', BooksSchema);