import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import { FaRegCalendarAlt } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassPlan } from "../../redux/student/classPlanSlice";

const ClassPlanView = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

  const { data: classPlanData = [], loading, error } = useSelector(
    (state) => state.classPlan
  );

  useEffect(() => {
    dispatch(fetchClassPlan())
      .unwrap()
      .then((res) => console.log("Fetched Class Plan:", res))
      .catch((err) => console.error("Fetch Error:", err));
  }, [dispatch]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Class Plan", 14, 20);

    if (classPlanData?.class && classPlanData?.section) {
      doc.setFontSize(12);
      doc.text(
        `Class: ${classPlanData.class} | Section: ${classPlanData.section}`,
        14,
        28
      );
    }

    const tableRows = [];

    classPlanData.forEach((subject) => {
      subject.data.forEach((lesson, index) => {
        tableRows.push([
          index === 0 ? subject.subject : "",
          lesson.chapter,
          lesson.lessonName,
          new Date(lesson.startDate).toLocaleDateString(),
          new Date(lesson.endDate).toLocaleDateString(),
        ]);
      });
    });

    autoTable(doc, {
      startY: 35,
      head: [["Subject", "Chapter", "Lesson Name", "Start Date", "End Date"]],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [20, 97, 146],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [230, 247, 255],
      },
    });

    doc.save("class_plan.pdf");
  };

  return (
    <>
      {/* Header */}
        {/* Page Heading – Visible only on md (tablet) and above */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Curriculum</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Curriculum</span>{">"}{" "}
      <span className="font-medium text-[#146192]">ClassPlan</span>
    </h1>
  </div>

  {/* Right: Header Icons (also visible in mobile) */}
  <Header />
</div>

{/* Header only for mobile and tablet (below md) */}
<div className="md:hidden">
  <Header />
</div>

      {/* Title & Download */}
      <div className="flex justify-between items-start flex-col md:flex-row mx-4 md:mx-10 mt-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <FaRegCalendarAlt size={28} className="text-black shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
              Class Plan
            </h2>
          </div>

          {/* <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-[#202020]">Class -</h2>
            <div className="bg-[#D8E7F5] px-4 py-1 rounded-lg h-[40px] w-[130px] flex justify-center items-center">
              <span className="text-[#202020] font-semibold">
                {classPlanData?.class} {classPlanData?.section}
              </span>
            </div>
          </div> */}
        </div>

        <div className="relative inline-block mt-4 md:mt-0">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="bg-[#FF9F1C] hover:bg-[#d1dee7] text-white font-medium px-4 py-2 rounded-md shadow"
          >
            Download
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-[#FF9F1C] rounded-md shadow-lg z-10">
              <button
                onClick={generatePDF}
                className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100 text-[#FF9F1C]"
              >
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Display */}
      {loading ? (
        <p className="text-center py-6">Loading class plan...</p>
      ) : error ? (
        <p className="text-center text-red-600 py-6">Error: {error}</p>
      ) : classPlanData.length === 0 ? (
        <p className="text-center py-6">No class plan data available.</p>
      ) : (
        <>
          {/* 📱 Mobile & Tablet Cards */}
          <div className="block md:hidden px-4 mt-6 space-y-4">
            {classPlanData.map((subject) =>
              subject.data.map((lesson) => (
                <div
                  key={`${subject.subject}-${lesson._id}`}
                  className="grid grid-cols-2 bg-[#E0F0FA] rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="bg-[#146192] text-white text-[10px] sm:text-sm font-bold p-3 flex flex-col gap-4 uppercase">
                    <span>Subject Name</span>
                    <span>Chapter</span>
                    <span>Lesson Name</span>
                    <span>Start Date</span>
                    <span>End Date</span>
                  </div>
                  <div className="text-center text-sm sm:text-base text-[#202020] font-medium p-3 flex flex-col gap-4">
                    <span>{subject.subject}</span>
                    <span>{lesson.chapter}</span>
                    <span>{lesson.lessonName}</span>
                    <span>{new Date(lesson.startDate).toLocaleDateString()}</span>
                    <span>{new Date(lesson.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 💻 Desktop Table */}
          <div className="hidden md:block overflow-x-auto px-10 mt-6 mb-10">
            <table className="min-w-full text-xs sm:text-sm md:text-base border border-gray-300">
              <thead className="bg-[#146192E8] text-white">
                <tr>
                  <th className="border border-[#146192] px-4 py-2">SUBJECT</th>
                  <th className="border border-[#146192] px-4 py-2">CHAPTER</th>
                  <th className="border border-[#146192] px-4 py-2">LESSON NAME</th>
                  <th className="border border-[#146192] px-4 py-2">START DATE</th>
                  <th className="border border-[#146192] px-4 py-2">END DATE</th>
                </tr>
              </thead>
             <tbody>
  {classPlanData.map((subject, subjectIdx) =>
    subject.data.map((lesson, lessonIdx) => (
      <tr
        key={`${subject.subject}-${lesson._id}`}
        className="hover:bg-gray-100"
        style={{ backgroundColor: "#1982C429" }}
      >
        {lessonIdx === 0 && (
          <td
            className="border border-[#146192] px-4 py-2 text-center align-middle"
            rowSpan={subject.data.length}
            style={{ verticalAlign: "middle" }}
          >
            {subject.subject}
          </td>
        )}
        <td className="border border-[#146192] px-4 py-2 text-center">
          {lesson.chapter}
        </td>
        <td className="border border-[#146192] px-4 py-2">
          {lesson.lessonName}
        </td>
        <td className="border border-[#146192] px-4 py-2 text-center">
          {new Date(lesson.startDate).toLocaleDateString("en-GB")}
        </td>
        <td className="border border-[#146192] px-4 py-2 text-center">
          {new Date(lesson.endDate).toLocaleDateString("en-GB")}
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        </>
      )}
    </>
  );
};

export default ClassPlanView;
