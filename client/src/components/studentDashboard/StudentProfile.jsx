import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa'; // FontAwesome for the delete icon
import {
  fetchProfile,
  editProfile,
  clearUpdateStatus,
} from '../../redux/student/studentProfileSlice';

const StudentProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, updateSuccess } = useSelector(
    (state) => state.studentProfile
  );

  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    address: '',
    previousEducation: [],
    photo: null,
    dob: '',
    about: '',
    fatherName: '',
    fatherPhoneNumber: '',
    class: '',
    section: '',
    rollNumber: '',
  });

  const [originalData, setOriginalData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const studentProfile = profile?.Data?.studentProfile;
  const parentProfile = profile?.ParentData?.parentProfile;
  const userEmail = profile?.Data?.userId?.email;

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (studentProfile && parentProfile) {
      const profileData = {
        fullname: studentProfile.fullname || '',
        gender: studentProfile.gender || '',
        address: studentProfile.address || '',
        previousEducation: Array.isArray(studentProfile.previousEducation)
          ? [...studentProfile.previousEducation]
          : [],
        dob: studentProfile.dob
          ? new Date(studentProfile.dob).toISOString().split('T')[0]
          : '',
        about: studentProfile.about || '',
        fatherName: parentProfile.fatherName || '',
        fatherPhoneNumber: parentProfile.fatherPhoneNumber || '',
        class: studentProfile.class || '',
        section: studentProfile.section || '',
        rollNumber: studentProfile.rollNumber || '',
        photo: null,
      };

      setFormData(profileData);
      setOriginalData(profileData);
      setPreviewImage(studentProfile.photo || null);
    }
  }, [studentProfile, parentProfile]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      dispatch(fetchProfile());
      setTimeout(() => {
        dispatch(clearUpdateStatus());
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.previousEducation];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      previousEducation: updatedEducation,
    }));
  };

  const addEducationField = () => {
    setFormData((prev) => ({
      ...prev,
      previousEducation: [
        ...prev.previousEducation,
        { schoolName: '', duration: '', study: '' },
      ],
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

    const form = new FormData();
    const allowedFields = ['fullname', 'gender', 'address', 'dob', 'about', 'photo'];

    allowedFields.forEach((key) => {
      if (key === 'photo' && formData.photo instanceof File) {
        form.append('photo', formData.photo);
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    formData.previousEducation.forEach((edu, index) => {
      form.append(`previousEducation[${index}][schoolName]`, edu.schoolName || '');
      form.append(`previousEducation[${index}][duration]`, edu.duration || '');
      form.append(`previousEducation[${index}][study]`, edu.study || '');
    });

    dispatch(editProfile(form));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setPreviewImage(studentProfile?.photo || null);
    setIsEditing(false);
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = formData.previousEducation.filter((_, idx) => idx !== index);
    setFormData((prev) => ({
      ...prev,
      previousEducation: updatedEducation,
    }));
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-[#FFF5A1] to-[#1982C4] text-white p-4 text-center rounded-lg mb-6">
          <h1 className="text-2xl font-semibold">Student Profile</h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {updateSuccess && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={previewImage || '/placeholder.png'}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 text-sm"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{studentProfile?.fullname}</h2>
              <p className="text-gray-600">{userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Fields */}
            {[ 
              ['Full Name', 'fullname', 'text', false], 
              ["Father's Name", 'fatherName', 'text', true],
              ['Phone Number', 'fatherPhoneNumber', 'tel', true],
              ['Gender', 'gender', 'select', false],
              ['Class', 'class', 'text', true],
              ['Section', 'section', 'text', true],
              ['Roll Number', 'rollNumber', 'text', true],
              ['Date of Birth', 'dob', 'date', false],
            ].map(([label, name, type, disabled]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={disabled || !isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={disabled || !isEditing}
                    className={`mt-1 block w-full rounded-md ${
                      disabled ? 'bg-gray-100' : ''
                    } border-gray-300 shadow-sm`}
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {/* Previous Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Previous Education</label>
            {formData.previousEducation.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">School Name</label>
                  <input
                    type="text"
                    placeholder="Enter school name"
                    value={edu.schoolName || ''}
                    onChange={(e) => handleEducationChange(idx, 'schoolName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2018-2022"
                    value={edu.duration || ''}
                    onChange={(e) => handleEducationChange(idx, 'duration', e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Class</label>
                  <input
                    type="text"
                    placeholder="Class number"
                    value={edu.study || ''}
                    onChange={(e) => handleEducationChange(idx, 'study', e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-md border-gray-300 shadow-sm text-sm p-2"
                  />
                </div>

                {/* Delete Button */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(idx)}
                    className="flex justify-end items-center col-span-3 mt-2"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={addEducationField}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
              >
                + Add Education
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
