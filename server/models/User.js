const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { // for role as authority, consider loginId for email input
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
    enum: ['superadmin', 'staff', 'admin', 'teacher', 'student', 'parent', 'authority'],
    required: true
  },
  employeeType: {
    type: String,
    enum: ['teaching', 'librarian', 'accountant', 'admissionsManager', 'inventoryClerk', '-', 'driver', 'groupD', 'blogsManager'],
    required: function () {
      return this.role === 'teacher' || this.role === 'staff';
    },
  },
  mobileNumber: { // only for school staff
    type: String,
    required: function () {
      return this.employeeType === 'groupD'
    }
  },
  passwordIs: { // only for authority
    type: String,
    required: function () {
      return this.role === 'authority'
    }
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
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