import React from 'react';
import Header from './layout/Header';
import { FaBookOpen } from 'react-icons/fa'; // Import the download icon
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'; // Up/Down arrow icon

function StudyMaterial() {
  return (
    <>
      {/* Full-Width Horizontal Line */}
      <hr className="border-[#146192] border-[1px] w-full my-4" />

      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Study Material</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Study Material</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex justify-between items-center mx-8 mt-8 p-4">
        {/* Left Side with Book Open Icon and Heading */}
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <FaBookOpen className="text-black text-4xl mr-4" />
            <h2 className="text-xl font-medium text-black">Teachers' Syllabus Uploaded Information</h2>
          </div>
        </div>

        {/* Right Side with View Syllabus and Arrow */}
        <div className="flex items-center cursor-pointer text-blue-600">
          <span className="mr-2 text-lg">View Syllabus</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Horizontal Line Below Content */}
      <hr className="border-[#CED8E5] border-[1px] w-full mt-8" />

      {/* Table Section with Smaller Table Size */}
      <table className="table-auto w-[90%] mx-auto mt-8  text-sm h-[400px]">
        <thead>
          <tr>
            {/* Teacher Column with Up/Down Arrow to the Right of Text */}
            <th className="  px-2 py-1 ">
              Teacher
              <div className="inline-flex items-center  ml-2">
                <AiOutlineArrowUp className="text-gray-600 cursor-pointer" />
                <AiOutlineArrowDown className="text-gray-600 cursor-pointer " />
              </div>
            </th>

            {/* Chapter Column */}
            <th className="  px-2 py-1 ">Chapter</th>

            {/* Class Column */}
            <th className=" px-2 py-1 ">Class</th>

            {/* Section Column */}
            <th className="  px-2 py-1 ">Section</th>

            {/* Subject Name Column with Up/Down Arrow to the Right of Text */}
            <th className="  px-2 py-1 ">
              Subject Name
              <div className="inline-flex items-center  ml-2">
                <AiOutlineArrowUp className="text-gray-600 cursor-pointer" />
                <AiOutlineArrowDown className="text-gray-600 cursor-pointer" />
              </div>
            </th>

            {/* Date Column with Up/Down Arrow to the Right of Text */}
            <th className="  px-2 py-1">
              Date
              <div className="inline-flex items-center  ml-2">
                <AiOutlineArrowUp className="text-gray-600 cursor-pointer" />
                <AiOutlineArrowDown className="text-gray-600 cursor-pointer" />
              </div>
            </th>

            {/* Time Column with Time Icon */}
            <th className="  px-2 py-1">
              Time
              <div className="inline-flex items-center s ml-2">
                <AiOutlineArrowUp className="text-gray-600 cursor-pointer" />
                <AiOutlineArrowDown className="text-gray-600 cursor-pointer" />
              </div>
              
            </th>

            {/* Download Column with Download Icon */}
            <th className="  px-2 py-1 ">
              Download
              <div className="inline-flex items-center  ml-2">
                <AiOutlineArrowUp className="text-gray-600 cursor-pointer" />
                <AiOutlineArrowDown className="text-gray-600 cursor-pointer" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Rows 1 to 8 */}
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 1 ? 'bg-[#F4F6F7]' : ''}  // Background color for rows 2, 4, 6, 8
            >
              <td className="  px-2 py-1 text-center">Dr. Riya Kapoor {rowIndex + 1}</td>
              <td className="  px-2 py-1 text-center"> {rowIndex + 1}</td>
              <td className="  px-2 py-1 text-center">{rowIndex + 1}</td>
              <td className="  px-2 py-1 text-center">A {rowIndex + 1}</td>
              <td className="  px-2 py-1 text-center">Math {rowIndex + 1}</td>
              <td className="  px-2 py-1 text-center">Jan 25, 2025 </td>
              <td className="  px-2 py-1 text-center">10:00 AM</td>
              <td className="px-2 py-1 text-center">
  <div className="inline-block px-4 py-1 text-[#61A249] bg-[#CBF0D3] rounded-sm cursor-pointer">
    Download
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default StudyMaterial;
