import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, clearExams } from '../../redux/student/examSlice'; // Import the fetchExams action
import Header from './layout/Header';
import { jsPDF } from 'jspdf'; // Import jsPDF

function Exams() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const dispatch = useDispatch();

  // Get exam data from Redux store
  const { examList, loading, error } = useSelector((state) => state.exams);

  // Fetch the exams data when the component mounts
  useEffect(() => {
    dispatch(fetchExams());

    // Cleanup on unmount
    return () => {
      dispatch(clearExams());
    };
  }, [dispatch]);

  // Function to generate and download the PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title to the PDF
    doc.setFontSize(18);
    doc.text('Exam Details', 20, 20);
    
    // Add table headers
    doc.setFontSize(12);
    doc.text('DATE', 20, 40);
    doc.text('SUBJECT NAME', 60, 40);
    doc.text('TIMINGS', 120, 40);
    doc.text('SYLLABUS', 160, 40);

    // Loop through exams and add rows to the PDF
    let yOffset = 50; // Starting y offset for the table rows
    examList[0]?.exam.forEach((subject) => {
      doc.text(new Date(subject.date).toLocaleDateString(), 20, yOffset);
      doc.text(subject.subject, 60, yOffset);
      doc.text(examList[0]?.examDuration || 'N/A', 120, yOffset);
      doc.text(subject.syllabus, 160, yOffset);
      yOffset += 10; // Move to next row
    });

    // Save the PDF
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

      {/* Class and Exam Type Section */}
      <div className="flex items-center space-x-4 px-20 mt-8">
        <h2 className="text-xl font-semibold text-[#202020]">Class -</h2>
        <div className="bg-[#D8E7F5] p-4 rounded-lg h-[40px] w-[130px] flex justify-center items-center">
          <span className="text-[#202020] font-semibold">6th</span> {/* Change class based on data */}
        </div>
      </div>

      <div className="flex items-center space-x-4 px-20 mt-4"> {/* Added margin-top to separate from class */}
        <h2 className="text-xl font-semibold text-[#202020]">Exam Type -</h2>
        <div className="bg-[#D8E7F5] p-4 rounded-lg h-[40px] w-[200px] flex justify-center items-center">
          <span className="text-[#202020] font-semibold">{examList[0]?.examType || 'N/A'}</span> {/* Exam Type */}
        </div>
      </div>

      {/* Exam Timetable Section */}
      <div className="px-8 mt-8 py-5">
        {/* Loading and Error States */}
        {loading && <div>Loading exams...</div>}
        {error && <div>Error: {error}</div>}

        {/* Table for displaying fetched exams */}
        <table className="table-auto border-collapse w-3/4 mx-auto">
          <thead>
            <tr>
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/12 text-center">DATE</th>
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">SUBJECT NAME</th>
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">TIMINGS</th>
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/4 text-center">SYLLABUS</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically render exam rows */}
            {examList && examList.length > 0 ? (
              examList[0].exam.map((subject, subjectIndex) => (
                <tr key={subjectIndex}>
                  <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/12 text-center">
                    {new Date(subject.date).toLocaleDateString()} {/* Format date */}
                  </td>
                  <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">
                    {subject.subject} {/* Subject Name */}
                  </td>
                  <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">
                    {examList[0]?.examDuration || 'N/A'} {/* Exam Timings */}
                  </td>
                  <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/4 text-center">
                    {subject.syllabus} {/* Syllabus */}
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

      {/* Download Button with Dropdown */}
      <div className="flex justify-center mt-8">
        <button
          onClick={toggleDropdown}
          className="px-8 py-2 border-2 border-[#FF0303] text-[#FF0303] font-semibold rounded-2xl hover:bg-[#FF0303] hover:text-white transition"
        >
          Download
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute mt-2 border-2 border-[#00000045] bg-white rounded-lg shadow-lg">
            <ul className="list-none p-2">
              <li
                className="py-2 px-4 cursor-pointer hover:bg-[#D8E7F5] rounded-2xl text-[#285A87]"
                onClick={downloadPDF} // Call downloadPDF on click
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
