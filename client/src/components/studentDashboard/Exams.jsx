import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, clearExams } from '../../redux/student/examSlice';
import Header from './layout/Header';
import { jsPDF } from 'jspdf';

function Exams() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const dispatch = useDispatch();
  const { examList, loading, error } = useSelector((state) => state.exams);

  useEffect(() => {
    dispatch(fetchExams());
    return () => {
      dispatch(clearExams());
    };
  }, [dispatch]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Exam Details', 20, 20);

    doc.setFontSize(12);
    doc.text('DATE', 20, 40);
    doc.text('SUBJECT NAME', 60, 40);
    doc.text('TIMINGS', 120, 40);
    doc.text('SYLLABUS', 160, 40);

    let yOffset = 50;
    examList[0]?.exam.forEach((subject) => {
      doc.text(new Date(subject.date).toLocaleDateString(), 20, yOffset);
      doc.text(subject.subject, 60, yOffset);
      doc.text(examList[0]?.examDuration || 'N/A', 120, yOffset);
      doc.text(subject.syllabus, 160, yOffset);
      yOffset += 10;
    });

    doc.save('exam_details.pdf');
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Exams</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Exams</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      <div className="flex items-center space-x-4 px-4 md:px-20 mt-8">
        <h2 className="text-xl font-semibold text-[#202020]">Class -</h2>
        <div className="bg-[#D8E7F5] px-4 rounded-lg h-[40px] min-w-[100px] flex justify-center items-center">
          <span className="text-[#202020] font-semibold">6th</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 px-4 md:px-20 mt-4">
        <h2 className="text-xl font-semibold text-[#202020]">Exam Type -</h2>
        <div className="bg-[#D8E7F5] px-4 rounded-lg h-[40px] min-w-[150px] flex justify-center items-center">
          <span className="text-[#202020] font-semibold">{examList[0]?.examType || 'N/A'}</span>
        </div>
      </div>

      {/* Exam Timetable Section */}
      <div className="px-4 md:px-8 mt-8 py-5">
        {loading && <div>Loading exams...</div>}
        {error && <div>Error: {error}</div>}

        {/* TABLE VIEW (Desktop) */}
        <div className="hidden md:block">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="border border-[#146192] px-6 py-8 text-[#202020] text-center">DATE</th>
                <th className="border border-[#146192] px-6 py-8 text-[#202020] text-center">SUBJECT NAME</th>
                <th className="border border-[#146192] px-6 py-8 text-[#202020] text-center">TIMINGS</th>
                <th className="border border-[#146192] px-6 py-8 text-[#202020] text-center">SYLLABUS</th>
              </tr>
            </thead>
            <tbody>
              {examList && examList.length > 0 ? (
                examList[0].exam.map((subject, index) => (
                  <tr key={index}>
                    <td className="border border-[#146192] px-6 py-8 text-[#202020] text-center">
                      {new Date(subject.date).toLocaleDateString()}
                    </td>
                    <td className="border border-[#146192] px-6 py-8 text-[#202020] text-center">
                      {subject.subject}
                    </td>
                    <td className="border border-[#146192] px-6 py-8 text-[#202020] text-center">
                      {examList[0]?.examDuration || 'N/A'}
                    </td>
                    <td className="border border-[#146192] px-6 py-8 text-[#202020] text-center">
                      {subject.syllabus}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    No exam details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CARD VIEW (Mobile/Tablet) */}
        <div className="block md:hidden space-y-4">
          {examList && examList.length > 0 ? (
            examList[0].exam.map((subject, i) => (
              <div key={i} className="border border-[#146192] rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[#146192] w-[40%]">DATE</span>
                  <span className="text-right w-[58%] break-words">{new Date(subject.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[#146192] w-[40%]">SUBJECT</span>
                  <span className="text-right w-[58%] break-words">{subject.subject}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[#146192] w-[40%]">TIMINGS</span>
                  <span className="text-right w-[58%] break-words">{examList[0]?.examDuration || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[#146192] w-[40%]">SYLLABUS</span>
                  <span className="text-right w-[58%] break-words">{subject.syllabus}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">No exam details available</div>
          )}
        </div>
      </div>

      {/* Download Button with Dropdown */}
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
    </>
  );
}

export default Exams;
