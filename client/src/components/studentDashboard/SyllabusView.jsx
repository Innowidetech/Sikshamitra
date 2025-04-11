import React, { useEffect } from "react";
import Header from "./layout/Header";
import { FaBookOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchSyllabusView } from "../../redux/student/syllabusViewSlice";

function SyllabusView() {
  const dispatch = useDispatch();

  // Redux state
  const { data: syllabusView, loading, error } = useSelector((state) => state.syllabusView);

  useEffect(() => {
    dispatch(fetchSyllabusView());
  }, [dispatch]);

  const handleDownloadPDF = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 mt-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">Syllabus</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-2 text-base sm:text-lg">
            <span>Home</span> {">"} <span className="font-medium text-[#146192]">View Syllabus</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Heading */}
      <div className="my-6 mx-4 md:mx-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <FaBookOpen size={28} className="text-[#146192] shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
            Class Syllabus Uploaded Information
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mx-4 md:mx-10 mb-6">
        {loading ? (
          <p className="text-center py-4">Loading syllabus...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-4">Error: {error}</p>
        ) : (
          <table className="min-w-full border border-gray-300 text-sm sm:text-base">
            <thead className="bg-[#FF9F1C1A] text-black">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Syllabus File</th>
              </tr>
            </thead>
            <tbody>
              {syllabusView?.syllabus?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100" style={{ backgroundColor: "#FF9F1C1A" }}>
                  <td className="border border-gray-300 px-4 py-2">{item.class}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.section}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDownloadPDF(item.syllabus)}
                      className="text-blue-600 hover:underline"
                    >
                      View/Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default SyllabusView;
