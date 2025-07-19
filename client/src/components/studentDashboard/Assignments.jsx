import React, { useEffect, useState } from 'react';
import Header from './layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAssignments,
  submitAssignment,
  clearUploadStatus,
} from '../../redux/student/assignmentSlice';

function Assignments() {
  const dispatch = useDispatch();
  const { classAssignments, loading, error } = useSelector((state) => state.assignment.assignments);
  const uploadStatus = useSelector((state) => state.assignment.uploadStatus);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  useEffect(() => {
    if (uploadStatus) {
      const timeout = setTimeout(() => {
        dispatch(clearUploadStatus());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [uploadStatus, dispatch]);

  const handleUploadClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    document.getElementById(`fileInput-${assignmentId}`).click();
  };

  const handleFileChange = async (e, assignmentId) => {
    const file = e.target.files[0];
    if (file && assignmentId) {
      await dispatch(submitAssignment({ assignmentId, file }));
      e.target.value = '';
    }
  };

  const downloadFile = async (url) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file.');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `assignment-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      {/* Page Heading – Visible only on md (tablet) and above */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Assignment</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Assignment</span>
    </h1>
  </div>

  {/* Right: Header Icons (also visible in mobile) */}
  <Header />
</div>

{/* Header only for mobile and tablet (below md) */}
<div className="md:hidden">
  <Header />
</div>


      {/* Upload Status */}
      <div className="px-4 md:px-10">
        {uploadStatus === 'success' && (
          <p className="text-green-600 mt-4 font-medium text-center">Assignment uploaded successfully!</p>
        )}
        {uploadStatus === 'error' && (
          <p className="text-red-600 mt-4 font-medium text-center">Failed to upload assignment. Try again.</p>
        )}
        {uploadStatus === 'loading' && (
          <p className="text-blue-600 mt-4 font-medium text-center">Uploading...</p>
        )}
      </div>

      {/* Assignments Display */}
      <div className="px-4 md:px-10 mt-10 pb-10">
        {loading ? (
          <p>Loading assignments...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            {/* Desktop Table */}
            {/* Heading and Description for Assignment Table */}
<div className="mt-4 md:mt-16 text-left  px-4">
  <h2 className="text-xl md:text-2xl font-bold text-[#285A87]">Assignments</h2>
  <p className="text-gray-600 mt-2 text-sm md:text-base">
    View and manage your assignments assigned by teachers.
  </p>
</div>

            <div className="hidden md:block overflow-x-auto rounded-lg shadow-md mt-10">
              <table className="min-w-[900px] w-full border border-gray-300 text-sm md:text-base bg-white">
                <thead className="bg-[#f0f8ff] text-[#146192] font-semibold">
                  <tr>
                    <th className="border px-4 py-3 text-center">Assignment Name</th>
                    <th className="border px-4 py-3 text-center">Teacher Name</th>
                    <th className="border px-4 py-3 text-center">Class</th>
                    <th className="border px-4 py-3 text-center">Section</th>
                    <th className="border px-4 py-3 text-center">Subject</th>
                    <th className="border px-4 py-3 text-center">Chapter</th>
                    <th className="border px-4 py-3 text-center">Start Date</th>
                    <th className="border px-4 py-3 text-center">End Date</th>
                    <th className="border px-4 py-3 text-center">Action</th>
                    <th className="border px-4 py-3 text-center">Submit</th>
                  </tr>
                </thead>
                <tbody>
                  {classAssignments.map((assignment, index) => (
                    <tr key={assignment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f9fcff]'}>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.chapterName}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.teacherName}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.class}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.section}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.subject}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.chapter}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.startDate.slice(0, 10)}</td>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.endDate.slice(0, 10)}</td>
                     <td className="border px-4 py-3 text-center">
  <button
    onClick={() => downloadFile(assignment.assignment)}
    className="text-[#285A87] hover:text-[#1e4a6d] text-xl"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
    </svg>
  </button>
</td>

                      <td className="border px-4 py-3 text-center">
                        <button
                          onClick={() => handleUploadClick(assignment._id)}
                          className="bg-[#285A87] text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                        >
                          Submit
                        </button>
                        <input
                          type="file"
                          id={`fileInput-${assignment._id}`}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, assignment._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
        <div className="md:hidden flex flex-col gap-4 mt-6">
  {classAssignments.map((assignment) => (
    <div key={assignment._id} className="border rounded-lg shadow bg-white p-0 overflow-hidden">

      {/* Top Right Buttons (in bordered header box) */}
      <div className="flex justify-end items-center p-2 border-b">
        <div className="flex gap-2">
          {/* Download Icon Button */}
          <button
            onClick={() => downloadFile(assignment.assignment)}
            className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            title="Download"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#285A87]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
          </button>

          {/* Submit Button */}
          <button
            onClick={() => handleUploadClick(assignment._id)}
            className="bg-[#285A87] text-white px-4 py-[6px] rounded-md text-sm hover:bg-[#1e4a6d]"
          >
            Submit
          </button>

          <input
            type="file"
            id={`fileInput-${assignment._id}`}
            accept=".pdf,.doc,.docx,.jpg,.png"
            className="hidden"
            onChange={(e) => handleFileChange(e, assignment._id)}
          />
        </div>
      </div>

      {/* Two-Column Data Grid */}
 <div className="divide-y border rounded-lg overflow-hidden">
  {[
    ['Assignment Name', assignment.chapterName],
    ['Teacher Name', assignment.teacherName],
    ['Class', assignment.class],
    ['Section', assignment.section],
    ['Subject Name', assignment.subject],
    ['Chapter', assignment.chapter],
    ['Start Date', assignment.startDate.slice(0, 10)],
    ['End Date', assignment.endDate.slice(0, 10)],
  ].map(([label, value]) => (
    <div key={label} className="grid grid-cols-2 divide-x">
      <div className="px-4 py-2 text-[#146192] font-semibold bg-white">{label}</div>
      <div className="px-4 py-2 text-black bg-white">{value}</div>
    </div>
  ))}
</div>

</div>
  ))}
</div>

          </>
        )}
      </div>
    </>
  );
}

export default Assignments;
