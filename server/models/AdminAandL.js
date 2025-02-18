const mongoose = require('mongoose');

const AandLSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    accountants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Teacher'
    }],
    librarians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Teacher'
    }],
}, { timestamps: true });

module.exports = mongoose.model('AandL', AandLSchema);