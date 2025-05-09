import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Header from '../adminDashboard/layout/Header';
import axios from 'axios';

function UploadAssignment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    classDetail: '',
    assignmentName: '',
    class: '',
    section: '',
    subject: '',
    chapter: '',
    startDate: '',
    endDate: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (
      !formData.classDetail ||
      !formData.assignmentName ||
      !formData.class ||
      !formData.section ||
      !formData.subject ||
      !formData.chapter ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.file
    ) {
      alert('Please fill in all fields and upload a file.');
      return;
    }

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      key === 'file' ? uploadData.append('photo', value) : uploadData.append(key, value)
    );

    try {
      // Replace with your API endpoint to create an assignment
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/assignment',
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        alert('Assignment submitted successfully!');
        navigate('/assignments'); // Navigate to assignments page after submission
      } else {
        alert('Error submitting assignment');
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('Failed to upload assignment. Please try again.');
    }
  };

  return (
    <div className=" min-h-screen pb-12 ml-64">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 pt-6">
        <div className="mb-4 md:mb-0 mt-16">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">Upload Assignment</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-2 text-base sm:text-lg">
            <span>Home</span> {">"} <span className="font-medium text-[#146192]">Upload Assignment</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Upload Assignment Form */}
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-[#146192] mb-6 text-center">Upload Assignment</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Detail</label>
              <input
                type="text"
                name="classDetail"
                value={formData.classDetail}
                onChange={handleChange}
                placeholder="Enter the class details"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Assignment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Name</label>
              <input
                type="text"
                name="assignmentName"
                value={formData.assignmentName}
                onChange={handleChange}
                placeholder="Enter assignment name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Class and Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Class"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Section"
                />
              </div>
            </div>

            {/* Subject and Chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Chapter Name"
                />
              </div>
            </div>

            {/* Start and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Assignment File</label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <AiOutlineFilePdf className="text-2xl text-red-600 mr-2" />
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0e4a73] transition duration-300"
            >
              <FaUpload />
              Submit Assignment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadAssignment;
