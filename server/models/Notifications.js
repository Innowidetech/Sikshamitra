const mongoose = require('mongoose');

const NotificationsSchema = new mongoose.Schema({
    // title:{
    //     type:String,
    //     required:true
    // },
    memberIds:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }], 
    text:{
        type:String,
        required:true,
    }
},{timestamps:true});

module.exports = mongoose.model('Notifications', NotificationsSchema)