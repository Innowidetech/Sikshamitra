const mongoose = require('mongoose');

const BookRequestsSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Books'
    },
    requestedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Student'
    },
    status:{
        type:String,
        enum:['requested', 'accepted', 'rejected', 'received', 'returned'],
        default:'requested'
    },
    borrowedOn:Date,
    dueOn:Date,
    returnedOn:Date,
    fine:Number // late return of book
}, { timestamps: true });

module.exports = mongoose.model('BookRequests', BookRequestsSchema);