import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllResults, fetchResultById } from '../../redux/student/resultSlice';
import Header from './layout/Header';

function Results() {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { selectedResult, allResults, loading, error, banner } = useSelector((state) => state.results);

  useEffect(() => {
    dispatch(fetchAllResults()).then((res) => {
      if (res.payload?.results?.length > 0) {
        dispatch(fetchResultById(res.payload.results[0]._id));
      }
    });
  }, [dispatch]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleDownloadOption = (format) => {
    console.log(`Download in ${format} format`);
    setIsDropdownOpen(false);
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500 text-xl">Error: {error}</div>;
  if (!selectedResult) return <div className="text-center mt-10 text-gray-600 text-xl">No result data found.</div>;

  const { student, result, exam, class: studentClass, section, total, totalPercentage } = selectedResult;
  const studentProfile = student?.studentProfile || {};

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mx-4 md:mx-6 xl:mx-8">
        <div className="mb-4 xl:mb-0">
          <h1 className="text-xl md:text-2xl xl:text-[38px] font-light text-black">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[100px] md:w-[120px] xl:w-[150px]" />
          <h1 className="mt-2 text-base md:text-lg">
            <span>Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex justify-center items-center mx-4 md:mx-6 xl:mx-8 mt-6 md:mt-8">
        <img src={banner} alt="Banner" className="w-full max-w-[1300px] h-[120px] md:h-[160px] xl:h-[180px] rounded-lg object-cover" />
      </div>

      <div className="flex justify-center items-center mt-6 md:mt-8">
        <div className="w-[95%] md:w-[90%] p-4 md:p-6 rounded-3xl shadow-2xl h-fit">
          <h2 className="text-lg md:text-xl font-medium text-start mb-6">Exam Result Card</h2>

          <div className="flex flex-col items-center pt-4 pb-4 shadow-lg">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-6">
              <div className="w-full lg:w-[45%] px-2 md:px-4">
                <div className="mb-4 flex items-center">
                  <label className="text-base md:text-lg mr-2">Name:</label>
                  <div className="text-base md:text-lg">{studentProfile.fullname || 'N/A'}</div>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="text-base md:text-lg mr-2">Class:</label>
                  <div className="text-base md:text-lg">{studentProfile.class || 'N/A'}</div>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="text-base md:text-lg mr-2">Exam:</label>
                  <div className="text-base md:text-lg">{exam?.examType || 'N/A'}</div>
                </div>
              </div>

              <div className="hidden lg:block border-l-4 border-black h-32 mx-4"></div>

              <div className="w-full lg:w-[45%] px-2 md:px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="mb-4 flex items-center">
                    <label className="text-base md:text-lg mr-2">Roll:</label>
                    <div className="text-base md:text-lg">{studentProfile.rollNumber || 'N/A'}</div>
                  </div>
                  <div className="mb-4 flex items-center">
                    <label className="text-base md:text-lg mr-2">Section:</label>
                    <div className="text-base md:text-lg">{studentProfile.section || section || 'N/A'}</div>
                  </div>
                  <div className="mb-4 flex items-center">
                    <label className="text-base md:text-lg mr-2">Gender:</label>
                    <div className="text-base md:text-lg">{studentProfile.gender || 'N/A'}</div>
                  </div>
                </div>
                <img src={studentProfile.photo} alt="Avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-gray-300 object-cover" />
              </div>
            </div>
          </div>

          <div className="p-2 md:p-4 rounded-xl shadow-md w-full overflow-x-auto mt-10 border-2 border-black">
            <table className="w-[600px] md:w-full table-auto border-collapse">
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
                {result?.map((subject, index) => (
                  <tr key={index}>
                    <td className="text-center border-b border-r border-black py-2 px-4">{subject.subjectCode || 'N/A'}</td>
                    <td className="text-center border-b border-r border-black py-2 px-4">{subject.subject || 'N/A'}</td>
                    <td className="text-center border-b border-r border-black py-2 px-4">{subject.marksObtained}</td>
                    <td className="text-center border-b border-r border-black py-2 px-4">{subject.totalMarks}</td>
                    <td className="text-center border-b border-black py-2 px-4">{subject.grade || 'N/A'}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-right font-bold border-t border-black py-2 px-4">Total</td>
                  <td className="text-center font-bold border-t border-black py-2 px-4" colSpan="2">{total}</td>
                  <td className="text-center font-bold border-t border-black py-2 px-4">{totalPercentage}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-6 md:mt-8 mb-8">
        <div className="text-center">
          <button
            onClick={toggleDropdown}
            className="px-4 md:px-6 py-2 md:py-3 bg-[#146192] text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none"
          >
            Download Result Card
          </button>
          {isDropdownOpen && (
            <div className="mt-2 w-28 mx-auto bg-white shadow-lg rounded-lg border border-[#00000045]">
              <ul>
                {['PDF', 'SVG', 'JPG', 'PNG'].map(format => (
                  <li
                    key={format}
                    onClick={() => handleDownloadOption(format)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-center text-[#285A87] border-b-2 last:border-b-0"
                  >
                    {format}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Results;
