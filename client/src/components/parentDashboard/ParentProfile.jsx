import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchParentDashboard,
  resetDashboardState,
  editParentProfile,
} from '../../redux/parent/parentProfileSlice';
import Header from './layout/Header';

const ParentProfile = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.parentProfile.dashboard);
  const dashboardLoading = useSelector((state) => state.parentProfile.dashboardLoading);
  const dashboardError = useSelector((state) => state.parentProfile.dashboardError);
  const token = localStorage.getItem('token');

  const [isEditing, setIsEditing] = useState(false);

  const parentData = dashboard?.parentData || {};
  const parentProfile = parentData.parentProfile || {};
  const userId = parentData.userId || {};

  const [formData, setFormData] = useState({
    email: userId.email || '',
    parentAddress: parentProfile.parentAddress || '',
    fatherPhoneNumber: parentProfile.fatherPhoneNumber || '',
    fatherName: parentProfile.fatherName || '',
    motherPhoneNumber: parentProfile.motherPhoneNumber || '',
    motherName: parentProfile.motherName || '',
    motherOccupation: parentProfile.motherOccupation || '',
    fatherOccupation: parentProfile.fatherOccupation || '',
    photo: parentProfile.photo || '',
  });

  useEffect(() => {
    setFormData({
      email: userId.email || '',
      parentAddress: parentProfile.parentAddress || '',
      fatherPhoneNumber: parentProfile.fatherPhoneNumber || '',
      fatherName: parentProfile.fatherName || '',
      motherPhoneNumber: parentProfile.motherPhoneNumber || '',
      motherName: parentProfile.motherName || '',
      motherOccupation: parentProfile.motherOccupation || '',
      fatherOccupation: parentProfile.fatherOccupation || '',
      photo: parentProfile.photo || '',
    });
  }, [dashboard]);

  useEffect(() => {
    if (token) {
      dispatch(fetchParentDashboard(token));
    }
    return () => {
      dispatch(resetDashboardState());
    };
  }, [dispatch, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      ...parentProfile,
      parentAddress: formData.parentAddress,
      fatherPhoneNumber: formData.fatherPhoneNumber,
      fatherName: formData.fatherName,
      motherPhoneNumber: formData.motherPhoneNumber,
      motherName: formData.motherName,
      motherOccupation: formData.motherOccupation,
      fatherOccupation: formData.fatherOccupation,
      photo: formData.photo,
    };

    dispatch(editParentProfile({ token, profileData }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        dispatch(fetchParentDashboard(token));
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 mt-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="md:ml-64">
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Dashboard</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}{" "}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Profile</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Title */}
      <div className="bg-gradient-to-r from-blue-200 via-purple-100 to-yellow-100 text-center py-6 rounded-md shadow mt-10 md:ml-64">
        <h2 className="text-lg md:text-xl font-semibold tracking-wide">PARENT PROFILE</h2>
      </div>

      {/* Profile Info with Image */}
      <div className="flex items-center md:ml-72 justify-between py-6">
        <div className="flex items-center">
          <img
            src={
              formData.photo && formData.photo.trim() !== ''
                ? formData.photo
                : 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg'
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-2">
            <h3 className="text-lg font-semibold">{formData.fatherName || 'N/A'}</h3>
            <p className="text-sm text-gray-500">{userId.email || 'N/A'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Image Upload (only when editing) */}
      {isEditing && (
        <div className="md:ml-72 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Change Profile Picture</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
      )}

      {/* Info Fields */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:ml-72">
          <InputField label="Email ID" name="email" value={formData.email} readOnly />
          <InputField label="Parent Address" name="parentAddress" value={formData.parentAddress} onChange={handleChange} />
          <InputField label="Father's Mobile Number" name="fatherPhoneNumber" value={formData.fatherPhoneNumber} onChange={handleChange} />
          <InputField label="Father's Name/Guardian Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
          <InputField label="Mother's Mobile Number" name="motherPhoneNumber" value={formData.motherPhoneNumber} onChange={handleChange} />
          <InputField label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
          <InputField label="Mother's Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
          <InputField label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:ml-72">
          <InputField label="Email ID" value={formData.email} readOnly />
          <InputField label="Parent Address" value={formData.parentAddress} readOnly />
          <InputField label="Father's Mobile Number" value={formData.fatherPhoneNumber} readOnly />
          <InputField label="Father's Name/Guardian Name" value={formData.fatherName} readOnly />
          <InputField label="Mother's Mobile Number" value={formData.motherPhoneNumber} readOnly />
          <InputField label="Mother's Name" value={formData.motherName} readOnly />
          <InputField label="Mother's Occupation" value={formData.motherOccupation} readOnly />
          <InputField label="Father's Occupation" value={formData.fatherOccupation} readOnly />
        </div>
      )}

      {/* Status */}
      <div className="mt-6 md:ml-72">
        {dashboardLoading && <p className="text-blue-500">Loading profile...</p>}
        {dashboardError && <p className="text-red-500">Error: {dashboardError}</p>}
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, readOnly }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      }`}
    />
  </div>
);

export default ParentProfile;
