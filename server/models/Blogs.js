const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    blog:[{
        description: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: true,
        }}
    ]
    
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogsSchema);