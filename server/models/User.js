const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  parentUsername:String,
  email: {
    type: String,
    required: true,
    unique:true,
  },
  parentEmail:String,
  password: {
    type: String,
    required: true,
  },
  parentPassword:String,
  role: {
    type: String,
    enum: ['admin','teacher','student','parent'],
    required: true
  },
  employeeType: {
    type: String,
    enum: ['teaching', 'non-teaching'],
    required: function () {
      return this.role === 'teacher';
    },
  },
  isActive:{
    type:Boolean,
    default:true,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);