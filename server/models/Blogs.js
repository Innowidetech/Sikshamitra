const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogsSchema);