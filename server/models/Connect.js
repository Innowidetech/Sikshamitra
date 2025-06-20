const mongoose = require('mongoose');

const ConnectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: Date,
    startTime: String,
    endDate: Date,
    endTime: String,
    connect: [{
        attendant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'membersModel'
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Denied'],
        },
    }],

    membersModel: {
        type: String,
        enum: ['User', 'SuperAdminStaff', 'School', 'SchoolStaff', 'Teacher', 'Student', 'Parent']
    },
    meetingLink: {
        type: String,
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    hostedByName: String,
    hostedByRole: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'createdByModel',
    },

}, { timestamps: true });

module.exports = mongoose.model('Connect', ConnectSchema);



// super admin --> can schedule meeting with school/admin - (admin must attend it)

// admin --> superadmin, teachers, students, parents - (superadmin can change status)

// teacher --> admin, students(of their class), parents(of their class) - (admin can change status)

// student --> admin, teachers(who teach them) - (both can change status)

// parent --> admin, teachers(who teach them) - (both can change status)