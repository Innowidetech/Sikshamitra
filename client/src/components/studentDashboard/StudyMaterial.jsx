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
       {/* Page Heading – Visible only on md (tablet) and above */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Study Material</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Study Materisl</span>
    </h1>
  </div>

  {/* Right: Header Icons (also visible in mobile) */}
  <Header />
</div>

{/* Header only for mobile and tablet (below md) */}
<div className="md:hidden">
  <Header />
</div>

      {/* Content Heading */}
      <div className="flex justify-between items-center mx-4 md:mx-8 mt-20 p-4">
        <div className="flex items-center">
          {/* <FaBookOpen className="text-black text-4xl mr-4" /> */}
          <h2 className="text-xl font-medium text-[#146192]">Updated Study Material</h2>
        </div>
        <div
          className="flex items-center cursor-pointer text-blue-600"
          onClick={() => navigate("/student/syllabus")}
        >
          {/* <span className="mr-2 text-lg">View Syllabus</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg> */}
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
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Teacher Name ⇅</th>
                  <th className="px-4 py-2 text-left">Chapter</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-left">Subject Name ⇅</th>
                  <th className="px-4 py-2 text-left">Date ⇅</th>
                   <th className="px-4 py-2 text-left">Time ⇅</th>
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
                {date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
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
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return (
        <div
          key={item._id || idx}
          className="border border-gray-300 rounded-md shadow-md bg-white"
        >
          <div className="grid grid-cols-2 divide-x divide-gray-300">
            {/* Labels */}
            <div className="py-4 px-3 flex flex-col gap-3 text-[#146192] font-semibold">
              <div>Teacher Name ⬍</div>
              <div>Chapter </div>
              <div>Class </div>
              <div>Section </div>
              <div>Subject Name ⬍</div>
              <div>Date ⬍</div>
              <div>Time ⬍</div>
              <div>Download ⬍</div>
            </div>

            {/* Values */}
            <div className="py-4 px-3 flex flex-col gap-3 text-black text-[15px]">
              <div>{item.teacherName}</div>
              <div>{item.chapter?.padStart(2, "0")}</div>
              <div>{item.class?.padStart(2, "0")}</div>
              <div>{item.section}</div>
              <div>{item.subject}</div>
              <div>{formattedDate}</div>
              <div>{formattedTime}</div>
              <div>
                <button
                  onClick={() =>
                    handleDownload(
                      item.material,
                      `${item.subject}_${item.chapter}_Material`
                    )
                  }
                  className="bg-[#CBF0D3] text-[#61A249] px-3 py-1 rounded-sm text-sm font-medium"
                >
                  Download
                </button>
              </div>
            </div>
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
