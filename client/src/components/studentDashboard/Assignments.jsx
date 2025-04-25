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
      {/* Header & Breadcrumb */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center px-4 md:px-8 mt-[100px] gap-4">
        <div>
          <h1 className="text-xl md:text-2xl xl:text-[38px] font-light text-black">Assignments</h1>
          <hr className="mt-2 border-[#146192] border-[1px] md:w-[150px]" />
          <p className="mt-2 text-sm md:text-base xl:text-[17px]">
            <span>Home</span> {'>'}
            <span className="font-medium text-[#146192] ml-1">Assignments</span>
          </p>
        </div>
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
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
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
                    <th className="border px-4 py-3 text-center">Download</th>
                    <th className="border px-4 py-3 text-center">Submit</th>
                  </tr>
                </thead>
                <tbody>
                  {classAssignments.map((assignment, index) => (
                    <tr key={assignment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f9fcff]'}>
                      <td className="border px-4 py-3 text-center text-[#146192]">{assignment.assignmentName}</td>
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
                          className="bg-[#285A87] text-white px-3 py-1 rounded-md text-sm hover:bg-[#1e4a6d]"
                        >
                          Download
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
            <div className="md:hidden flex flex-col gap-6 mt-6">
              {classAssignments.map((assignment) => (
                <div key={assignment._id} className="border rounded-lg shadow-md bg-white p-4">
                  {[['Assignment Name', assignment.assignmentName],
                  ['Teacher Name', assignment.teacherName],
                  ['Class', assignment.class],
                  ['Section', assignment.section],
                  ['Subject Name', assignment.subject],
                  ['Chapter Name', assignment.chapter],
                  ['Start Date', assignment.startDate.slice(0, 10)],
                  ['End Date', assignment.endDate.slice(0, 10)],
                  ].map(([label, value]) => (
                    <div className="flex justify-between py-1 border-b last:border-none" key={label}>
                      <span className="text-[#146192] font-semibold">{label}</span>
                      <span className="text-right">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-2 mt-4">
                    <button
                      onClick={() => downloadFile(assignment.assignment)}
                      className="flex-1 bg-[#285A87] text-white px-3 py-2 rounded-md text-sm hover:bg-[#1e4a6d]"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleUploadClick(assignment._id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700"
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
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Assignments;
