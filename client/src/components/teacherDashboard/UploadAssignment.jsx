import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTeacherAssignment } from '../../redux/teacher/assignmentsSlice';
import { FaUpload } from 'react-icons/fa';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Header from '../adminDashboard/layout/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadAssignment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.assignments);

  const [formData, setFormData] = useState({
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

    const {
      assignmentName,
      class: classVal,
      section,
      subject,
      chapter,
      startDate,
      endDate,
      file,
    } = formData;

    if (
      !assignmentName ||
      !classVal ||
      !section ||
      !subject ||
      !chapter ||
      !startDate ||
      !endDate ||
      !file
    ) {
      toast.error('Please fill in all fields and upload a file.');
      return;
    }

    const assignmentPayload = {
      assignmentName,
      class: classVal,
      section,
      subject,
      chapter,
      startDate,
      endDate,
      photo: file,
    };

    const result = await dispatch(createTeacherAssignment(assignmentPayload));

    if (createTeacherAssignment.fulfilled.match(result)) {
      toast.success('Assignment uploaded successfully!');
      setTimeout(() => navigate('/assignments'), 1500);
    } else {
      toast.error('Failed to upload assignment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pb-12 ml-64">
      <ToastContainer position="top-right" autoClose={3000} />
      
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
            {/* Assignment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Name</label>
              <input
                type="text"
                name="assignmentName"
                value={formData.assignmentName}
                onChange={handleChange}
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
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0e4a73] transition duration-300"
            >
              <FaUpload />
              {loading ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadAssignment;