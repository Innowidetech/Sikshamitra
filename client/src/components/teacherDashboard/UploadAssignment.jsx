import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTeacherAssignment } from '../../redux/teacher/assignmentsSlice';
import { FaUpload } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Header from '../adminDashboard/layout/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function UploadAssignment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.assignments);

  const [formData, setFormData] = useState({
    assignmentName: '',  // 👈 Used as CHAPTER
    chapterName: '',     // 👈 Used as ASSIGNMENT NAME
    class: '',
    section: '',
    subject: '',
    startDate: '',
    endDate: '',
    file: null,
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const {
    chapterName,       // Will be sent as assignmentName
    assignmentName,    // Will be sent as chapter
    class: classVal,
    section,
    subject,
    startDate,
    endDate,
    file,
  } = formData;

  if (!chapterName || !assignmentName || !classVal || !section || !subject || !startDate || !endDate || !file) {
    toast.error('Please fill in all fields and upload a file.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Token missing. Please log in again.');
    return;
  }

  // Create FormData with correct keys matching API expectations
  const formDataToSend = new FormData();
  formDataToSend.append('assignmentName', chapterName); // ✅ assignmentName = chapterName
  formDataToSend.append('chapter', assignmentName);     // ✅ chapter = assignmentName
  formDataToSend.append('class', classVal);
  formDataToSend.append('section', section);
  formDataToSend.append('subject', subject);
  formDataToSend.append('startDate', startDate);
  formDataToSend.append('endDate', endDate);
  formDataToSend.append('photo', file);                // ✅ File field must be called `photo`

  try {
    const response = await axios.post(
      'https://sikshamitra.onrender.com/api/teacher/assignment',
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200 || response.data?.success) {
      toast.success('Assignment uploaded successfully!');
      setTimeout(() => navigate('/assignments'), 1500);
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    const msg = error.response?.data?.message || 'Upload failed. Please try again.';
    toast.error(msg);
  }
};


  return (
    <div className="min-h-screen pb-12 lg:ml-64 px-4 sm:px-6 md:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-16">
        <div className="mb-4 md:mb-0">
          <h1 className="text-lg sm:text-xl xl:text-[38px] font-light text-black">
            Upload Assignment
          </h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[100px]" />
          <h1 className="mt-2 text-sm sm:text-base">
            <span>Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192]">Upload Assignment</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex flex-col items-center justify-center mt-8">
        <div className="w-full max-w-4xl bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#146192] mb-6 text-center">
            Upload Assignment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assignment Name (saves to chapterName) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Name
              </label>
              <input
                type="text"
                name="chapterName"
                value={formData.chapterName}
                onChange={handleChange}
                placeholder="e.g., Worksheet 1"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Class & Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g., A"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Subject & Chapter Name (saves to assignmentName) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., English"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  name="assignmentName"
                  value={formData.assignmentName}
                  onChange={handleChange}
                  placeholder="e.g., Chapter 4 – Grammar"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Start & End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Assignment File
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <AiOutlineFilePdf className="text-2xl text-red-600 mr-2" />
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="w-full text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0e4a73] transition duration-300"
            >
              <FaUpload />
              {loading ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </form>

          {responseMessage && (
            <div className="mt-6 text-center text-base font-medium text-[#146192]">
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadAssignment;
