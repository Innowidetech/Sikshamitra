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
        ref: 'Books'
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'rejected', 'issued', 'returned'],
        default: 'requested'
    },
    borrowedOn: Date,
    dueOn: Date,
    returnedOn: Date,
    fine: { // late return of book
        type: Number,
        required: true,
        default: 0
    },
    resolved: {
        type: Boolean,
        default: true,
        required: function () {
            return this.status == 'returned'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('BookRequests', BookRequestsSchema);