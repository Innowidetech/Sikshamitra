const mongoose = require('mongoose');

const NotificationsSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true
    },
    memberIds: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        markAsRead: {
            type: Boolean,
            default: false,
            required:true
        }
    }],
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Notifications', NotificationsSchema)