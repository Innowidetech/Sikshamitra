import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentForm = ({ onNext, formData, updateFormData }) => {
  const [localFormData, setLocalFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    placeOfBirth: '',
    email: '',
    phoneNumber: '',
    aadhar: '',
    collegeName: '',
    address: '',
    studentPhoto: null,
    ...formData
  });
  const [schoolList, setSchoolList] = useState([]);
  const [fileName, setFileName] = useState(formData?.studentPhoto?.name || '');

  const getSchoolList = async () => {
    try {
      let response = await axios.get('https://sikshamitra.onrender.com/api/user/schools');
      setSchoolList(response.data.schools);
    } catch (error) {
      console.error("Error fetching school list:", error);
    }
  };

  useEffect(() => {
    getSchoolList();
  }, []);

  // Update local form data when parent form data changes
  useEffect(() => {
    if (formData) {
      setLocalFormData(prev => ({
        ...prev,
        ...formData
      }));
      if (formData.studentPhoto) {
        setFileName(formData.studentPhoto.name);
      }
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setLocalFormData(prev => ({
        ...prev,
        studentPhoto: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(localFormData);
    onNext();
  };

  return (
    <div className="p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto" style={{ fontFamily: 'Poppins' }}>
      <div className="bg-[#146192] text-white p-3 mb-6 rounded-tl-xl rounded-tr-xl">
        <h2 className="text-lg lg:text-2xl font-semibold xl:text-[23px]">STUDENT DETAILS</h2>
      </div>
      <div className='grid md:flex md:gap-4'>
        <div>
          <div>
            <label className="block text-sm mb-3 font-semibold text-[#1982C4] lg:text-lg">Photo*</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center lg:w-[150px] lg:h-[130px]">
              <p className="text-sm text-gray-500">Upload your photo here</p>
              <input
                type="file"
                name='studentPhoto'
                required={!localFormData.studentPhoto}
                accept="image/*"
                className="hidden"
                id="profile-photo"
                onChange={handleFileChange}
              />
              <label
                htmlFor="profile-photo"
                className="text-blue-300 text-sm mt-2 cursor-pointer inline-block"
              >
                Choose File
              </label>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">{fileName}</p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:max-w-xl lg:max-w-3xl xl:max-w-5xl space-y-6 text-[#1982C4] mt-4 md:mt-0">
          {/* Rest of the form fields remain the same */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">First Name*</label>
              <input
                type="text"
                name="firstName"
                value={localFormData.firstName}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[200px] lg:w-[250px] xl:w-[400px]"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={localFormData.lastName}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[200px] lg:w-[300px] xl:w-[400px]"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className='md:flex md:gap-6'>
            <div>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">Date Of Birth *</label>
              <input
                type="date"
                name="dob"
                value={localFormData.dob}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[200px] lg:w-[300px] xl:w-[400px]"
              />
            </div>
            <div className='mt-6 md:mt-0'>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">Place Of Birth</label>
              <input
                type="text"
                name="placeOfBirth"
                value={localFormData.placeOfBirth}
                onChange={handleInputChange}
                placeholder='Hyderabad'
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[200px] lg:w-[300px] xl:w-[400px]"
              />
            </div>
          </div>

          <div className='md:flex md:gap-6'>
            <div>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">Email*</label>
              <input
                type="email"
                name="email"
                value={localFormData.email}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[200px] lg:w-[300px] xl:w-[400px]"
                placeholder="Enter email address"
              />
            </div>
            <div className='mt-6 md:mt-0'>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">Phone Number*</label>
              <input
                type="tel"
                name="phoneNumber"
                value={localFormData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[200px] lg:w-[300px] xl:w-[400px]"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold lg:text-lg">Aadhar card Number</label>
            <input
              type="tel"
              name="aadhar"
              value={localFormData.aadhar}
              onChange={handleInputChange}
              placeholder='1000 1000 1000'
              required
              className="w-full border rounded p-2 border-[#C1BBEB] md:w-[250px] lg:w-[300px] xl:w-[400px]"
            />
          </div>

          <div>
            <select
              name="collegeName"
              value={localFormData.collegeName}
              onChange={handleInputChange}
              className="w-full border rounded p-2 border-[#C1BBEB] md:w-[300px] lg:w-[350px] xl:w-[500px]"
              required
            >
              <option value="">Select a school/university</option>
              {schoolList.map((school) => (
                <option key={school._id} value={school.schoolName}>
                  {school.schoolName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold lg:text-lg">Address*</label>
            <textarea
              name="address"
              value={localFormData.address}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2 h-24 border-[#C1BBEB] md:w-[340px] lg:w-[400px] xl:w-[600px]"
              placeholder="Enter complete address"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-[#1982C4] text-white rounded-full"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;