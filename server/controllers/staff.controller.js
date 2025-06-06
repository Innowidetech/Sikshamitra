const SchoolStaffTasks = require('../models/SchoolStaffTasks');
const User = require('../models/User');
const School = require('../models/School');
const SchoolStaff = require('../models/SchoolStaff');


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

        if (status !== 'pending' && status !== 'completed') {
            return res.status(400).json({ message: "Invalid status input." })
        }
        const staff = await SchoolStaff.findOne({ userId: loggedInId });
        if (!staff) { return res.status(404).json({ message: "No staff member found with the logged-in id." }) }
        if (!staff.schoolId) { return res.status(404).json({ message: "You are not associated with any school." }) }

        task = await SchoolStaffTasks.findOne({ _id:id, schoolId: staff.schoolId, staffId: staff._id });
        if (!task) { return res.status(404).json({ message: "No task found with the id." }) }

        task.status = status;
        await task.save();
        res.status(200).json({ message: `Task status updated successfully.`, task })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};