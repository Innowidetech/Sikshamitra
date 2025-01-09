const mongoose = require('mongoose');

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
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
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
    boardType: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['primary', 'secondary', 'both']
    }
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
  email: {
    type: String,
    required: true,
  },
  applicationFee: {
    type: Number,
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