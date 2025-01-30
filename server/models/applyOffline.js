const mongoose = require('mongoose');

const offlineSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String,
            required:true
        },
        dob: {
            type: Date,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        schoolName:{
            type:String,
            required:true,
        }
    },{timestamps:true});

module.exports = mongoose.model('Offline', offlineSchema);