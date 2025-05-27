const School = require('../models/School');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Blogs = require('../models/Blogs');
const { uploadImage, deleteImage } = require('../utils/multer');
const mongoose = require('mongoose');


//create account for admin/school
exports.registerSchool = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can register school.' });
    };

    const { email, password, schoolCode, schoolName, contact, address, principalName, details } = req.body;
    if (!email || !password || !schoolCode || !schoolName || !contact || !address || !principalName || !details) {
      return res.status(400).json({ message: "Please enter all the details to register." })
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    hpass = bcrypt.hashSync(password, 10);

    const admin = new User({
      email,
      password: hpass,
      role: 'admin',
      createdBy: loggedInId
    });
    await admin.save();

    const school = new School({
      userId: admin._id,
      schoolCode,
      schoolName,
      contact,
      address,
      principalName,
      details,
      createdBy: loggedInId,
    });
    await school.save()

    res.status(201).json({
      message: 'School registered successfully',
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      school
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err });
  }
};


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

    const schools = await School.find().select('-paymentDetails').populate('userId', 'email isActive').sort({ createdAt: -1 });
    if (!schools.length) {
      return res.status(200).json({ message: 'No schools registered yet.' })
    };
    res.status(200).json({
      message: 'Schools data:',
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


// exports.getSchoolById = async (req, res) => {
//   try {
//     const { schoolId } = req.params;
//     if (!schoolId) { return res.status(400).json({ message: "Please select school to get complete data." }) }

//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser || loggedInUser.role !== 'superadmin') {
//       return res.status(403).json({ message: 'Access denied. Only superadmin can get all schools data.' });
//     };

//     const school = await School.findById(schoolId).select('-paymentDetails').populate('userId')
//     if (!school) {
//       return res.status(200).json({ message: 'No school found with the id.' })
//     };
//     res.status(200).json({
//       message: 'School data',
//       school
//     })
//   }
//   catch (err) {
//     res.status(500).json({
//       message: 'Internal server error',
//       error: err.message
//     });
//   }
// };


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


// exports.postBlog = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     if (!title || !description) { return res.status(400).json({ message: 'Provide all details to post blog.' }) }

//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser || loggedInUser.role !== 'superadmin') {
//       return res.status(403).json({ message: 'Access denied. Only superadmin can post blog.' });
//     };

//     let uploadedPhotoUrl;
//     if (req.file) {
//       try {
//         const [photoUrl] = await uploadImage(req.file);
//         uploadedPhotoUrl = photoUrl;
//       } catch (error) {
//         return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
//       }
//     };

//     const blog = new Blogs({ title, description, photo: uploadedPhotoUrl });
//     await blog.save()

//     res.status(201).json({ message: "Blog posted successfully.", blog })
//   }
//   catch (err) {
//     res.status(500).json({ message: 'Internal server error.', error: err.message })
//   }
// };


exports.postBlog = async (req, res) => {
  try {
    const { title, blog } = req.body;

    if (!title || !blog || !Array.isArray(blog) || !blog.length) {
      return res.status(400).json({ message: 'Provide all details to post blog.' });
    }

    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can post blog.' });
    }

    let uploadedBlog = [];

    if (req.files && req.files.length === blog.length) {
      for (let i = 0; i < blog.length; i++) {
        const { description } = blog[i];
        const file = req.files[i];

        if (!description || !file) {
          return res.status(400).json({ message: 'Each blog detail must include a description and a photo.' });
        }

        try {
          const [photoUrl] = await uploadImage(file);
          uploadedBlog.push({ description, photo: photoUrl });
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
        }
      }
    } else {
      return res.status(400).json({ message: 'Mismatch between blogs and uploaded photos.' });
    }

    const newBlog = new Blogs({ title, blog: uploadedBlog });
    await newBlog.save();

    res.status(201).json({ message: "Blog posted successfully.", newBlog });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


exports.editBlog = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    }

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can edit blog.' });
    }

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Please provide a valid blog id to edit.' });
    }

    const existingBlog = await Blogs.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: 'No blog found with the provided ID.' });
    }

    const updatedBlogArray = req.body.blog;
    if (!Array.isArray(updatedBlogArray) || !updatedBlogArray.length) {
      return res.status(400).json({ message: "Please provide valid blog data to update." });
    }

    const oldBlogArray = existingBlog.blog;
    let updatedBlog = [];
    let imagesToDelete = [];

    if (req.files && req.files.length === updatedBlogArray.length) {
      for (let i = 0; i < updatedBlogArray.length; i++) {
        const { description } = updatedBlogArray[i];
        const file = req.files[i];

        if (!description || !file) {
          return res.status(400).json({ message: 'Each blog entry must include a description and a photo.' });
        }

        try {
          const [photoUrl] = await uploadImage(file);

          if (oldBlogArray[i] && oldBlogArray[i].photo) {
            imagesToDelete.push(oldBlogArray[i].photo);
          }

          updatedBlog.push({ description, photo: photoUrl });
        } catch (error) {
          return res.status(500).json({ message: 'Failed to upload photo.', error: error.message });
        }
      }
    } else if (!req.files || req.files.length === 0) {
      for (let i = 0; i < updatedBlogArray.length; i++) {
        const { description } = updatedBlogArray[i];
        const oldEntry = oldBlogArray[i];

        if (!description || !oldEntry || !oldEntry.photo) {
          return res.status(400).json({ message: 'Each blog entry must include a description and existing photo.' });
        }

        updatedBlog.push({ description, photo: oldEntry.photo });
      }
    } else {
      return res.status(400).json({ message: 'Mismatch between blogs and uploaded photos.' });
    }

    // If some entries were removed, mark their images for deletion
    if (oldBlogArray.length > updatedBlog.length) {
      const removedImages = oldBlogArray.slice(updatedBlog.length).map(entry => entry.photo);
      imagesToDelete.push(...removedImages);
    }

    // Perform the deletions after processing
    if (imagesToDelete.length > 0) {
      try {
        await deleteImage(imagesToDelete);
      } catch (error) {
        console.warn("Failed to delete one or more old images:", error.message);
      }
    }

    existingBlog.blog = updatedBlog;
    const blog = await existingBlog.save();

    res.status(200).json({ message: "Blog updated successfully.", blog });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


