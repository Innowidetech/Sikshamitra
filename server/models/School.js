const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  schoolCode: {
    type: String,
    required: true,
    unique: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  contact: {
    phone: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    }
  },
  address: {
    type: String,
    required: true
  },
  principalName: {
    type: String,
    required: true
  },
  libraryFineAmount:Number,
  details: {
    boardType: { //ssc, cbse, icse
      type: String,
      required: true,
    },
    medium: { // english, telugu, hindi
      type: String,
      required: true,
    },
    foundedYear: Number,
  },
  schoolLogo: String,
  schoolBanner: String,
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    required:true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});
module.exports = mongoose.model('School', schoolSchema);