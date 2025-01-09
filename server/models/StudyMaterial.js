const mongoose = require('mongoose');

const StudeyMaterialSchema = new mongoose.Schema({
        schoolId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'School',
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
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
        subject:{
            type:String,
            required:true,
        },
        chapter:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            // required:true,
        },
        material:[
            {
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
},
{timestamps:true});

module.exports = mongoose.model('StudyMaterial', StudeyMaterialSchema);