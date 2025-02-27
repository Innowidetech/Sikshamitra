const School = require('../models/School');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Blogs = require('../models/Blogs');
const { uploadImage } = require('../utils/multer');


//super admin to create account for admin/school
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all the details to register." })
    };

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can register admin.' });
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    hpass = bcrypt.hashSync(password, 10);

    const user = new User({
      email,
      password: hpass,
      role: 'admin',
      createdBy:loggedInId
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
    res.status(500).json({ message: 'Registration failed', error });
  }
};

//get all schools
exports.getAllSchools = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can get all schools data.' });
    };

    const schools = await School.find().select('-paymentDetails').populate('createdBy').sort({ createdAt: -1 });
    if (!schools.length) {
      return res.status(200).json({ message: 'No schools registered yet.' })
    };
    res.status(200).json({
      message: 'Schools data',
      schools
    })
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
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

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can change the school status.' });
    };

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
    res.status(500).json({
      message: 'An error occurred while updating school status.',
      error: error.message
    });
  }
};

exports.postBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) { return res.status(400).json({ message: 'Provide all details to post blog.' }) }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can post blog.' });
    };

    let uploadedPhotoUrl;
    if (req.file) {
      try {
        const [photoUrl] = await uploadImage(req.file);
        uploadedPhotoUrl = photoUrl;
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
      }
    };

    const blog = new Blogs({ title, description, photo: uploadedPhotoUrl });
    await blog.save()

    res.status(201).json({ message: "Blog posted successfully.", blog })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message })
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) { return res.status(400).json({ message: 'Provide blog to delete.' }) }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can delete blog.' });
    };

    await Blogs.findByIdAndDelete(blogId);
    res.status(200).json({ message: "Blog deleted successfully." })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message })
  }
};