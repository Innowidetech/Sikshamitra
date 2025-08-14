// EntranceExamForm.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchools, applyForEntranceExam } from '../redux/users/entranceSlice';
import { fetchAdminEntranceApplications } from '../redux/adminEntranceSlice';

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
    startDate: '',
    endDate: '',
    board: '',
    schoolBoard: '',
    percentage: '',
    schoolAddress: '',
    documents: null,
    photo: null,
  });

  // ✅ Local success message state
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? (files.length > 1 ? files : files[0]) : value,
    }));
    // Clear message when editing form again
    if (successMessage) setSuccessMessage('');
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
      startDate: '',
      endDate: '',
      board: '',
      schoolBoard: '',
      percentage: '',
      schoolAddress: '',
      documents: null,
      photo: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isOtherBoard = formData.board === 'Others';

    const payload = {
      academicYear: formData.academicYear,
      classApplying: formData.classApplying,
      school: formData.school,
      studentDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        aadharNo: formData.aadhaar || '',
        email: formData.email || '',
        phoneNumber: formData.phone || '',
        gender: formData.gender,
        photo: formData.photo,
      },
      previousSchoolDetails: {
        schoolName: formData.previousSchool || '',
        lastClassAttended: formData.lastClass || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        board: formData.board || '',
        schoolBoard: isOtherBoard ? formData.schoolBoard : '',
        percentage: formData.percentage || '',
        schoolAddress: formData.schoolAddress || '',
        documents: formData.documents,
      },
    };

    dispatch(applyForEntranceExam(payload)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        resetForm();
        dispatch(fetchAdminEntranceApplications());
        // ✅ Set message to display after submission
        setSuccessMessage(
          applicationResponse?.message || 'Application submitted successfully!'
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔶 Banner Header */}
      <div className="w-full bg-[#FF9F1C] md:px-12 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0 shadow-md">
        <h1 className="text-white text-lg sm:text-xl md:text-3xl font-semibold text-center md:ml-16">
          Apply for Entrance Exam
        </h1>
        <img
          src="src/assets/entrance-banner.png"
          alt="Entrance Exam"
          className="h-40 sm:h-24 md:h-40 object-contain"
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
                required
              />
            </div>
          </Section>

          {/* Previous School Details */}
          <Section title="PREVIOUS SCHOOL DETAILS">
            <Input label="Name of Previous School" name="previousSchool" required value={formData.previousSchool} onChange={handleChange} />
            <Input label="Last Class Attended" name="lastClass" type="number" required value={formData.lastClass} onChange={handleChange} />
            <Input label="Start Date" name="startDate" type="date" required value={formData.startDate} onChange={handleChange} />
            <Input label="End Date" name="endDate" type="date" required value={formData.endDate} onChange={handleChange} />

            {/* Board Radio Buttons */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Board *</label>
              <div className="flex gap-6">
                {['CBSE', 'ICSE', 'State Board', 'Others'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="board"
                      value={option}
                      checked={formData.board === option}
                      onChange={handleChange}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {formData.board === 'Others' && (
              <Input label="Enter School Board" name="schoolBoard" required value={formData.schoolBoard} onChange={handleChange} />
            )}

            <Input label="Enter Previous Year Percentage" name="percentage" type="number" required value={formData.percentage} onChange={handleChange} />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">School Address *</label>
              <textarea
                name="schoolAddress"
                value={formData.schoolAddress}
                onChange={handleChange}
                required
                className="w-full border border-[#B3B8FF] rounded-md px-3 py-2"
              />
            </div>

            {/* Upload Documents */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Upload Documents *</label>
              <input
                type="file"
                name="documents"
                onChange={handleChange}
                className="w-full border border-[#B3B8FF] rounded-md px-3 py-2 bg-white"
                multiple
                required
              />
            </div>
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

          {/* Error Message */}
          {applicationError && <p className="mt-4 text-red-600 text-center">{applicationError}</p>}

          {/* Success Message */}
          {successMessage && (
            <p className="mt-4 text-green-600 text-center">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

// Input Component
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

// Section Wrapper
const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-6">
    <div className="bg-[#07578C] text-white px-4 py-2 font-semibold rounded-t-md">{title}</div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

export default EntranceExamForm;
