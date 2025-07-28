import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchools, applyForEntranceExam } from '../redux/users/entranceSlice';
import { fetchAdminEntranceApplications } from '../redux/adminEntranceSlice'; // Adjust path as needed


const EntranceExamForm = () => {
  const dispatch = useDispatch();
  const {
    schools,
    isLoadingSchools,
    schoolError,
    applicationStatus,
    applicationError,
    applicationResponse,
  } = useSelector((state) => state.entrance);

  const [formData, setFormData] = useState({
    academicYear: '',
    classApplying: '',
    school: '',
    firstName: '',
    lastName: '',
    dob: '',
    aadhaar: '',
    email: '',
    phone: '',
    gender: '',
    previousSchool: '',
    lastClass: '',
    board: '',
    schoolBoard: '',
    percentage: '',
    photo: null,
  });

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      academicYear: '',
      classApplying: '',
      school: '',
      firstName: '',
      lastName: '',
      dob: '',
      aadhaar: '',
      email: '',
      phone: '',
      gender: '',
      previousSchool: '',
      lastClass: '',
      board: '',
      schoolBoard: '',
      percentage: '',
      photo: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isOtherBoard = formData.board.toUpperCase() === 'OTHERS';

    const payload = {
      academicYear: formData.academicYear,
      classApplying: formData.classApplying,
      school: formData.school, // ✅ Send school name (not ID)

      studentDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        aadharNo: formData.aadhaar || '',
        email: formData.email || '',
        phoneNumber: formData.phone || '',
        gender: formData.gender,
        photo: formData.photo, // ✅ File object
      },

      previousSchoolDetails: {
        schoolName: formData.previousSchool || '',
        lastClassAttended: formData.lastClass || '',
        board: formData.board || '',
        schoolBoard: isOtherBoard ? formData.schoolBoard : '',
        percentage: formData.percentage || '',
      },
    };

    dispatch(applyForEntranceExam(payload)).then((res) => {
  if (res.meta.requestStatus === 'fulfilled') {
    resetForm();
    dispatch(fetchAdminEntranceApplications()); // ✅ Add this line
  }
});

   
  };

  return (


    <div className="min-h-screen bg-gray-50">
      {/* 🔶 Banner Header */}
      <div className="w-full bg-[#FF9F1C]  md:px-12 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0 shadow-md">
        <h1 className="text-white text-lg sm:text-xl md:text-3xl font-semibold text-center md:ml-16">
          Apply for Entrance Exam
        </h1>
        <img
          src="src/assets/entrance-banner.png" // Make sure this is in your /public/assets folder
          alt="Entrance Exam"
          className="h-40  sm:h-24 md:h-40 object-contain"
        />
      </div>

      {/* ⬜ White Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Academic Info */}
          <div className="bg-white border rounded-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Academic Year" name="academicYear" type="number" required value={formData.academicYear} onChange={handleChange} />
              <Input label="Class Applying" name="classApplying" type="number" required value={formData.classApplying} onChange={handleChange} />
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#004C97] mb-1">Select School *</label>
                {isLoadingSchools ? (
                  <p>Loading schools...</p>
                ) : schoolError ? (
                  <p className="text-red-500">{schoolError}</p>
                ) : (
                  <select
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full border border-[#A1A9FF] rounded-md px-3 py-2 bg-white"
                    required
                  >
                    <option value="">Select</option>
                    {schools?.schools?.map((school) => (
                      <option key={school.schoolCode} value={school.schoolName}>
                        {school.schoolName} - {school.location}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Student Details */}
          <Section title="STUDENT DETAILS">
            <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
            <Input label="Date of Birth" name="dob" type="date" required value={formData.dob} onChange={handleChange} />
            <Input label="Aadhar Card Number" name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
            <Input label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            <div>
              <label className="block text-sm font-semibold mb-2">Gender</label>
              <div className="flex gap-6">
                {['female', 'male'].map((gender) => (
                  <label key={gender} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                      required
                    />
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Upload Photo</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full border border-[#B3B8FF] rounded-md px-3 py-2 bg-white"
                accept="image/*"
              />
            </div>
          </Section>

          {/* Previous School Details */}
          <Section title="PREVIOUS SCHOOL DETAILS">
            <Input label="Previous School Name" name="previousSchool" value={formData.previousSchool} onChange={handleChange} />
            <Input label="Last Class Attended" name="lastClass" type="number" value={formData.lastClass} onChange={handleChange} />
            <div>
              <label className="block text-sm font-semibold mb-1">Board</label>
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                className="w-full border border-[#B3B8FF] rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">STATE BOARD</option>
                <option value="OTHERS">OTHERS</option>
              </select>
            </div>
            {formData.board.toUpperCase() === 'OTHERS' && (
              <Input label="Enter School Board" name="schoolBoard" value={formData.schoolBoard} onChange={handleChange} />
            )}
            <Input label="Percentage" name="percentage" type="number" value={formData.percentage} onChange={handleChange} />
          </Section>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={applicationStatus === 'loading'}
              className="bg-[#146192] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#104f7a] disabled:opacity-50"
            >
              {applicationStatus === 'loading' ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {/* Messages */}
          {applicationError && <p className="mt-4 text-red-600 text-center">{applicationError}</p>}
          {applicationStatus === 'succeeded' && (
            <p className="mt-4 text-green-600 text-center">
              Application submitted successfully!
              {applicationResponse?.message && ` (${applicationResponse.message})`}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

// Reusable Input component
const Input = ({ label, name, type = 'text', value, onChange, required }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-[#B3B8FF] rounded-md px-3 py-2"
    />
  </div>
);

// Reusable Section component
const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-6">
    <div className="bg-[#07578C] text-white px-4 py-2 font-semibold rounded-t-md">{title}</div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

export default EntranceExamForm;
