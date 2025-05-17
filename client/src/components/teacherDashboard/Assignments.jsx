// src/components/teacherDashboard/Assignments.jsx
import React, { useEffect } from 'react';
import Header from '../adminDashboard/layout/Header';
import { HiBookOpen } from 'react-icons/hi';
import { FaUser, FaBook, FaListOl, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherAssignments } from '../../redux/teacher/assignmentsSlice';

function Assignments({ handleTabChange }) {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(fetchTeacherAssignments());
  }, [dispatch]);

  const handleDownload = async (url, fallbackName = 'download') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();

      // Determine extension from MIME type
      let ext = '.pdf';
      if      (blob.type.includes('pdf'))  ext = '.pdf';
      // else if (blob.type.includes('jpeg')) ext = '.jpg';
      // else if (blob.type.includes('png'))  ext = '.png';
      // else if (blob.type.includes('mp4'))  ext = '.mp4';
      // else if (blob.type.includes('msword')) ext = '.doc';
      // else if (blob.type.includes('officedocument.wordprocessingml.document')) ext = '.docx';

      const filename = `${fallbackName}${ext}`;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file.');
    }
  };

  if (loading) return <div className="mt-20 ml-72">Loading...</div>;
  if (error)   return <div className="mt-20 ml-72">Error: {error}</div>;

  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light xl:text-[35px]">Assignments</h1>
          <hr className="mt-2 border-[#146192] w-[180px]" />
          <p className="mt-2">
            Home {'>'} <span className="text-[#146192]">Assignments</span>
          </p>
        </div>
        <Header />
      </div>

      {/* Assignment Cards */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <HiBookOpen className="text-[#146192] text-3xl" />
          <h2 className="text-2xl font-semibold text-[#146192]">All Assignments in Class</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a, i) => (
            <div
              key={a._id}
              className={`p-6 rounded-bl-2xl rounded-br-2xl shadow-md ${
                i % 2 === 0 ? 'bg-[#FF9F1C1A]' : 'bg-[#1982C424]'
              }`}
            >
              <div className="mb-2 flex items-center">
                <FaUser className="text-[#146192] mr-2" />
                <span className="font-medium">Teacher: {a.teacherName}</span>
              </div>
              <div className="mb-2 flex items-center">
                <FaBook className="text-[#146192] mr-2" />
                <span className="font-medium">Subject: {a.subject}</span>
              </div>
              <div className="mb-2 flex items-center">
                <FaListOl className="text-[#146192] mr-2" />
                <span className="font-medium">Chapter: {a.chapter}</span>
              </div>
              <div className="mb-2 flex items-center">
                <FaCalendarAlt className="text-[#146192] mr-2" />
                <span className="font-medium">
                  Start: {a.startDate ? new Date(a.startDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="mb-2 flex items-center">
                <FaCalendarAlt className="text-[#146192] mr-2" />
                <span className="font-medium">
                  End: {a.endDate ? new Date(a.endDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDownload(a.assignment, a.assignmentName)}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-[#0e4a73] hover:text-white transition shadow-md"
                >
                  View
                </button>
               
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handleTabChange('uploadassignment')}
          className="bg-[#146192] text-white px-6 py-2 rounded-lg hover:bg-[#0e4a73] transition"
        >
          UPLOAD ASSIGNMENT
        </button>
      </div>

      {/* Assignment Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="text-[#146192]">
            <tr>
              {[
                'Assignment Name',
                'Teacher',
                'Class',
                'Section',
                'Subject',
                'Chapter',
                'Start Date',
                'End Date',
                'Actions',
              ].map((h) => (
                <th key={h} className="px-4 py-2 border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{a.assignmentName}</td>
                <td className="px-4 py-2 border bg-[#1982C424]">{a.teacherName}</td>
                <td className="px-4 py-2 border">{a.class}</td>
                <td className="px-4 py-2 border bg-[#1982C424]">{a.section}</td>
                <td className="px-4 py-2 border">{a.subject}</td>
                <td className="px-4 py-2 border bg-[#1982C424]">{a.chapter}</td>
                <td className="px-4 py-2 border">
                  {a.startDate ? new Date(a.startDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-2 border bg-[#1982C424]">
                  {a.endDate ? new Date(a.endDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-2 border text-center">
                  <FaFileAlt
                    className="text-[#1982C4] text-xl cursor-pointer hover:text-[#146192]"
                    title="View Details"
                    onClick={() => handleTabChange('assignmentdetails', a)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;
