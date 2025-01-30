const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    schoolId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Teacher',
    },
    class:{
        type:String,
        required:true,
    },
    section:{
        type:String,
        required:true,
        uppercase:true
    },
    examType:{ // annual exam, quarterly, half yearly
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true,
    },
    schedule:[{
                sNo:{
                    type:Number,
                    required:true,
                },
                subjectCode:{
                    type:String,
                    required:true,
                },
                subject:{ //subjectName
                    type:String,
                    required:true,
                },
                syllabus:{
                    type:String,
                    required:true,
                },
                date:{
                    type:Date,
                    required:true,
                },
                day:{
                    type:String,
                    enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                    required:true,
                },
            }]
},{timestamps:true});

module.exports = mongoose.model('Exams', examSchema);