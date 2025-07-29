const mongoose = require('mongoose');

const offlineSchema = new mongoose.Schema({
        fullname: {
            type: String,
            required: true
        },
        class: {
            type: Number,
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
        },
        examId:{
            type:String,
            required:true,
        },
        resultPercentage:{
            type:String,
            required:true,
        },
    },{timestamps:true});

module.exports = mongoose.model('Offline', offlineSchema);