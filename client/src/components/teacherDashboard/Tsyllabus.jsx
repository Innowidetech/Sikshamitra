
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherSyllabus } from '../../redux/teacher/tcurriculumSlice';
import { FaBookOpen } from 'react-icons/fa';
import Header from './layout/Header';

const Tsyllabus = () => {
  const dispatch = useDispatch();
  const { syllabus, loading, errorMessage } = useSelector((state) => state.tcurriculum);

  useEffect(() => {
    dispatch(fetchTeacherSyllabus());
  }, [dispatch]);

  const syllabusList = syllabus?.syllabus || [];

  return (
    <div className="font-sans text-sm text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mx-6 md:mx-10  md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Curriculum</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Curriculum</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6 md:ml-72 mt-10">
          <FaBookOpen size={24} className="text-[#146192]" />
          <h2 className="text-xl font-semibold text-black">Teacher Syllabus</h2>
        </div>

        {loading ? (
          <p className="text-gray-600 text-lg">Loading syllabus...</p>
        ) : errorMessage ? (
          <p className="text-red-600 text-lg">Error: {errorMessage}</p>
        ) : syllabusList.length === 0 ? (
          <p className="text-gray-600 text-lg">No syllabus available.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block md:ml-72 overflow-x-auto">
              <table className="min-w-full border border-black text-sm bg-[#FFF4E9]">
                <thead>
                  <tr>
                    <th className="border border-black px-4 py-2 text-left">Class</th>
                    <th className="border border-black px-4 py-2 text-left">Section</th>
                    <th className="border border-black px-4 py-2 text-left">Syllabus File</th>
                  </tr>
                </thead>
                <tbody>
                  {syllabusList.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-4 py-2">{item.class}</td>
                      <td className="border border-black px-4 py-2">{item.section}</td>
                      <td className="border border-black px-4 py-2">
                        <a
                          href={item.syllabus}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View / Download PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="space-y-6 md:hidden">
              {syllabusList.map((item, index) => (
                <div
                  key={index}
                  className="border border-black bg-[#FFF4E9] rounded shadow-sm overflow-hidden"
                >
                  {[
                    ['Class', item.class],
                    ['Section', item.section],
                    [
                      'Syllabus File',
                      <a
                        key={index}
                        href={item.syllabus}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View / Download PDF
                      </a>,
                    ],
                  ].map(([label, value], idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-2 border-b border-black"
                    >
                      <div className="bg-[#146192] text-white p-2 font-medium border-r border-black whitespace-nowrap">
                        {label}
                      </div>
                      <div className="p-2 break-words min-w-0 w-full">{value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tsyllabus;