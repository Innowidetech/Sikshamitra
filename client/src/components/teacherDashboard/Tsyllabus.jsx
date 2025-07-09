import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherSyllabus,
  fetchClassesAndSections,
  setFilters,
} from '../../redux/teacher/tcurriculumSlice';
import { FaBookOpen } from 'react-icons/fa';
import Header from '../adminDashboard/layout/Header';

const Tsyllabus = () => {
  const dispatch = useDispatch();
  const {
    syllabus,
    errorMessage,
    classesAndSections,
    filters: { className },
  } = useSelector((state) => state.tcurriculum);

  // Load classes and sections on mount
  useEffect(() => {
    dispatch(fetchClassesAndSections());
  }, [dispatch]);

  // Fetch syllabus whenever class filter changes
  useEffect(() => {
    if (className) {
      dispatch(fetchTeacherSyllabus(className));
    }
  }, [dispatch, className]);

  const syllabusList = syllabus?.syllabus || [];

  const handleDownloadPDF = async (url) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF.');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `syllabus-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error downloading file:', error);
    }
  };

  // Extract unique classes for dropdown
  const uniqueClasses = classesAndSections?.assignedClasses
    ? [...new Set(classesAndSections.assignedClasses.map((c) => c.class.replace(/^0+/, '')))]
    : [];

  // Handle change in class dropdown
  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    dispatch(setFilters({ className: selectedClass }));
  };

  return (
    <div className="font-sans text-sm text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mx-6 md:mx-10 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Curriculum</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Curriculum</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6 md:ml-72 mt-10">
          <FaBookOpen size={24} className="text-[#146192]" />
          <h2 className="text-xl font-semibold text-black">Teacher Syllabus</h2>
        </div>

        {/* Class filter */}
        <div className="flex gap-4 mb-6 md:ml-72">
          <div>
            <label className="block mb-1 font-medium" htmlFor="classSelect">
              Select Class
            </label>
            <select
              id="classSelect"
              value={className}
              onChange={handleClassChange}
              className="border border-gray-400 rounded p-2"
            >
              <option value="">-- Select Class --</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {syllabusList.length === 0 && !errorMessage && (
          <p className="text-red-600 text-lg md:ml-72">No syllabus found for this class.</p>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block md:ml-72 overflow-x-auto">
          <table className="min-w-full border border-black text-sm bg-[#FFF4E9]">
            <thead>
              <tr>
                <th className="border border-black px-4 py-2 text-left">Class</th>
                <th className="border border-black px-4 py-2 text-left">Subject</th>
                <th className="border border-black px-4 py-2 text-left">Description</th>
                <th className="border border-black px-4 py-2 text-left">Syllabus File</th>
              </tr>
            </thead>
            <tbody>
              {syllabusList.map((item) => (
                <tr key={item._id}>
                  <td className="border border-black px-4 py-2">{item.class}</td>
                  <td className="border border-black px-4 py-2 capitalize">{item.subject}</td>
                  <td className="border border-black px-4 py-2">{item.description}</td>
                  <td className="border border-black px-4 py-2">
                    <button
                      onClick={() => handleDownloadPDF(item.syllabus)}
                      className="text-blue-600 hover:underline"
                    >
                      View / Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="space-y-6 md:hidden">
          {syllabusList.map((item) => (
            <div
              key={item._id}
              className="border border-black bg-[#FFF4E9] rounded shadow-sm overflow-hidden"
            >
              {[['Class', item.class], ['Subject', item.subject.charAt(0).toUpperCase() + item.subject.slice(1)], ['Description', item.description], ['Syllabus File', <button key={item._id} onClick={() => handleDownloadPDF(item.syllabus)} className="text-blue-600 underline">View / Download PDF</button>]].map(
                ([label, value], idx) => (
                  <div key={idx} className="grid grid-cols-2 border-b border-black">
                    <div className="bg-[#146192] text-white p-2 font-medium border-r border-black whitespace-nowrap">
                      {label}
                    </div>
                    <div className="p-2 break-words min-w-0 w-full">{value}</div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tsyllabus;
