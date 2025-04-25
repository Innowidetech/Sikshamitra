import React, { useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmittedAssignments } from '../../redux/teacher/assignmentsSlice';
import Header from '../adminDashboard/layout/Header';

const AssignmentDetails = ({ assignment }) => {
  const dispatch = useDispatch();
  const { submittedAssignments, loading, error } = useSelector((state) => state.assignments);

  // Fetch submitted assignments using Redux action
  useEffect(() => {
    if (assignment?._id) {
      dispatch(fetchSubmittedAssignments(assignment._id));
    }
  }, [assignment, dispatch]);

  if (!assignment) {
    return <div className="p-6">No assignment selected.</div>;
  }

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

      {/* Assignment Details Heading */}
      <div className="flex items-center mb-4 mt-10">
        <FaBook className="text-[#146192] text-2xl mr-2" />
        <h2 className="text-xl font-semibold text-[#146192]">Assignment Details</h2>
      </div>

      {/* Assignment Details Box */}
      <div className="bg-[#146192D9] p-4 rounded-2xl shadow-md max-w-3xl w-full mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">Assignment Title:</p>
            <p className="text-white">{assignment.assignmentName}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">Class:</p>
            <p className="text-white">{assignment.class}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">Subject:</p>
            <p className="text-white">{assignment.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">Section:</p>
            <p className="text-white">{assignment.section}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">Chapter Name:</p>
            <p className="text-white">{assignment.chapter}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">Start Date:</p>
            <p className="text-white">{new Date(assignment.startDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">End Date:</p>
            <p className="text-white">{new Date(assignment.endDate).toLocaleDateString()}</p>
          </div>

          {/* View Button for Assignment File */}
          <div className="flex items-center gap-4">
            <p className="text-white font-medium">Assignment File:</p>
            {assignment?.assignmentFile ? (
              <a
                href={assignment.assignmentFile}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#146192] px-4 py-1 rounded-md font-medium hover:bg-blue-100 transition"
              >
                View
              </a>
            ) : (
              <span className="text-white">No File</span>
            )}
          </div>
        </div>
      </div>

      {/* Submitted Students Section */}
      <div className="mt-12 max-w-5xl mx-auto">
        <div className="flex items-center mb-4">
          <FaBook className="text-[#146192] text-2xl mr-2" />
          <h2 className="text-xl font-semibold text-[#146192]">View Submitted Student’s Assignment List</h2>
        </div>

        {/* Loading & Error */}
        {loading && <p className="text-gray-700 mb-4">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#146192] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Student ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Student Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Submission Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">View Uploaded Assignment </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submittedAssignments.length > 0 ? (
                submittedAssignments.map((student, index) => (
                  <tr key={student._id || index}>
                    <td className="px-4 py-2 text-sm text-gray-800">{student.rollNo || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{student.studentName || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {new Date(student.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">{student.status || 'Submitted'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
