const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin','admin','teacher','student','parent'],
    required: true
  },
  employeeType: {
    type: String,
    enum: ['teaching', 'librarian', 'accountant'],
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