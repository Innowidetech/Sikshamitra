import React from 'react';
import Header from '../adminDashboard/layout/Header';

function Results({ handleTabChange }) {
  return (
    <>
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

      {/* Right Section */}
      <div className="flex flex-col items-end mx-8 mt-6 md:ml-72">
        <button
          className="bg-[#146192] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#0e4a73] transition duration-300 mb-4"
          onClick={() => handleTabChange('addstudentresult')} // 👈 open the new tab
        >
          ADD STUDENT RESULT
        </button>

        {/* Filter Row */}
       <div className="flex items-center gap-4 mb-6">
  {/* Rectangular Box with Centered Content */}
  <div className="bg-[#DDDEEE80] border border-gray-300 rounded-lg shadow-md px-6 py-4 flex justify-center items-center gap-3 min-w-[250px]">
    <label className="text-gray-700 font-medium whitespace-nowrap">Exam Type:</label>
    <select className="border border-gray-300 rounded-lg px-4 py-2">
      <option value="">Select Exam</option>
      <option value="midterm">Mid Term</option>
      <option value="final">Final</option>
      <option value="unit">Unit Test</option>
    </select>
  </div>

  {/* Search Button */}
  <button className="bg-[#146192] text-white px-5 py-2 rounded-lg hover:bg-[#0e4a73] transition duration-300">
    Search
  </button>
</div>


        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-[#1982C424] text-[#146192]">
              <tr>
                <th className="py-2 px-4 border">Student ID</th>
                <th className="py-2 px-4 border">Student Name</th>
                <th className="py-2 px-4 border">Exam Type</th>
                <th className="py-2 px-4 border">Marks</th>
                <th className="py-2 px-4 border">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="text-center hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 border">Student {i + 1}</td>
                  <td className="py-2 px-4 border">10</td>
                  <td className="py-2 px-4 border">Math</td>
                  <td className="py-2 px-4 border">85</td>
                  <td className="py-2 px-4 border">A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Results;
