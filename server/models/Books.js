const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School',
    },
    book:{
        title:{
            type:String,
            required:true,
        },
        author:{
            type:String,
            required:true,
        },
        subject:{
            type:String, 
            required:true,
        },
        edition:{
            type:String,
        },
        availability:{
            type:Boolean,
            required:true,
            default:true
        },
    },
},{timestamps:true});

module.exports = mongoose.model('Books', booksSchema);