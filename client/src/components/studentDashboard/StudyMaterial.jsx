import React, { useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchStudyMaterials } from "../../redux/student/studyMaterialSlice";
import Header from "./layout/Header";

function StudyMaterial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { studyMaterials, loading, error } = useSelector((state) => state.studyMaterial);
  const classMaterial = studyMaterials?.classMaterial || [];

  useEffect(() => {
    dispatch(fetchStudyMaterials());
  }, [dispatch]);

  // Function to handle file download
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank"; // Open in new tab if necessary
    link.download = fileName || "download"; // Provide a default filename if not specified

    // Trigger the download action
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Header */}
      <hr className="border-[#146192] border-[1px] w-full my-4" />
      <div className="flex justify-between items-center mx-4 md:mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Study Material</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {" > "}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Study Material</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Content Heading */}
      <div className="flex justify-between items-center mx-4 md:mx-8 mt-8 p-4">
        <div className="flex items-center">
          <FaBookOpen className="text-black text-4xl mr-4" />
          <h2 className="text-xl font-medium text-black">Teachers' Syllabus Uploaded Information</h2>
        </div>
        <div
          className="flex items-center cursor-pointer text-blue-600"
          onClick={() => navigate("/student/syllabus")}
        >
          <span className="mr-2 text-lg">View Syllabus</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <hr className="border-[#CED8E5] border-[1px] w-full mt-4" />

      {/* Conditional Rendering */}
      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-6">{error}</p>
      ) : (
        <>
          {/* Table View for Desktop */}
          <div className="hidden md:block overflow-x-auto px-8 mt-8">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Teacher Name ⇅</th>
                  <th className="px-4 py-2 text-left">Chapter</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-left">Subject Name ⇅</th>
                  <th className="px-4 py-2 text-left">Date ⇅</th>
                  <th className="px-4 py-2 text-left">Download ⇅</th>
                </tr>
              </thead>
              <tbody>
                {classMaterial.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No study materials found.</td>
                  </tr>
                ) : (
                  classMaterial.map((item, idx) => {
                    const date = new Date(item.createdAt);
                    return (
                      <tr key={item._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="px-4 py-2">{item.teacherName}</td>
                        <td className="px-4 py-2">{item.chapter?.padStart(2, "0")}</td>
                        <td className="px-4 py-2">{item.class?.padStart(2, "0")}</td>
                        <td className="px-4 py-2">{item.section}</td>
                        <td className="px-4 py-2">{item.subject}</td>
                        <td className="px-4 py-2">
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDownload(item.material, `${item.subject}_${item.chapter}_Material`)}
                            className="bg-[#CBF0D3] text-[#61A249] px-3 py-1 rounded-sm text-sm font-medium"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Card View for Mobile & Tablet */}
          <div className="block md:hidden px-4 mt-8 space-y-4">
            {classMaterial.length === 0 ? (
              <p className="text-center">No study materials found.</p>
            ) : (
              classMaterial.map((item, idx) => {
                const date = new Date(item.createdAt);
                return (
                  <div
                    key={item._id || idx}
                    className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
                  >
                    <div className="mb-2">
                      <strong>Teacher Name:</strong> {item.teacherName}
                    </div>
                    <div className="mb-2">
                      <strong>Chapter:</strong> {item.chapter?.padStart(2, "0")}
                    </div>
                    <div className="mb-2">
                      <strong>Class:</strong> {item.class?.padStart(2, "0")}
                    </div>
                    <div className="mb-2">
                      <strong>Section:</strong> {item.section}
                    </div>
                    <div className="mb-2">
                      <strong>Subject Name:</strong> {item.subject}
                    </div>
                    <div className="mb-2">
                      <strong>Date:</strong>{" "}
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => handleDownload(item.material, `${item.subject}_${item.chapter}_Material`)}
                        className="bg-[#CBF0D3] text-[#61A249] px-3 py-1 rounded-sm text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
}

export default StudyMaterial;
