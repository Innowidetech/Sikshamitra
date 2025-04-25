import React from 'react';
import Header from '../adminDashboard/layout/Header';
import { FaSearch } from 'react-icons/fa';

function AddStudentResult() {
  return (
    <>
      {/* Top Header Section */}
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Add Student Result Section */}
      <div className="mx-8 mt-8 md:ml-72">
        {/* Outer Box */}
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-[#146192] mb-4">Add Student Result</h2>

          {/* Class and Section Row */}
          <div className="flex flex-wrap gap-6 mb-4">
            {/* Class */}
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-gray-700 font-medium mb-1">Class</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-[#F5F5F5]"
                placeholder="Enter class"
              />
            </div>

            {/* Section */}
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-gray-700 font-medium mb-1">Section</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-[#F5F5F5]"
                placeholder="Enter section"
              />
            </div>
          </div>

          {/* Search Icon Button */}
          <div className="flex justify-start mb-4">
            <button className="bg-[#146192] text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-[#0e4a73] transition duration-300">
              <FaSearch />
              Search
            </button>
          </div>

          {/* Student Name Input */}
          <div className="flex flex-col max-w-[300px]">
            <label className="text-gray-700 font-medium mb-1">Student Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-[#F5F5F5]"
              placeholder="Enter student name"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddStudentResult;
