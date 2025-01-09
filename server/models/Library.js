const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School',
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Books'
    },
    issuedBy:{ //employee._id
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Teacher'
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
    returnDate:{ //book to be returned by the date
        type:Date,
        required:true,
    },
    returnedOn:{ //date when the book is returned
        type:Date,
    }
},{timestamps:true});

module.exports = mongoose.model('Library', librarySchema);