// src/components/teacherDashboard/AssignmentDetails.jsx
import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmittedAssignments } from '../../redux/teacher/assignmentsSlice';
import Header from '../adminDashboard/layout/Header';

const AssignmentDetails = ({ assignment }) => {
  const dispatch = useDispatch();
  const { teacherAssignments, loading, error } = useSelector((state) => state.assignments);

  // Our new array lives under teacherAssignments.submittedBy
  const submissions = teacherAssignments?.submittedBy || [];

  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 5;

  useEffect(() => {
    if (assignment?._id) {
      dispatch(fetchSubmittedAssignments(assignment._id));
    }
  }, [assignment, dispatch]);

  // Download helper (unchanged)
  const handleDownload = async (url, fallbackName = 'download') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();

      let ext = '.pdf';
      if      (blob.type.includes('pdf'))  ext = '.pdf';
      // else if (blob.type.includes('jpeg')) ext = '.jpg';
      // else if (blob.type.includes('png'))  ext = '.png';
      // else if (blob.type.includes('mp4'))  ext = '.mp4';
      // else if (blob.type.includes('msword')) ext = '.doc';
      // else if (blob.type.includes('officedocument.wordprocessingml.document')) ext = '.docx';

      const filename = `${fallbackName}${ext}`;
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file.');
    }
  };

  if (!assignment) {
    return <div className="p-6">No assignment selected.</div>;
  }

  // Pagination
  const indexOfLast = currentPage * assignmentsPerPage;
  const indexOfFirst = indexOfLast - assignmentsPerPage;
  const current = submissions.slice(indexOfFirst, indexOfLast);
  const pages = Math.ceil(submissions.length / assignmentsPerPage);

  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
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
          <DetailRow label="Title" value={assignment.assignmentName} />
          <DetailRow label="Class" value={assignment.class} />
          <DetailRow label="Subject" value={assignment.subject} />
          <DetailRow label="Section" value={assignment.section} />
          <DetailRow label="Chapter" value={assignment.chapter} />
          <DetailRow
            label="Start Date"
            value={new Date(assignment.startDate).toLocaleDateString()}
          />
          <DetailRow
            label="End Date"
            value={new Date(assignment.endDate).toLocaleDateString()}
          />
          <div className="flex items-center gap-4">
            <p className="text-white font-medium">File:</p>
            {assignment.assignment ? (
              <button
                onClick={() => handleDownload(assignment.assignment, assignment.assignmentName)}
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

      {/* Submitted List */}
      <div className="mt-12 max-w-5xl mx-auto">
        <div className="flex items-center mb-4">
          <FaBook className="text-[#146192] text-2xl mr-2" />
          <h2 className="text-xl font-semibold text-[#146192]">
            Submitted Assignments
          </h2>
        </div>

        {loading && <p className="text-gray-700 mb-4">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#146192] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Student ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Submitted On</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Download</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {current.length > 0 ? (
                current.map((sub) => {
                  const stu = sub.studentId.studentProfile;
                  const date = new Date(sub.createdAt).toLocaleDateString();
                  return (
                    <tr key={sub._id}>
                      <td className="px-4 py-2 text-sm">{stu.registrationNumber}</td>
                      <td className="px-4 py-2 text-sm">{stu.fullname}</td>
                      <td className="px-4 py-2 text-sm">{date}</td>
                      <td className="px-4 py-2 text-sm">
                        {sub.assignmentWork ? (
                          <button
                            onClick={() =>
                              handleDownload(sub.assignmentWork, stu.fullname)
                            }
                            className="bg-[#146192] text-white px-3 py-1 rounded-md"
                          >
                            Download
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-[#146192] text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
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
    <p className="text-white">{value}</p>
  </div>
);

export default AssignmentDetails;
