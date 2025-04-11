import React from 'react';
import { useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB');
};

const ClassPlanPage = () => {
  const classPlans = useSelector((state) => state.curriculum.classPlans);
  const planArray = classPlans?.classPlan?.[0]?.plan || [];

  const downloadPdf = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(14);
    doc.text('Class Plan', 14, 20);

    const tableData = [];

    planArray.forEach((subjectPlan) => {
      const subject = subjectPlan.subject;
      subjectPlan.data.forEach((lesson, index) => {
        tableData.push([
          index === 0 ? subject : '',
          lesson.chapter,
          lesson.lessonName,
          formatDate(lesson.startDate),
          formatDate(lesson.endDate),
        ]);
      });
    });

    autoTable(doc, {
      head: [['Subject Name', 'Chapter', 'Lesson Name', 'Start Date', 'End Date']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [29, 81, 137] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save('class-plan.pdf');
  };

  return (
    <div className="p-4 md:p-6 font-sans text-sm text-gray-800 md:ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">📘 Class Plan</h2>
        <button
          onClick={downloadPdf}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#F7931E] text-white font-semibold rounded hover:bg-[#f17e00] transition"
        >
          <FaDownload />
          PDF
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse text-center">
          <thead className="bg-[#1D5189] text-white text-sm font-bold uppercase">
            <tr>
              <th className="border border-[#B4D2E7] px-4 py-2">Subject Name</th>
              <th className="border border-[#B4D2E7] px-4 py-2">Chapter</th>
              <th className="border border-[#B4D2E7] px-4 py-2">Lesson Name</th>
              <th className="border border-[#B4D2E7] px-4 py-2">Start Date</th>
              <th className="border border-[#B4D2E7] px-4 py-2">End Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {planArray.length > 0 ? (
              planArray.map((subjectPlan, idx) => (
                <React.Fragment key={idx}>
                  {subjectPlan?.data?.map((lesson, i) => (
                    <tr key={lesson._id}>
                      {i === 0 && (
                        <td
                          rowSpan={subjectPlan.data.length}
                          className="border border-[#B4D2E7] px-4 py-2 font-medium bg-[#E6F2FA] align-middle"
                        >
                          {subjectPlan.subject}
                        </td>
                      )}
                      <td className="border border-[#B4D2E7] px-4 py-2">{lesson.chapter}</td>
                      <td className="border border-[#B4D2E7] px-4 py-2">{lesson.lessonName}</td>
                      <td className="border border-[#B4D2E7] px-4 py-2">{formatDate(lesson.startDate)}</td>
                      <td className="border border-[#B4D2E7] px-4 py-2">{formatDate(lesson.endDate)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No class plan data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {planArray.length > 0 ? (
          planArray.map((subjectPlan, idx) => (
            <div key={idx}>
              {subjectPlan?.data?.map((lesson, i) => (
                <div key={lesson._id} className="border border-black bg-[#E6F2FA] rounded overflow-hidden">
                  {[
                    ['Subject Name', i === 0 ? subjectPlan.subject : ''],
                    ['Chapter', lesson.chapter],
                    ['Lesson Name', lesson.lessonName],
                    ['Start Date', formatDate(lesson.startDate)],
                    ['End Date', formatDate(lesson.endDate)],
                  ].map(([label, value], index) => (
                    <div key={index} className="grid grid-cols-2 border-b border-black">
                      <div className="bg-[#1D5189] text-white p-2 font-medium border-r border-black">
                        {label}
                      </div>
                      <div className="p-2 break-words">{value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No class plan data available.</p>
        )}
      </div>
    </div>
  );
};

export default ClassPlanPage;
