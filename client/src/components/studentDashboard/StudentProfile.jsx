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
    fatherName: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const restrictedFields = ['studentClass', 'section', 'classType', 'rollNo', 'childOf', 'registrationNumber', 'fees', 'additionalFees'];

  const studentProfile = profile?.Data;

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const student = studentProfile?.studentProfile;
      const parent = profile?.ParentData?.parentProfile;

      setFormData({
        fullname: student?.fullname || '',
        gender: student?.gender || '',
        address: student?.address || '',
        previousEducation: profile.previousEducation || {
          studyClass: '',
          schoolName: '',
          duration: '',
        },
        photo: student?.photo || null,
        mobileNumber: parent?.fatherPhoneNumber || '',
        studentClass: profile.studentClass || '',
        section: profile.section || '',
        rollNo: profile.rollNo || '',
        previousSchool: profile.previousSchool || '',
        fatherName: parent?.fatherName || '',
      });

      setPreviewImage(student?.photo || null);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      for (const key in formData) {
        if (key === "photo" && formData.photo instanceof File) {
          form.append("photo", formData.photo);
        } else if (typeof formData[key] !== "object") {
          form.append(key, formData[key]);
        }
      }

      await dispatch(editProfile(form));
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      dispatch(fetchProfile());
    } catch (error) {
      setErrorMessage("Error updating profile. Please try again later.");
      console.error("Error saving profile:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const getInputClasses = (name) => {
    const base = "w-full p-2 bg-gray-100 border rounded-md focus:ring-[#1982C4]";
    return isEditing && !restrictedFields.includes(name)
      ? `${base} border-blue-500`
      : `${base} border-gray-300`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center items-center bg-gray-50">
      <div className="w-full p-6 rounded-lg">
        <div className="bg-gradient-to-r from-[#FFF5A1] to-[#1982C4] text-white p-4 text-center rounded-lg mb-6 w-full max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold">About Me</h1>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <img
              src={previewImage || "/placeholder.png"}
              alt="Profile"
              className="h-24 w-24 rounded-full  border"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 text-sm text-gray-600"
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{studentProfile?.studentProfile?.fullname}</h1>
            <h2 className="text-lg text-gray-600">{studentProfile?.userId?.email}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                className={getInputClasses('fullname')}
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
                className={getInputClasses('fatherName')}
                value={formData.fatherName}
                onChange={handleInputChange}
                name="fatherName"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-gray-700">Gender</label>
              <input
                type="text"
                className={getInputClasses('gender')}
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
                className={getInputClasses('mobileNumber')}
                value={formData.mobileNumber}
                onChange={handleInputChange}
                name="mobileNumber"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-gray-700">Class</label>
              <input
                type="text"
                className={getInputClasses('studentClass')}
                value={formData.studentClass}
                onChange={handleInputChange}
                name="studentClass"
                disabled={!isEditing || restrictedFields.includes('studentClass')}
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700">Section</label>
              <input
                type="text"
                className={getInputClasses('section')}
                value={formData.section}
                onChange={handleInputChange}
                name="section"
                disabled={!isEditing || restrictedFields.includes('section')}
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-gray-700">Roll No</label>
              <input
                type="text"
                className={getInputClasses('rollNo')}
                value={formData.rollNo}
                onChange={handleInputChange}
                name="rollNo"
                disabled={!isEditing || restrictedFields.includes('rollNo')}
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700">Address</label>
              <textarea
                className={getInputClasses('address')}
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-gray-700">Previous School</label>
              <input
                type="text"
                className={getInputClasses('previousSchool')}
                value={formData.previousSchool}
                onChange={handleInputChange}
                name="previousSchool"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex space-x-4 justify-end mt-4">
            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="bg-[#146192] text-white p-2 rounded-md hover:bg-[#0d4f6c] transition"
              >
                Edit
              </button>
            )}

            {isEditing && (
              <button
                type="submit"
                className="bg-[#146192] text-white p-2 rounded-md hover:bg-[#0d4f6c] transition"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
