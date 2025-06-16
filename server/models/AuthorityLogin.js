const mongoose = require('mongoose');

const AuthorityLoginSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    accountant: {
        loginId: String,
        password: String,
    },
    librarian: {
        loginId: String,
        password: String,
    },
    admissionsManager: {
        loginId: String,
        password: String,
    },
    inventoryClerk: {
        loginId: String,
        password: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('AuthorityLogin', AuthorityLoginSchema);
