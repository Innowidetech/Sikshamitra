
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, editProfile } from "../../redux/student/studentProfileSlice";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.studentProfile);

  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    address: '',
    previousEducation: {
      studyClass: '',
      schoolName: '',
      duration: '',
    },
    photo: null,
    mobileNumber: '',
    studentClass: '',
    section: '',
    rollNo: '',
    previousSchool: '',
    fatherName: '', // Ensure fatherName is in the formData
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const restrictedFields = ['studentClass', 'section', 'classType', 'rollNo', 'childOf', 'registrationNumber', 'fees', 'additionalFees'];

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullname: studentProfile?.studentProfile?.fullname|| '',
        gender: studentProfile?.studentProfile?.gender || '',
        address: studentProfile?.studentProfile?.address|| '',
        previousEducation: profile.previousEducation || {
          studyClass: '',
          schoolName: '',
          duration: '',
        },
        photo: profile.photo || null,
        mobileNumber: profile?.ParentData?.parentProfile?.fatherPhoneNumber || '',
        studentClass: profile.studentClass || '',
        section: profile.section || '',
        rollNo: profile.rollNo || '',
        previousSchool: profile.previousSchool || '',
        fatherName: profile?.ParentData?.parentProfile?.fatherName || '', // Initialize fatherName
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any restricted fields are being edited
    const isRestrictedFieldEdited = restrictedFields.some((field) => formData[field] !== profile[field]);

   
    try {
      await dispatch(editProfile(formData));
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
      dispatch(fetchProfile()); // Fetch the updated profile data
    } catch (error) {
      setErrorMessage('Error updating profile. Please try again later.');
      console.error("Error saving profile:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable editing when clicking edit
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const studentProfile = profile?.Data;

  return (
    <div className="flex justify-center items-center bg-gray-50">
      <div className="w-full p-6 rounded-lg">
        <div className="bg-gradient-to-r from-[#FFF5A1] to-[#1982C4] text-white p-4 text-center rounded-lg mb-6 w-full max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold">About Me</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        {/* Profile Picture, Name, and Email Section */}
        <div className="flex items-center space-x-4 mb-8">
          <img 
            src={studentProfile?.studentProfile?.photo} 
            alt="Profile" 
            className="h-24 w-24 rounded-full"
          />
          <div>
            <h1 className="text-xl font-semibold">{studentProfile?.studentProfile.fullname}</h1>
            <h2 className="text-lg text-gray-600">{studentProfile?.userId.email}</h2>
          </div>
        </div>

        {/* Full Name and Father's Name */}
        <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.fullname}
              onChange={handleInputChange}
              name="fullname"
              disabled={!isEditing}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">Father's Name</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.fatherName}  // Use formData.fatherName for the value
              onChange={handleInputChange}  // Update fatherName in formData
              name="fatherName"
              disabled={!isEditing}  // Disabled when not in editing mode
            />
          </div>
        </div>

        {/* Gender and Mobile Number */}
        <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.gender}
              onChange={handleInputChange}
              name="gender"
              disabled={!isEditing}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              name="mobileNumber"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Class and Section - Non-editable if restricted */}
        <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <label className="block text-gray-700">Class</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.studentClass || studentProfile?.studentProfile?.class}
              onChange={handleInputChange}
              name="studentClass"
              disabled={!isEditing || restrictedFields.includes('studentClass')}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">Section</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.section || studentProfile?.studentProfile?.section}
              onChange={handleInputChange}
              name="section"
              disabled={!isEditing || restrictedFields.includes('section')}
            />
          </div>
        </div>

        {/* Roll No and Address */}
        <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <label className="block text-gray-700">Roll No</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.rollNo || studentProfile?.studentProfile?.rollNumber}
              onChange={handleInputChange}
              name="rollNo"
              disabled={!isEditing || restrictedFields.includes('rollNo')}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">Address</label>
            <textarea
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.address}
              onChange={handleInputChange}
              name="address"
              disabled={!isEditing}
            />
          </div>
        </div>
         {/* Previous Education */}
         <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <label className="block text-gray-700">Previous Education</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 border rounded-md border-gray-300 focus:ring-[#1982C4]"
              value={formData.rollNo || studentProfile?.studentProfile?.rollNumber}
              onChange={handleInputChange}
              name="rollNo"
              disabled={!isEditing || restrictedFields.includes('rollNo')}
            />
          </div>
        </div>



        {/* Edit and Save Buttons */}
        <div className="flex space-x-4 justify-end mt-4">
          <button
            onClick={handleEdit}
            className="bg-[#146192] text-white p-2 rounded-md hover:bg-[#0d4f6c] transition"
          >
            Edit
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#146192] text-white p-2 rounded-md hover:bg-[#0d4f6c] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