// exports.deleteBlog = async (req, res) => {
//   try {
//     const loggedInId = req.user && req.user.id;
//     if (!loggedInId) {
//       return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
//     };

//     const loggedInUser = await User.findById(loggedInId);
//     if (!loggedInUser || loggedInUser.role !== 'superadmin') {
//       return res.status(403).json({ message: 'Access denied. Only superadmin can delete blog.' });
//     };

//     const { id, blogId } = req.params;
//     if ((!id || !mongoose.Types.ObjectId.isValid(id)) && (!blogId || !mongoose.Types.ObjectId.isValid(blogId))) {
//       return res.status(400).json({ message: 'Please provide a valid blog id to delete.' })
//     }

//     if (id) {
//       const blog = await Blogs.findById(id);
//       if (!blog) { return res.status(404).json({ message: "No blog found with the id." }) }

//       const imagesToDelete = blog.blog.map(entry => entry.photo);
//       try {
//         await deleteImage(imagesToDelete);
//       } catch (error) {
//         res.warn("Some images may not have been deleted:", error.message);
//       }
//       await Blogs.findByIdAndDelete(id);
//       res.status(200).json({ message: "Blog deleted successfully." })
//     }
//     if (blogId) {
//       const existingBlog = await Blogs.findOne({ blog: { $elemMatch: { _id: blogId } } })
//       if (!existingBlog) {
//         return res.status(404).json({ message: 'Blog detail not found with the id.' });
//       }

//       const blogEntryToDelete = existingBlog.blog.find(entry => entry._id.toString() === blogId);
//       if (!blogEntryToDelete) {
//         return res.status(404).json({ message: 'Blog entry not found with the given blogId.' });
//       }

//       await Blogs.updateOne({ _id: existingBlog._id }, { $pull: { blog: { _id: blogId } } });

//       const updatedBlog = await Blogs.findById(existingBlog._id);

//       if (updatedBlog.blog.length === 0) {
//         await Blogs.deleteOne({ _id: updatedBlog._id });
//         return res.status(200).json({ message: 'Blog detail deleted and blog document removed as it became empty.' });
//       }
//       res.status(200).json({ message: 'Blog detail deleted successfully.' });
//     }
//   }
//   catch (err) {
//     res.status(500).json({ message: 'Internal server error.', error: err.message })
//   }
// };


exports.deleteBlog = async (req, res) => {
  try {
    const loggedInId = req.user && req.user.id;
    if (!loggedInId) {
      return res.status(401).json({ message: 'Unauthorized. Only logged-in user can access.' });
    };

    const loggedInUser = await User.findById(loggedInId);
    if (!loggedInUser || loggedInUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmin can delete blog.' });
    };

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Please provide a valid blog id to delete.' })
    }
    const blog = await Blogs.findById(id);
    if (!blog) { return res.status(404).json({ message: "No blog found with the id." }) }

    const imagesToDelete = blog.blog.map(entry => entry.photo);
    try {
      await deleteImage(imagesToDelete);
    } catch (error) {
      res.warn("Some images may not have been deleted:", error.message);
    }
    await Blogs.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully." })
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message })
  }
};