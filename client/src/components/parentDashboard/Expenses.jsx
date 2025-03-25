import React, { useState } from 'react';
import Header from './layout/Header';
import { FaMoneyBillWave, FaCheck, FaTimes, FaDownload, FaSpinner, FaCircle } from 'react-icons/fa'; // Importing necessary icons

function Expenses() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleTransactionIdChange = (e) => {
    setSelectedTransactionId(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Expenses</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Expenses</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Expenses Section with Icon on Left */}
      <div className="flex justify-between items-center mx-8 my-4">
        {/* Left side: Icon and Expenses Text */}
        <div className="flex items-center">
          <FaMoneyBillWave className="text-[#146192] mr-2" size={30} /> {/* Icon for Expenses */}
          <h1 className="text-xl font-semibold text-[#121313]">Expenses Details</h1>
        </div>

        {/* Right side: Dropdowns for Student, Transaction ID, and Date */}
        <div className="flex space-x-4">
          {/* Student Name Dropdown */}
          <div className="flex items-center text-sm text-[#146192]">
            <select
              id="student-dropdown"
              value={selectedStudent}
              onChange={handleStudentChange}
              className="px-4 py-2 rounded-lg w-36 border border-[#00000091]"
            >
              <option value="" className="text-sm">Student Name</option>
              <option value="1" className="text-sm">Student 1</option>
              <option value="2" className="text-sm">Student 2</option>
              <option value="3" className="text-sm">Student 3</option>
            </select>
          </div>

          {/* Transaction ID Dropdown */}
          <div className="flex items-center text-sm text-[#146192]">
            <select
              id="transaction-dropdown"
              value={selectedTransactionId}
              onChange={handleTransactionIdChange}
              className="px-4 py-2 rounded-lg w-36 border border-[#00000091] "
            >
              <option value="" className="text-sm">Transaction Id</option>
              <option value="T001" className="text-sm">T001</option>
              <option value="T002" className="text-sm">T002</option>
              <option value="T003" className="text-sm">T003</option>
            </select>
          </div>

          {/* Date Dropdown */}
          <div className="flex items-center text-sm text-[#146192]">
            <select
              id="date-dropdown"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-4 py-2 rounded-lg w-36 border border-[#00000091]"
            >
              <option value="" className="text-sm">Date</option>
              <option value="2023-03-01" className="text-sm">March 1, 2023</option>
              <option value="2023-03-02" className="text-sm">March 2, 2023</option>
              <option value="2023-03-03" className="text-sm">March 3, 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* New Section for Expense Details Table */}
      <div className="my-8 mx-8">
        {/* Table displaying Expense details */}
        <div className="overflow-x-auto bg-white p-4 rounded-lg ">
          <table className="w-full table-auto border border-gray-600 ">
            <thead className='bg-[#1461924F] text-sm text-[#146192]'>
              <tr>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4 ">Date</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4 ">Student Name</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Purpose</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Amount</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Payment Status</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Transaction ID</th>
                <th className="text-center font-semibold border-b border-black py-2 px-4">Receipt Download</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Row 1 - Verified Payment */}
              <tr>
                <td className="text-center border-black border-r py-2 px-4">March 1, 2023</td>
                <td className="text-center border-black border-r py-2 px-4">Student 1</td>
                <td className="text-center border-black border-r py-2 px-4">Books Purchase</td>
                <td className="text-center border-black border-r py-2 px-4">$50</td>
                <td className="text-center border-black border-r py-2 px-4">
                  <FaCheck className="mr-2 text-green-500" /> Verified
                </td>
                <td className="text-center border-black border-r py-2 px-4">T001</td>
                <td className="text-center border-black py-2 px-4">
                  <button className="flex items-center px-4 py-2 bg-[#146192] text-white rounded-lg">
                    <FaDownload className="mr-2" /> Download
                  </button>
                </td>
              </tr>

              {/* Example Row 2 - Pending Payment */}
              <tr>
                <td className="text-center border-black border-r py-2 px-4">March 2, 2023</td>
                <td className="text-center border-black border-r py-2 px-4">Student 2</td>
                <td className="text-center border-black border-r py-2 px-4">Tuition Fee</td>
                <td className="text-center border-black border-r py-2 px-4">$200</td>
                <td className="text-center border-black border-r py-2 px-4">
                  <FaSpinner className="mr-2 text-yellow-500 animate-spin" /> Pending
                </td>
                <td className="text-center border-black border-r py-2 px-4">T002</td>
                <td className="text-center border-black py-2 px-4">
                  <button className="flex items-center px-4 py-2 bg-[#146192] text-white rounded-lg">
                    <FaDownload className="mr-2" /> Download
                  </button>
                </td>
              </tr>

              {/* Example Row 3 - Verified Payment */}
              <tr>
                <td className="text-center border-black border-r py-2 px-4">March 3, 2023</td>
                <td className="text-center border-black border-r py-2 px-4">Student 3</td>
                <td className="text-center border-black border-r py-2 px-4">Library Fine</td>
                <td className="text-center border-black border-r py-2 px-4">$10</td>
                <td className="text-center border-black border-r py-2 px-4">
                  <FaCheck className="mr-2 text-green-500" /> Verified
                </td>
                <td className="text-center border-black border-r py-2 px-4">T003</td>
                <td className="text-center  py-2 px-4">
                  <button className="flex items-center px-4 py-2 bg-[#146192] text-white rounded-lg">
                    <FaDownload className="mr-2" /> Download
                  </button>
                </td>
              </tr>

              {/* Example Row 4 - Pending Payment */}
              <tr>
                <td className="text-center border-black border-r py-2 px-4">March 4, 2023</td>
                <td className="text-center border-black border-r py-2 px-4">Student 1</td>
                <td className="text-center border-black border-r py-2 px-4">Sports Fee</td>
                <td className="text-center border-black border-r py-2 px-4">$75</td>
                <td className="text-center border-black border-r py-2 px-4">
                  <FaSpinner className="mr-2 text-yellow-500 animate-spin" /> Pending
                </td>
                <td className="text-center border-black border-r py-2 px-4">T004</td>
                <td className="text-center  py-2 px-4">
                  <button className="flex items-center px-4 py-2 bg-[#146192] text-white rounded-lg">
                    <FaDownload className="mr-2" /> Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Expenses;
