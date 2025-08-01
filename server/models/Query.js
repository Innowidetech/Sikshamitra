const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    query: [{
        message: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'createdByModel',
        },
        sentAt: {
            type: Date,
            default: Date.now,
        }
    }],
    sendTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'createdByModel',
    },
    sendToName:String,
    sendToRole:String,
    createdByModel: {
        type: String,
        enum: ['User', 'SuperAdminStaff', 'School', 'SchoolStaff', 'Teacher', 'Student', 'Parent']
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    schoolName:String,
    createdByRole:String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'createdByModel',
    },
}, { timestamps: true });

module.exports = mongoose.model('Query', QuerySchema);