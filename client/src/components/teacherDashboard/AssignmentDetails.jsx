// src/components/teacherDashboard/AssignmentDetails.jsx

import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmittedAssignments } from '../../redux/teacher/assignmentsSlice';
import Header from '../adminDashboard/layout/Header';

const AssignmentDetails = ({ assignment }) => {
  const dispatch = useDispatch();
  const { submittedAssignments, loading, error } = useSelector((state) => state.assignments);

  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 5;

  useEffect(() => {
    if (assignment?._id) {
      dispatch(fetchSubmittedAssignments(assignment._id));
    }
  }, [assignment, dispatch]);

  const handleDownload = async (url, fallbackName = 'download') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();

      let ext = '.pdf';
      if (blob.type.includes('pdf')) ext = '.pdf';

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

  if (!submittedAssignments || !submittedAssignments.assignmentId) {
    return <div className="p-6">Invalid assignment data or loading...</div>;
  }

  const assignmentData = submittedAssignments.assignmentId;
  const submissions = submittedAssignments.submittedBy || [];

  const indexOfLast = currentPage * assignmentsPerPage;
  const indexOfFirst = indexOfLast - assignmentsPerPage;
  const current = submissions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(submissions.length / assignmentsPerPage);

  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-light xl:text-[35px]">Assignments</h1>
          <hr className="mt-2 border-[#146192] w-[180px]" />
          <p className="mt-2">
            <span>Home</span> {'>'} <span className="text-[#146192]">Assignment Details</span>
          </p>
        </div>
        <Header />
      </div>

      {/* Assignment Info */}
      <div className="flex items-center mb-4 mt-10">
        <FaBook className="text-[#146192] text-2xl mr-2" />
        <h2 className="text-xl font-semibold text-[#146192]">Assignment Details</h2>
      </div>
      <div className="bg-[#146192D9] p-4 rounded-2xl shadow-md max-w-3xl w-full mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailRow label="Title" value={assignmentData.assignmentName} />
          <DetailRow label="Class" value={assignmentData.class} />
          <DetailRow label="Subject" value={assignmentData.subject} />
          <DetailRow label="Section" value={assignmentData.section} />
          <DetailRow label="Chapter" value={assignmentData.chapter} />
          <DetailRow
            label="Start Date"
            value={new Date(assignmentData.startDate).toLocaleDateString()}
          />
          <DetailRow
            label="End Date"
            value={new Date(assignmentData.endDate).toLocaleDateString()}
          />
          <div className="flex items-center gap-4">
            <p className="text-white font-medium">File:</p>
            {assignmentData.assignment ? (
              <button
                onClick={() => handleDownload(assignmentData.assignment, assignmentData.assignmentName)}
                className="bg-white text-[#146192] px-4 py-1 rounded-md font-medium hover:bg-blue-100 transition"
              >
                Download
              </button>
            ) : (
              <span className="text-white">No File</span>
            )}
          </div>
        </div>
      </div>

      {/* Submissions */}
      <div className="mt-12 max-w-5xl mx-auto">
        <div className="flex items-center mb-4">
          <FaBook className="text-[#146192] text-2xl mr-2" />
          <h2 className="text-xl font-semibold text-[#146192]">Submitted Assignments</h2>
        </div>

        {loading && <p className="text-gray-700 mb-4">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Desktop Table */}
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#146192] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Student ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Submitted On</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Download</th>
              </tr>
            </thead>

            <tbody className="bg-[#1982C408] divide-y divide-gray-200">
              {current.length > 0 ? (
                current.map((sub) => {
                  const profile = sub.studentId?.studentProfile || {};
                  const submittedDate = sub?.submittedDate
                    ? new Date(sub.submittedDate).toLocaleDateString()
                    : 'Not Available';

                  return (
                    <tr
                      key={sub._id}
                      className="block sm:table-row border sm:border-0 rounded-lg sm:rounded-none mb-4 sm:mb-0 shadow-sm sm:shadow-none p-4 sm:p-0"
                    >
                      <td className="px-4 py-2 text-sm sm:table-cell block">
                        <span className="sm:hidden font-semibold text-gray-700">Student ID: </span>
                        {profile.registrationNumber || 'N/A'}
                      </td>

                      <td className="px-4 py-2 text-sm sm:table-cell block">
                        <span className="sm:hidden font-semibold text-gray-700">Student Name: </span>
                        {profile.fullname || 'N/A'}
                      </td>

                      <td className="px-4 py-2 text-sm sm:table-cell block">
                        <span className="sm:hidden font-semibold text-gray-700">Submitted On: </span>
                        {submittedDate}
                      </td>

                      <td className="px-4 py-2 text-sm sm:table-cell block">
                        <span className="sm:hidden font-semibold text-gray-700">Download: </span>
                        <button
                          onClick={() => handleDownload(sub.assignmentWork, profile.fullname)}
                          className="bg-[#146192] text-white px-3 py-1 rounded-md hover:bg-[#0f4b6e] mt-2 sm:mt-0"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {current.length > 0 ? (
            current.map((sub) => {
              const profile = sub.studentId?.studentProfile || {};
              const submittedDate = sub?.submittedDate
                ? new Date(sub.submittedDate).toLocaleDateString()
                : 'Not Available';

              return (
                <div
                  key={sub._id}
                  className="border border-gray-300 rounded-lg p-4 shadow flex flex-col gap-2"
                >
                  <p>
                    <span className="font-semibold">Student ID:</span> {profile.registrationNumber || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Student Name:</span> {profile.fullname || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Submitted On:</span> {submittedDate}
                  </p>
                  <button
                    onClick={() => handleDownload(sub.assignmentWork, profile.fullname)}
                    className="bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0f4b6e] mt-2 self-start"
                  >
                    Download
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-gray-500">No submissions found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === idx + 1 ? 'bg-[#146192] text-white' : 'bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <p className="text-white font-medium">{label}:</p>
    <p className="text-white">{value || 'N/A'}</p>
  </div>
);

export default AssignmentDetails;
