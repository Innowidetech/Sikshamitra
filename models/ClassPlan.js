const mongoose = require('mongoose');

const ClassPlanSchema = new mongoose.Schema({
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'School'
    },
    class:{
        type:String,
        required:true,
    },
    section:{
        type:String,
        required:true,
    },
    plan:[{
            subject:{
                type:String,
                required:true,
            },
            data:[{
                chapter:{
                    type:String,
                    required:true,
                },
                lessonName:{
                    type:String,
                    required:true,
                },
                startDate:{
                    type:Date,
                    required:true,
                },
                endDate:{
                    type:Date,
                    required:true,
                }
            }]
        }],
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Teacher", 
            required:true,
        }
},{timestamps:true});

module.exports = mongoose.model('ClassPlan', ClassPlanSchema);