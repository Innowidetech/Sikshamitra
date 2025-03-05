import React, { useState } from 'react';
import Header from './layout/Header';

function Exams() {
  // State to handle dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
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

      {/* Class Selection Section */}
      <div className="flex items-center space-x-4 px-20 mt-8">
        <h2 className="text-xl font-semibold text-[#202020]">Class -</h2>
        <div className="bg-[#D8E7F5] p-4 rounded-lg h-[40px] w-[130px]">
          <button className="px-4 text-[#202020] font-semibold rounded-lg justify-center items-center">
            10th
          </button>
        </div>
      </div>

      {/* Exam Timetable Section */}
      <div className="px-8 mt-8 py-5">
        <table className="table-auto border-collapse w-3/4 mx-auto">
          <thead>
            <tr>
              {/* Even smaller width for Date Column */}
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/12 text-center">DATE</th>

              {/* Even smaller width for Subject Column */}
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">SUBJECT NAME</th>

              {/* Even smaller width for Exam Time Column */}
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">TIMINGS</th>

              {/* Keeping Room column width same */}
              <th className="border border-[#146192] px-6 py-8 text-[#202020] w-1/4 text-center">SYLLABUS</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows for exam timetable */}
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {/* Even smaller width for Date Column */}
                <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/12 text-center">2025-04-0{rowIndex + 1}</td>

                {/* Even smaller width for Subject Column */}
                <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">Subject {rowIndex + 1}</td>

                {/* Even smaller width for Exam Time Column */}
                <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/6 text-center">10:00am to 1:00pm</td>

                {/* Room column with same width */}
                <td className="border border-[#146192] px-6 py-8 text-[#202020] w-1/4 text-center">Chapter 01 to 06 </td>
              </tr>
            ))}
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
                onClick={() => setIsDropdownOpen(false)} // Close dropdown when clicked
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
