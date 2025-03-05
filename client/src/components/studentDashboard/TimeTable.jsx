import React, { useState } from 'react';
import Header from './layout/Header';
import '@fortawesome/fontawesome-free/css/all.min.css';

function TimeTable() {
  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle download action
  const handleDownload = (format) => {
    console.log(`Downloading as ${format}`);
    setIsDropdownOpen(false); // Close the dropdown after selecting an option
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Time Table</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Time Table</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Download Button Section */}
      <div className="flex justify-end mt-4 mx-8 pr-20">
        {/* Download Button with Icon */}
        <button
          onClick={toggleDropdown}
          className="bg-[#146192] text-white py-2 px-4 rounded-lg flex items-center"
        >
          {/* Font Awesome download icon */}
          <i className="fas fa-download mr-2"></i> {/* Icon for download */}
          Download
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute bg-white shadow-md mt-2 right-10 border border-[#146192] rounded-md">
            <ul className="text-center py-2">
              {/* PDF Option */}
              <li
                onClick={() => handleDownload('PDF')}
                className="cursor-pointer py-2 px-4 hover:bg-gray-200 text-[#146192] font-semibold"
              >
                PDF
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* New Section for Time Table */}
      <div className="flex justify-center mt-12 mx-8">
        <div className="w-[90%] p-6 rounded-xl shadow-xl  h-[800px]">
          {/* TimeTable Heading */}
          <h2 className="text-3xl font-bold text-center mb-6 text-[#146192]">CLASS TIMETABLE</h2>

          {/* Time Table Grid inside Square Box */}
          <div className="overflow-x-auto p-4 border-2 border-[#146192] rounded-lg">
            <table className="table-auto w-full text-center border-collapse">
              <thead>
                <tr className="text-black ">
                  <th className="border-b-2  border-[#146192] py-2 bg-[#1982C438]">Day</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                  <th className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">9:00-10:00</th>
                </tr>
              </thead>
              <tbody>
                {/* Rows for each period */}
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((period, index) => (
                  <tr key={index} className="bg-gray-50">
                    <td className="border-b  border-[#146192] py-2">{period}</td>
                    <td className="border-b border-l-2 border-[#146192] py-2">Math<br></br>(Teacher Name- Riya)</td>
                    <td className="border-b border-l-2 border-[#146192] py-2">Science<br></br>(Teacher Name- Riya)</td>
                    <td className="border-b border-l-2 border-[#146192] py-2">History<br></br>(Teacher Name- Riya)</td>
                    <td className="border-b border-l-2 border-[#146192] py-2 bg-[#FF0707DB] text-white">LUNCH BEAK</td>
                    <td className="border-b border-l-2 border-[#146192] py-2">Geography<br></br>(Teacher Name- Riya)</td>
                    <td className="border-b border-l-2 border-[#146192] py-2">Computer<br></br>(Teacher Name- Riya)</td>
                    <td className="border-b border-l-2 border-[#146192] py-2">English<br></br>(Teacher Name- Riya)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeTable;
