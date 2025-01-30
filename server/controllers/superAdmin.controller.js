const School = require('../models/School');
const User = require('../models/User');
const bcrypt = require('bcryptjs')

//super admin to create account for admin/school
exports.userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send("Please enter all the details to register.")
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const createdBy = req.user && req.user.id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    hpass = bcrypt.hashSync(password, 10);

    const user = new User({
      email,
      password: hpass,
      role: 'admin',
      createdBy
    });

    await user.save();

    res.status(201).json({
      message: 'Admin for school registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdBy: user.createdBy
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

//get all schools
exports.getAllSchools = async (req, res) => {
  try{
    const schools = await School.find().select('-paymentDetails').populate('createdBy').sort({createdAt: -1});
    if(!schools.length){
      return res.status(404).json({message:'No schools fould'})
    };
    res.status(200).json({
      message:'Schools data',
      schools
    })
  }
  catch(err){
    res.status(500).json({
      message:'Internal server error',
      error:err.message
    });
  }
};

//change school status
exports.changeSchoolStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Only 'active', 'inactive' or 'suspended' are allowed."
      });
    }

    const school = await School.findOneAndUpdate(id);
    if (!school) {
      return res.status(404).json({ message: "School doesn't exist" })
    };
    school.status = status;
    await school.save();

    res.status(200).json({
      message: `School status successfully updated to '${status}'.`,
      school: {
        id: school._id,
        schoolName: school.schoolName,
      }
    });
  } catch (error) {
    console.error('Error updating school status:', error);
    res.status(500).json({
      message: 'An error occurred while updating school status.',
      error: error.message
    });
  }
};