const mongoose = require('mongoose');
//add school banner to display at results 
const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
  },
  schoolCode: {
    type: String,
    required: true,
    unique: true,
  },
  schoolBanner:{
    type:String,
    required:true,
  },
  address: {
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
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
  details: {
    foundedYear: {
      type: Number,
    },
    boardType: { //ssc, cbse, icse
      type: String,
      required: true,
    },
    medium: { // english, telugu
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
paymentDetails: {
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    ifscCode: {
        type: String,
        required: true,
    },
    accountHolderName: {
        type: String,
        required: true,
    },
},
}, {
  timestamps: true
});
module.exports = mongoose.model('School', schoolSchema);