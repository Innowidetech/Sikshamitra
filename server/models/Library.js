const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School',
    },
    bookName:{
        type:String,
        required:true,
    },
    issuedBy:{ 
        type:String,
        required:true,
    },
    issuedTo:{ //student._id
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Student'
    },
    issuedOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    dueDate:{ //book to be returned by the date
        type:Date,
        required:true,
    },
    returnedDate:{ //date when the book is returned
        type:Date,
    }
},{timestamps:true});

module.exports = mongoose.model('Library', librarySchema);