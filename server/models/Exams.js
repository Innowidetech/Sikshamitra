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
    },
    examType:{ // annual exam, quarterly, half yearly
        type:String,
        required:true
    },
    schedule:[{
                sNo:{
                    type:Number,
                    required:true,
                },
                subject:{
                    type:String,
                    required:true,
                },
                date:{
                    type:String,
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
//subject code, syllabus