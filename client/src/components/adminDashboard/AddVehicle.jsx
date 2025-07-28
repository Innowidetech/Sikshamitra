import React, { useState } from 'react';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    licensePlate: '',
    vehicleName: '',
    startPoint: '',
    endPoint: '',
    pickupPoint: '',
    time: '',
    driverPhoto: '',
    password: '',
    contact: '',
    email: '',
    qualification: '',
    fullName: '',
    address: '',
    licenseNumber: '',
    aadharNumber: '',
    panCard: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const fieldValue = files ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // API call goes here
  };

  return (
    <div className="p-6 bg-white max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#146192] mb-1">Add Vehicle</h1>
        <p className="text-sm text-gray-500">Transportation &gt; Add Vehicle</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Vehicle Details */}
        <div className="border rounded-md shadow p-5">
          <h2 className="text-xl font-semibold text-white bg-[#146192] p-2 rounded-t">Vehicle Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select</option>
                <option value="Bus">Bus</option>
                <option value="Van">Van</option>
                <option value="Auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Licensed Number Plate *</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Vehicle Name *</label>
              <input
                type="text"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="border rounded-md shadow p-5">
          <h2 className="text-xl font-semibold text-white bg-[#146192] p-2 rounded-t">Route Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Start Point *</label>
              <input
                type="text"
                name="startPoint"
                value={formData.startPoint}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Point *</label>
              <input
                type="text"
                name="endPoint"
                value={formData.endPoint}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Pickup Point *</label>
              <input
                type="text"
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Driver Details */}
        <div className="border rounded-md shadow p-5">
          <h2 className="text-xl font-semibold text-white bg-[#146192] p-2 rounded-t">Driver Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Upload Photo *</label>
              <input
                type="file"
                name="driverPhoto"
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email ID *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Highest Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Upload PAN Card</label>
              <input
                type="file"
                name="panCard"
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
         {/* Attendant Details Section */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold bg-[#146192] text-white px-4 py-2 rounded-t">
          Attendant Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Photo*</label>
            <div className="border border-dashed border-gray-400 rounded p-6 text-center text-gray-500">
              Drag and Drop
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">Contact*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter contact number"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter full name"
            />
          </div>

          {/* Upload PAN Card */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload PAN Card*</label>
            <div className="border border-dashed border-gray-400 rounded p-6 text-center text-gray-500">
              Drag and Drop
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter address"
            />
          </div>

          {/* Upload License */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload License*</label>
            <div className="border border-dashed border-gray-400 rounded p-6 text-center text-gray-500">
              Drag and Drop
            </div>
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium mb-1">License Number*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter license number"
            />
          </div>

          {/* Upload Aadhaar */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Aadhaar Card*</label>
            <div className="border border-dashed border-gray-400 rounded p-6 text-center text-gray-500">
              Drag and Drop
            </div>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Aadhaar Card Number*</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter Aadhaar number"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button className="bg-[#146192] hover:bg-[#0f4c75] text-white px-6 py-2 rounded-full">
            Save
          </button>
        </div>
      </div>
      </form>
    </div>
  );
};

export default AddVehicle;
