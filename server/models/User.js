const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'teacher', 'student', 'parent'],
    required: true
  },
  employeeType: {
    type: String,
    enum: ['teaching', 'librarian', 'accountant', 'admissions manager', 'inventory clerk', '-', 'groupD'],
    required: function () {
      return this.role === 'teacher';
    },
  },
  mobileNumber: { // only for staff
    type:String,
    required:function(){
      return this.employeeType === 'groupD'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);