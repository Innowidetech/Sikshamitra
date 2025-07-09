import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, clearExams } from '../../redux/student/examSlice';
import Header from './layout/Header';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


function Exams() {
  const dispatch = useDispatch();
  const { examList, loading, error } = useSelector((state) => state.exams);
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchExams());
    return () => dispatch(clearExams());
  }, [dispatch]);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

 const downloadPDF = () => {
  const selected = examList[selectedExamIndex];
  const doc = new jsPDF();

  // Title: School Logo
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('School Logo', 105, 20, { align: 'center' });

  // Class & Exam Type
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Class - ${selected?.class || 'N/A'}`, 105, 30, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 97, 146); // same blue as UI
  doc.text(selected?.examType || '', 105, 38, { align: 'center' });

  doc.setTextColor(0); // Reset color

  // Table headers and rows
  const tableColumn = ['Date', 'Subject', 'Timing', 'Syllabus'];
  const tableRows = selected?.exam.map((item) => [
    new Date(item.date).toLocaleDateString(),
    item.subject,
    item.duration,
    item.syllabus
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    styles: {
      fontSize: 11,
      cellPadding: 4,
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [20, 97, 146],
      textColor: 255,
      fontStyle: 'bold',
    },
    theme: 'grid',
  });

  doc.save('exam_timetable.pdf');
};

  return (
    <div className="px-4 md:px-12 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Exams</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Exams</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* --- Exam Cards --- */}
      <div className="mt-6 border border-[#0E66A4] rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Exams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examList.map((exam, index) => (
            <div
              key={index}
              onClick={() => setSelectedExamIndex(index)}
              className={`p-4 rounded-xl cursor-pointer shadow hover:shadow-lg transition ${
                selectedExamIndex === index ? 'border-2 border-[#0E66A4] bg-[#D8E7F5]' : 'bg-[#BF156C0D]'
              }`}
            >
              <p><strong>Exam Type:</strong> {exam.examType}</p>
              <p><strong>Date:</strong> {new Date(exam.fromDate).toLocaleDateString()} to {new Date(exam.toDate).toLocaleDateString()}</p>
              <p><strong>Subjects:</strong> {exam.numberOfSubjects}</p>
              <p><strong>Class:</strong> {exam.class} - {exam.section}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Timetable Section --- */}
      <div className="mt-10">
        <h2 className="text-center text-xl font-semibold">
          Class - {examList[selectedExamIndex]?.class || 'N/A'} {examList[selectedExamIndex]?.section}
          <br />
          <span className="text-[#146192]">
            {examList[selectedExamIndex]?.examType || 'Select Exam'}
          </span>
        </h2>

        <div className="mt-6 overflow-x-auto hidden md:block">
          <table className="min-w-full border text-center">
            <thead>
              <tr className="bg-[#146192] text-white">
                <th className="py-3 px-6 border">Date</th>
                <th className="py-3 px-6 border">Subject</th>
                <th className="py-3 px-6 border">Timing</th>
                <th className="py-3 px-6 border">Syllabus</th>
              </tr>
            </thead>
            <tbody>
              {examList[selectedExamIndex]?.exam.map((item, idx) => (
                <tr key={idx} className="border">
                  <td className="py-2 px-4 border">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{item.subject}</td>
                  <td className="py-2 px-4 border">{item.duration}</td>
                  <td className="py-2 px-4 border">{item.syllabus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4 mt-4">
          {examList[selectedExamIndex]?.exam.map((item, i) => (
            <div key={i} className="p-4 border rounded-lg shadow-sm">
              <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p><strong>Subject:</strong> {item.subject}</p>
              <p><strong>Timing:</strong> {item.duration}</p>
              <p><strong>Syllabus:</strong> {item.syllabus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center mt-8 relative">
        <button
          onClick={toggleDropdown}
          className="px-8 py-2 border-2 border-[#FF0303] text-[#FF0303] font-semibold rounded-2xl hover:bg-[#FF0303] hover:text-white transition"
        >
          Download
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-12 border-2 border-[#00000045] bg-white rounded-lg shadow-lg z-10">
            <ul className="list-none p-2">
              <li
                className="py-2 px-4 cursor-pointer hover:bg-[#D8E7F5] rounded-2xl text-[#285A87]"
                onClick={downloadPDF}
              >
                PDF
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exams;
