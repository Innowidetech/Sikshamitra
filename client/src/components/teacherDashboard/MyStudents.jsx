import React, { useEffect, useState } from 'react';
import Header from '../adminDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyStudents } from '../../redux/teacher/myStudentsSlice';

const MyStudents = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.students);

  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

  // Flatten student data from parents
  const allStudents = data?.parents?.flatMap((parent) =>
    parent.parentProfile.parentOf.map((child) => ({
      id: child._id,
      fullname: child.studentProfile.fullname,
      class: child.studentProfile.class,
      section: child.studentProfile.section,
      registrationNumber: child.studentProfile.registrationNumber,
      gender: child.studentProfile.gender,
      dob: child.studentProfile.dob,
      address: child.studentProfile.address,
      parentName: `${parent.parentProfile.fatherName || ''} / ${parent.parentProfile.motherName || ''}`,
      parentPhone: `${parent.parentProfile.fatherPhoneNumber || ''} / ${parent.parentProfile.motherPhoneNumber || ''}`,
    }))
  ) || [];

  // Filtered students by search term
  const filteredStudents = allStudents.filter((student) =>
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase())
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
        <input
          type="text"
          placeholder="Search student name & press Enter"
          className="border border-gray-300 px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192]"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            if (value.trim() === '') {
              setSearchTerm('');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchTerm(inputValue.trim());
            }
          }}
        />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-auto">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-[#146192] text-white">
                <tr>
                  <th className="p-2 border">Student ID</th>
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Registration Number</th>
                  <th className="p-2 border">Gender</th>
                  <th className="p-2 border">DOB</th>
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
                      <td className="p-2 border">{student.class}</td>
                      <td className="p-2 border">{student.section}</td>
                      <td className="p-2 border">{student.registrationNumber}</td>
                      <td className="p-2 border capitalize">{student.gender}</td>
                      <td className="p-2 border">
                        {student.dob ? new Date(student.dob).toLocaleDateString() : ''}
                      </td>
                      <td className="p-2 border">{student.parentName}</td>
                      <td className="p-2 border">{student.parentPhone}</td>
                      <td className="p-2 border capitalize">{student.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan="10">No student data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;
