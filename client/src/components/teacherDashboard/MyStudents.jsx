import React, { useEffect } from 'react';
import Header from '../adminDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyStudents } from '../../redux/teacher/myStudentsSlice';

const MyStudents = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.students);  // Fetch state

  useEffect(() => {
    dispatch(fetchMyStudents());  // Fetch students when component mounts
  }, [dispatch]);

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
                  <th className="p-2 border">Registration Number</th>
                  <th className="p-2 border">Gender</th>
                  <th className="p-2 border">DOB</th>
                  <th className="p-2 border">Parent Name</th>
                  <th className="p-2 border">Parent Mobile</th>
                  <th className="p-2 border">Address</th>
                </tr>
              </thead>
              <tbody>
                {data?.parents?.length > 0 ? (
                  data.parents.map((parent, i) =>
                    parent.parentProfile.parentOf.map((child, j) => {
                      const student = child.studentProfile;
                      return (
                        <tr key={`${i}-${j}`} className="even:bg-gray-50">
                          <td className="p-2 border">{student.registrationNumber || '--'}</td>
                          <td className="p-2 border">{student.fullname || '--'}</td>
                          <td className="p-2 border">{student.class} - {student.section}</td>
                          <td className="p-2 border">{student.registrationNumber || '--'}</td>
                          <td className="p-2 border">{student.gender || '--'}</td>
                          <td className="p-2 border">
                            {student.dob ? new Date(student.dob).toLocaleDateString() : '--'}
                          </td>
                          <td className="p-2 border">
                            {parent.parentProfile.fatherName} & {parent.parentProfile.motherName}
                          </td>
                          <td className="p-2 border">{parent.parentProfile.fatherPhoneNumber || '--'}</td>
                          <td className="p-2 border">{student.address || '--'}</td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td className="p-2 border text-center" colSpan="9">
                      No student data found.
                    </td>
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
