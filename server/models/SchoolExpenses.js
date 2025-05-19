const mongoose = require('mongoose');
const moment = require('moment-timezone');


const SchoolExpensesSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    amount: {
        type: Number,
        required: true,
    },
    purpose: {
        type: String,
        required: true
    },
    class:Number,
    section:{
        type:String,
        uppercase:true
    },
    date:{
        type:Date,
        required:true
    }
}, { timestamps: true,});


SchoolExpensesSchema.pre('save', function (next) {
  const currentISTTime = moment.tz('Asia/Kolkata');
  if (this.isNew) {
    this.createdAt = currentISTTime.toDate();
  }
  this.updatedAt = currentISTTime.toDate();
  next();
});

module.exports = mongoose.model('SchoolExpenses', SchoolExpensesSchema);