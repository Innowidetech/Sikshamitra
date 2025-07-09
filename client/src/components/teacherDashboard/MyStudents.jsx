import React, { useEffect, useState } from 'react';
import Header from '../adminDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyStudents } from '../../redux/teacher/myStudentsSlice';

const MyStudents = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.myStudents);

  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    dispatch(fetchMyStudents()).then((res) => {
      // Optional: log for debugging
      console.log('fetchMyStudents result:', res);
      console.log('Redux students data:', data);
    });
  }, [dispatch]);

  // Safe flattening with optional chaining and fallback empty arrays
  const allStudents =
    data?.parents?.flatMap((parent) =>
      parent?.parentProfile?.parentOf?.map((child) => {
        const student = child?.studentProfile || {};
        const fees = parseFloat(student.fees) || 0;
        const additionalFees = parseFloat(student.additionalFees) || 0;

        return {
          id: child._id,
          fullname: student.fullname,
          registrationNumber: student.registrationNumber,
          gender: student.gender,
          dob: student.dob,
          address: student.address,
          totalFees: fees + additionalFees,
          parentName: `${parent.parentProfile?.fatherName || ''} / ${parent.parentProfile?.motherName || ''}`,
          parentPhone: `${parent.parentProfile?.fatherPhoneNumber || ''} / ${parent.parentProfile?.motherPhoneNumber || ''}`,
        };
      }) || []
    ) || [];

  const filteredStudents = allStudents.filter((student) =>
    student.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[35px]">My Students</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[180px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">My Students</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 min-h-[600px]">
        <h2 className="text-2xl font-semibold text-[#146192] mb-4">My Students Data</h2>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search student name & press Enter"
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192] w-full sm:w-1/2"
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              if (value.trim() === '') setSearchTerm('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchTerm(inputValue.trim());
              }
            }}
          />
          <button
            onClick={() => setSearchTerm(inputValue.trim())}
            className="bg-[#146192] text-white px-6 py-2 rounded-md w-full sm:w-auto"
          >
            SEARCH
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <>
            {/* Mobile/Tablet Card View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <p><strong>ID:</strong> {student.id}</p>
                    <p><strong>Name:</strong> {student.fullname}</p>
                    <p><strong>Reg. No:</strong> {student.registrationNumber}</p>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>DOB:</strong> {student.dob ? new Date(student.dob).toLocaleDateString() : ''}</p>
                    <p><strong>Total Fees:</strong> ₹{student.totalFees}</p>
                    <p><strong>Parent Name:</strong> {student.parentName}</p>
                    <p><strong>Parent Mobile:</strong> {student.parentPhone}</p>
                    <p><strong>Address:</strong> {student.address}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">No student data found.</p>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-auto">
              <table className="w-full text-left border border-gray-200">
                <thead className="bg-[#146192] text-white">
                  <tr>
                    <th className="p-2 border">Student ID</th>
                    <th className="p-2 border">Student Name</th>
                    <th className="p-2 border">Registration Number</th>
                    <th className="p-2 border">Gender</th>
                    <th className="p-2 border">DOB</th>
                    <th className="p-2 border">Total Fees</th>
                    <th className="p-2 border">Parent Name</th>
                    <th className="p-2 border">Parent Mobile</th>
                    <th className="p-2 border">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="p-2 border">{student.id}</td>
                        <td className="p-2 border capitalize">{student.fullname}</td>
                        <td className="p-2 border">{student.registrationNumber}</td>
                        <td className="p-2 border capitalize">{student.gender}</td>
                        <td className="p-2 border">{student.dob ? new Date(student.dob).toLocaleDateString() : ''}</td>
                        <td className="p-2 border">₹{student.totalFees}</td>
                        <td className="p-2 border">{student.parentName}</td>
                        <td className="p-2 border">{student.parentPhone}</td>
                        <td className="p-2 border">{student.address}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 text-center text-gray-500" colSpan="9">
                        No student data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyStudents;
