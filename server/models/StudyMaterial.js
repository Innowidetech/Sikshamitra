const mongoose = require('mongoose');

const StudeyMaterialSchema = new mongoose.Schema({
        schoolId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'School',
        },
        teacherName:{
            type:String,
            required:true,
        },
        subject:{
            type:String,
            required:true,
        },
        chapter:{
            type:String,
            required:true,
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
        material:[
            {
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Teacher',
        },
},
{timestamps:true});

module.exports = mongoose.model('StudyMaterial', StudeyMaterialSchema);