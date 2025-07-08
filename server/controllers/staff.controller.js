const SchoolStaffTasks = require('../models/SchoolStaffTasks');
const User = require('../models/User');
const SchoolStaff = require('../models/SchoolStaff');
const SuperAdminStaff = require('../models/SuperAdminStaff');
const SuperAdminStaffTasks = require('../models/SuperAdminStaffTasks');
const Notifications = require('../models/Notifications');
const School = require('../models/School');


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

        if (status !== 'pending' && status !== 'completed' && status !=='process') {
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
        memberIds.push({memberId:task.schoolId.userId});
        const notification = new Notifications({ section:'task', memberIds, text: `${task.title} - task status has been updated to - '${status}' by '${staff.name}'` });
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
        memberIds.push({memberId:task.createdBy});
        const notification = new Notifications({ section:'task', memberIds, text: `${task.title} - task status has been updated to - '${status}' by '${staff.name}'` });
        await notification.save();

        res.status(200).json({ message: `Task status updated successfully.`, task })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};