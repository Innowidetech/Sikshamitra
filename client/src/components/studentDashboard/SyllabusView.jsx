import React, { useEffect } from "react";
import Header from "./layout/Header";
import { FaBookOpen } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchSyllabusView } from "../../redux/student/syllabusViewSlice";

function SyllabusView() {
  const dispatch = useDispatch();
  const { data: syllabusView, loading, error } = useSelector((state) => state.syllabusView);

  useEffect(() => {
    dispatch(fetchSyllabusView());
  }, [dispatch]);

  const handleDownloadPDF = async (url) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch PDF.');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `syllabus-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error downloading file:", error);
    }
  };

  // Helper to flatten and group syllabus
  const groupSyllabusByClass = (syllabus = []) => {
    const grouped = {};
    syllabus.forEach((item) => {
      if (!grouped[item.class]) grouped[item.class] = [];
      grouped[item.class].push(item);
    });
    return grouped;
  };

  const groupedSyllabus = groupSyllabusByClass(syllabusView?.syllabus);

  return (
    <>
    {/* Page Heading – Visible only on md (tablet) and above */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Curriculum</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Curriculum</span>{">"}{" "}
      <span className="font-medium text-[#146192]">Syllabus</span>
    </h1>
  </div>

  {/* Right: Header Icons (also visible in mobile) */}
  <Header />
</div>

{/* Header only for mobile and tablet (below md) */}
<div className="md:hidden">
  <Header />
</div>


{/* Section Heading */}
<div className="flex items-center gap-2 mb-4 mt-20 mx-4 md:mx-10">
  <FaBookOpen size={18} className="text-[#0B2C4D]" />
  <h2 className="text-base sm:text-lg font-semibold text-[#0B2C4D]">
    Class Syllabus Uploaded Information
  </h2>
</div>

   {/* --- Desktop/Tablet Table View --- */}
<div className="overflow-x-auto mx-4 md:mx-10 mb-10 hidden md:block">
  {loading ? (
    <p className="text-center py-4">Loading syllabus...</p>
  ) : error ? (
    <p className="text-center text-red-600 py-4">Error: {error}</p>
  ) : (
    <table className="min-w-full border border-gray-300 text-sm sm:text-base">
      <thead className="bg-[#f5f5f5]">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left w-[10%]">Class</th>
          <th className="border border-gray-300 px-4 py-2 text-left w-[15%]">Subject</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
          <th className="border border-gray-300 px-4 py-2 text-center w-[10%]">Action</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedSyllabus).map(([className, subjects]) =>
          subjects.map((item, idx) => (
            <tr key={`${className}-${idx}`} className="align-middle hover:bg-gray-50">
              {idx === 0 && (
                <td
                  rowSpan={subjects.length}
                  className="border border-gray-300 px-4 py-2 font-medium text-center"
                >
                  {className}
                </td>
              )}
              <td className="border border-gray-300 px-4 py-2">{item.subject}</td>
              <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap text-gray-800">
                {item.description}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleDownloadPDF(item.syllabus)}
                  className="text-[#146192] hover:text-blue-800 bg-[#1461921A] rounded-full w-9 h-9 flex items-center justify-center mx-auto"
                  title="Download"
                >
                  <FaDownload size={15} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )}
</div>

{/* --- Mobile Card View --- */}
<div className="block md:hidden px-4 mb-10">
  {loading ? (
    <p className="text-center py-4">Loading syllabus...</p>
  ) : error ? (
    <p className="text-center text-red-600 py-4">Error: {error}</p>
  ) : (
    Object.entries(groupedSyllabus).map(([className, subjects]) => (
      <div key={className} className="mb-6">
        <div className="bg-[#F1F8FC] px-4 py-2 rounded-t-md border border-gray-300 text-sm font-semibold">
          Class: <span className="font-bold">{className}</span>
        </div>

        {subjects.map((item, idx) => (
          <div key={idx} className="border border-gray-300 border-t-0 px-4 py-3 mb-3 text-sm rounded-b-md">
            <p className="mb-1">
              <span className="font-semibold">Subject:</span> {item.subject}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Description:</span>{" "}
              {item.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold">Download</span>
              <button
                onClick={() => handleDownloadPDF(item.syllabus)}
                className="text-[#146192] hover:text-blue-800 bg-[#1461921A] rounded-full w-8 h-8 flex items-center justify-center"
              >
                <FaDownload size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    ))
  )}
</div>

    </>
  );
}

export default SyllabusView;
