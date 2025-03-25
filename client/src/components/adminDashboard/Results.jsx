import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../../redux/adminResults';
import { Search, FileText, Award } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Results() {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.adminResults);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchResults());
  }, [dispatch]);

  useEffect(() => {
    if (error === 'Unauthorized access') {
      toast.error('Authentication required. Please log in again.');
      console.error('Authentication required');
    } else if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredResults = results?.result?.filter((result) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      result.student?.studentProfile?.registrationNumber?.toLowerCase().includes(search) ||
      result.student?.studentProfile?.fullname?.toLowerCase().includes(search) ||
      result.class?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[30px]">Results</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Results
            </span>
          </h1>
        </div>
      </div>

      <div className="mx-4 md:mx-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Registration Number, Name, or Class"
                className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-[#146192]"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop and Laptop View - Table */}
      <div className="mx-8 mb-6 hidden lg:block">
        <div className="bg-white rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y border-2">
              <thead className="" style={{ fontFamily: "Poppins" }}>
                <tr>
                <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Sno
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Student Name
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Registration Number
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Class
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Section
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Student Gender
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Exam Type
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Total Marks
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Percentage
                  </th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-[#146192] border-r">
                    Admit Card
                  </th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-[#146192] border-r">
                    Result Slip
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredResults?.map((result,index) => (
                  <tr key={result._id}>
                     <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {index + 1}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.student.studentProfile.fullname}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.student.studentProfile.registrationNumber}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.class}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.section}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.student.studentProfile.gender}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.exam.examType}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.total}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {result.totalPercentage}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r text-center">
                      <FileText className="inline-block text-[#146192] cursor-pointer hover:text-[#0d4c7a]" size={20} />
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r text-center">
                      <Award className="inline-block text-[#146192] cursor-pointer hover:text-[#0d4c7a]" size={20} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile and Tablet View - Cards */}
      <div className="mx-4 mb-6 lg:hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {filteredResults?.map((result) => (
              <div key={result._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-[#146192] font-medium">Student Name</div>
                  <div>{result.student.studentProfile.fullname}</div>

                  <div className="text-[#146192] font-medium">Registration Number</div>
                  <div>{result.student.studentProfile.registrationNumber}</div>

                  <div className="text-[#146192] font-medium">Class</div>
                  <div>{result.class}</div>

                  <div className="text-[#146192] font-medium">Section</div>
                  <div>{result.section}</div>

                  <div className="text-[#146192] font-medium">Student Gender</div>
                  <div>{result.student.studentProfile.gender}</div>

                  <div className="text-[#146192] font-medium">Exam Type</div>
                  <div>{result.exam.examType}</div>

                  <div className="text-[#146192] font-medium">Total Marks</div>
                  <div>{result.total}</div>

                  <div className="text-[#146192] font-medium">Percentage</div>
                  <div>{result.totalPercentage}</div>

                  <div className="text-[#146192] font-medium">Admit Card</div>
                  <div><button className="flex items-center gap-2 text-[#146192] hover:text-[#0d4c7a]">
                    <FileText size={20} />
                  </button></div>

                  <div className="text-[#146192] font-medium">Result Slip</div>
                  <div> <button className="flex items-center gap-2 text-[#146192] hover:text-[#0d4c7a]">
                    <Award size={20} />
                  </button></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Results;