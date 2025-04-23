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

  const handleDownload = async (url, name = 'assignment') => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const contentType = blob.type;

      let extension = '';
      if (contentType.includes('pdf')) extension = '.pdf';
      else if (contentType.includes('jpeg')) extension = '.jpg';
      else if (contentType.includes('png')) extension = '.png';
      else if (contentType.includes('mp4')) extension = '.mp4';
      else if (contentType.includes('msword')) extension = '.doc';
      else if (contentType.includes('officedocument.wordprocessingml.document')) extension = '.docx';

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name + extension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  if (loading) return <div className="mt-20 ml-72">Loading...</div>;
  if (error) return <div className="mt-20 ml-72">Error: {error}</div>;

  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[35px]">Assignments</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[180px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Assignments</span>
          </h1>
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
          {assignments.map((assignment, index) => (
            <div
              key={assignment._id || index}
              className={`p-6 rounded-bl-2xl rounded-br-2xl shadow-md ${
                index % 2 === 0 ? 'bg-[#FF9F1C1A]' : 'bg-[#1982C424]'
              }`}
            >
              <div className="mb-2 flex items-center">
                <FaUser className="text-[#146192] mr-2" />
                <span className="text-gray-800 font-medium">Teacher: {assignment.teacherName}</span>
              </div>
              <div className="mb-2 flex items-center">
                <FaBook className="text-[#146192] mr-2" />
                <span className="text-gray-800 font-medium">Subject: {assignment.subject}</span>
              </div>
              <div className="mb-2 flex items-center">
                <FaListOl className="text-[#146192] mr-2" />
                <span className="text-gray-800 font-medium">Chapter: {assignment.chapter}</span>
              </div>
              <div className="mb-2 flex items-center">
                <FaCalendarAlt className="text-[#146192] mr-2" />
                <span className="text-gray-800 font-medium">
                  Start: {assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="mb-2 flex items-center">
                <FaCalendarAlt className="text-[#146192] mr-2" />
                <span className="text-gray-800 font-medium">
                  End: {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleDownload(assignment.assignment, assignment.assignmentName)}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-[#0e4a73] hover:text-white transition duration-300 shadow-md"
                  title="View Assignment"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Assignment Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handleTabChange('uploadassignment')}
          className="bg-[#146192] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#0e4a73] transition duration-300"
        >
          UPLOAD ASSIGNMENT
        </button>
      </div>

      {/* Assignment Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
          <thead className="text-[#146192]">
            <tr>
              <th className="py-2 px-4 border bg-white">Assignment Name</th>
              <th className="py-2 px-4 border bg-[#1982C424]">Teacher Name</th>
              <th className="py-2 px-4 border bg-white">Class</th>
              <th className="py-2 px-4 border bg-[#1982C424]">Section</th>
              <th className="py-2 px-4 border bg-white">Subject</th>
              <th className="py-2 px-4 border bg-[#1982C424]">Chapter</th>
              <th className="py-2 px-4 border bg-white">Start Date</th>
              <th className="py-2 px-4 border bg-[#1982C424]">End Date</th>
              <th className="py-2 px-4 border bg-white">Submission</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id} className="text-center hover:bg-gray-100 transition-colors duration-300">
                <td className="py-2 px-4 border">{assignment.assignmentName}</td>
                <td className="py-2 px-4 border bg-[#1982C424]">{assignment.teacherName}</td>
                <td className="py-2 px-4 border">{assignment.class}</td>
                <td className="py-2 px-4 border bg-[#1982C424]">{assignment.section}</td>
                <td className="py-2 px-4 border">{assignment.subject}</td>
                <td className="py-2 px-4 border bg-[#1982C424]">{assignment.chapter}</td>
                <td className="py-2 px-4 border">
                  {assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 px-4 border bg-[#1982C424]">
                  {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 px-4 border">
                  <FaFileAlt
                    title="Download"
                    className="text-[#1982C4] text-xl cursor-pointer hover:text-[#146192]"
                    onClick={() => handleDownload(assignment.assignment, assignment.assignmentName)}
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
