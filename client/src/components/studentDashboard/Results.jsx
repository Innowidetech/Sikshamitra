import React, { useState } from 'react';
import Header from './layout/Header';
import logo from "../../assets/img.png";
import avatar from "../../assets/avtar.jpg";

function Results() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDownloadOption = (format) => {
    console.log(`Download in ${format} format`);
    // Add your download functionality here for each format
    setIsDropdownOpen(false); // Close the dropdown after selecting an option
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* New Section with Centered Logo */}
      <div className="flex justify-center items-center mx-8 mt-8">
        <img src={logo} alt="Logo" className="w-[1300px] h-[180px]" />
      </div>

      {/* Square Box Below the Image */}
      <div className="flex justify-center items-center mt-8">
        <div className="w-[90%] p-6 rounded-3xl shadow-2xl h-[830px]">
          <h2 className="text-xl font-medium text-start mb-6">Exam Result Card</h2>
          
          {/* Rectangular Info Box Inside Square Box */}
          <div className="flex flex-col items-center pt-4 pb-4 shadow-lg">
            {/* Left Column with Labels */}
            <div className="flex w-full justify-between">
              <div className="w-[35%] px-4 rounded-lg">
                <div className="mb-4 flex items-center ">
                  <label className=" text-lg mr-2">Name:</label>
                  <div className="text-lg">John Doe</div> {/* Example Name */}
                </div>
                <div className="mb-4 flex items-center">
                  <label className="text-lg mr-2">Class:</label>
                  <div className="text-lg ">10th Grade</div> {/* Example Class */}
                </div>
                <div className="mb-4 flex items-center">
                  <label className="text-lg mr-2">Type:</label>
                  <div className="text-lg ">Regular</div> {/* Example Type */}
                </div>
              </div>

              {/* Vertical Line in the Center */}
              <div className="border-l-4 border-black h-32 mx-4"></div>

              {/* Right Column with Values and Avatar Image */}
              <div className="w-[45%] px-4 h-[50px] flex items-start justify-between ">
                <div className="flex flex-col">
                  <div className="mb-4 flex items-center">
                    <label className="text-lg mr-2">Roll:</label>
                    <div className="text-lg">123456</div> {/* Example Roll */}
                  </div>
                  <div className="mb-4 flex items-center">
                    <label className="text-lg mr-2">Batch:</label>
                    <div className="text-lg">2020-24</div> {/* Example Batch (Full Year) */}
                  </div>
                  <div className="mb-4 flex items-center">
                    <label className="text-lg mr-2">Section:</label>
                    <div className="text-lg">A</div> {/* Example Batch (Specific Section) */}
                  </div>
                </div>

                {/* Passport Image (Avatar) on the Right Side */}
                <img src={avatar} alt="Avatar" className="w-36 h-36 rounded-lg border-2 border-gray-300 " />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-4 rounded-xl shadow-md w-[90%] h-[470px] mt-12 ml-16 mr-16 border-2 border-black">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">Subject Code</th>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">Course Name</th>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">Marks Obtained</th>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">Total Marks</th>
                  <th className="text-center font-semibold border-b-2 border-black py-2 px-4">Grade</th>
                </tr>
              </thead>
              <tbody>
                {['CS304', 'CS305', 'CS306', 'CS307', 'ME306', 'CS312', 'CS313', 'CS314', 'N/A', ''].map((subjectCode, index) => (
                  <tr key={index}>
                    <td className="text-center border-b border-r border-black py-2 px-4">{subjectCode}</td>
                    <td className="text-center border-b border-r border-black py-2 px-4">
                      {index < 9
                        ? ['Maths', 'Science', 'Biology', 'Physics', 'Geography', 'History', 'Social', 'Computer', 'English'][index]
                        : 'Total Marks'}
                    </td>
                    <td className="text-center border-b border-r border-black py-2 px-4">
                      {index < 9
                        ? [90, 60, 50, 70, 80, 60, 40, 67, 85][index]
                        : 800}
                    </td>
                    <td className="text-center border-b border-r border-black py-2 px-4">
                      {index < 9
                        ? [100, 100, 100, 100, 100, 100, 100, 100, 100][index]
                        : 1000}
                    </td>
                    <td className="text-center border-b border-black py-2 px-4">
                      {index < 9
                        ? ['A', 'A+', 'B', 'C', 'A', 'A', 'A', 'A', 'A'][index]
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          </div>

          {/* Download Section */}
          <div className="flex justify-center items-center mt-8">
            <div className="text-center">
              <button
                onClick={toggleDropdown}
                className="px-6 py-3 bg-[#146192] text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none"
              >
                Download Result Card
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="mt-2 w-28 mx-auto bg-white shadow-lg rounded-lg border border-[#00000045]">
                  <ul>
                    <li
                      onClick={() => handleDownloadOption('PDF')}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-center text-[#285A87] border-b-2"
                    >
                      PDF
                    </li>
                    <li
                      onClick={() => handleDownloadOption('SVG')}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-center text-[#285A87] border-b-2"
                    >
                      SVG
                    </li>
                    <li
                      onClick={() => handleDownloadOption('JPG')}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-center text-[#285A87] border-b-2"
                    >
                      JPG
                    </li>
                    <li
                      onClick={() => handleDownloadOption('PNG')}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-center text-[#285A87]"
                    >
                      PNG
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

      
    </>
  );
}

export default Results;
