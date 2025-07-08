const SchoolStaffTasks = require('../models/SchoolStaffTasks');
const User = require('../models/User');
const SchoolStaff = require('../models/SchoolStaff');
const SuperAdminStaff = require('../models/SuperAdminStaff');
const SuperAdminStaffTasks = require('../models/SuperAdminStaffTasks');
const Notifications = require('../models/Notifications');
const Vehicles = require('../models/Vehicles');
const Student = require('../models/Student');
const moment = require('moment');
const mongoose = require('mongoose');


exports.editSchoolTaskStatus = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher' || loggedInUser.employeeType !== 'groupD') {
            return res.status(403).json({ message: 'Access denied. Only logged-in staff members can access.' });
        };

        const { id } = req.params;
        const { status } = req.body;
        if (!id || !status) { return res.status(400).json({ message: "Please provide task id and status to update." }) }

        if (status !== 'pending' && status !== 'completed' && status !== 'process') {
            return res.status(400).json({ message: "Invalid status input." })
        }
        const staff = await SchoolStaff.findOne({ userId: loggedInId });
        if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id." }) }
        if (!staff.schoolId) { return res.status(404).json({ message: "You are not associated with any school." }) }

        task = await SchoolStaffTasks.findOne({ _id: id, schoolId: staff.schoolId, staffId: staff._id }).populate('schoolId');
        if (!task) { return res.status(404).json({ message: "No task found with the id." }) }

        task.status = status;
        await task.save();

        let memberIds = []
        memberIds.push({ memberId: task.schoolId.userId });
        const notification = new Notifications({ section: 'task', memberIds, text: `${task.title} - task status has been updated to - '${status}' by '${staff.name}'` });
        await notification.save();

        res.status(200).json({ message: `Task status updated successfully.`, task })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};


exports.editSATaskStatus = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) {
            return res.status(401).json({ message: 'Unauthorized.' });
        };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'superadmin' || loggedInUser.employeeType !== 'groupD') {
            return res.status(403).json({ message: 'Access denied. Only logged-in staff members can access.' });
        };

        const { id } = req.params;
        const { status } = req.body;
        if (!id || !status) { return res.status(400).json({ message: "Please provide task id and status to update." }) }

        if (status !== 'pending' && status !== 'completed' && status !== 'process') {
            return res.status(400).json({ message: "Invalid status input." })
        }
        const staff = await SuperAdminStaff.findOne({ userId: loggedInId });
        if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id." }) }

        task = await SuperAdminStaffTasks.findOne({ _id: id, staffId: staff._id });
        if (!task) { return res.status(404).json({ message: "No task found with the id." }) }

        task.status = status;
        await task.save();

        let memberIds = []
        memberIds.push({ memberId: task.createdBy });
        const notification = new Notifications({ section: 'task', memberIds, text: `${task.title} - task status has been updated to - '${status}' by '${staff.name}'` });
        await notification.save();

        res.status(200).json({ message: `Task status updated successfully.`, task })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};


exports.editActionInTransportation = async (req, res) => {
    try {
        const loggedInId = req.user && req.user.id;
        if (!loggedInId) { return res.status(401).json({ message: 'Unauthorized.' }) };

        const loggedInUser = await User.findById(loggedInId);
        if (!loggedInUser || loggedInUser.role !== 'teacher' || loggedInUser.employeeType !== 'driver') {
            return res.status(403).json({ message: 'Access denied. Only logged-in drivers can access.' });
        };

        const vehicle = await Vehicles.findOne({ 'driverDetails.userId': loggedInId });
        if (!vehicle) { return res.status(404).json({ message: "No vehicle found." }) }

        const { id } = req.params;
        const { action } = req.body;

        if (!id || !['checkIn', 'checkOut', 'Absent'].includes(action)) {
            return res.status(400).json({ message: "Please provide valid student detail id and action (checkIn, checkOut, Absent)." });
        }

        const studentDetail = vehicle.studentDetails.id(id);
        if (!studentDetail) {
            return res.status(404).json({ message: "Student detail not found in the vehicle." });
        }

        const student = await Student.findOne({ schoolId: loggedInUser.schoolId, _id: studentDetail.studentId }).select('studentProfile.childOf');
        if (!student) { return res.status(404).json({ message: 'Student not found.' }) }

        const currentTimeIST = moment().tz('Asia/Kolkata').format('hh:mm A');

        if (action === 'checkIn' && studentDetail.action.checkIn == true) {
            studentDetail.action.checkInTime = currentTimeIST;
            studentDetail.action.checkOutTime = '-';
            studentDetail.action.checkOut = 'true';
            studentDetail.action.checkIn = 'false';
            studentDetail.action.Absent = 'false'
        } else if (action === 'checkOut' && studentDetail.action.checkOut == true) {
            studentDetail.action.checkOutTime = currentTimeIST;
            studentDetail.action.checkIn = 'true';
            studentDetail.action.checkOut = 'false';
            studentDetail.action.Absent = 'true';
        } else if (action === 'Absent' && studentDetail.action.Absent == true) {
            studentDetail.action.checkInTime = '-';
            studentDetail.action.checkOutTime = '-';
            studentDetail.action.checkIn = 'true';
            studentDetail.action.checkOut = 'false';
        }
        else {return res.status(409).json({message:"Invalid action"})}

        await vehicle.save();

        const studentUserId = student._id;
        const parentUserId = student.studentProfile?.childOf;
        console.log(studentUserId,parentUserId)

        let memberIds = []
        memberIds.push({ memberId: studentUserId });
        memberIds.push({ memberId: parentUserId });

        const notification = new Notifications({ section: 'transportation', memberIds, text: `Transportation Update: ${action} updated at ${currentTimeIST}.` });
        await notification.save();

        res.status(200).json({ message: `Action updated successfully.`, studentDetail })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};