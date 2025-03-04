import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeachers, setSearchQuery } from '../../../redux/teachersSlice';

function TeachersTable() {
  const dispatch = useDispatch();
  const { teachers, filteredTeachers, loading, error, searchQuery } = useSelector((state) => state.teachers);


  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

   // Handle search query input changes
  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(filteredTeachers)
  
  return (
    <div className=" overflow-x-hidden min-h-screen p-4 w-[240px] md:w-[460px] lg:w-[700px] xl:w-full xl:max-w-6xl md:ml-6 xl:ml-4">
      {/* Search Input */}
      <div className="border border-black rounded-lg overflow-hidden xl:max-w-6xl xl:mx-auto mb-4 bg-white">
        <div className="flex items-center px-3">
          <CiSearch className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Name or Email"
            className="w-full px-4 py-3 focus:outline-none"
          />
        </div>
      </div>

      {/* Teachers Table */}
      <div className="border border-black rounded-lg overflow-hidden max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" style={{fontFamily:'Poppins'}}>
            <thead className="bg-white">
              <tr>
                <th className="sticky left-0 bg-white px-6 py-3 text-center md:text-lg font-medium text-black">Teacher ID</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Tecaher Name</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">E-mail Address</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Class</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Section</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Gender</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Subject Name</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Phone Number</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Salary</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Action</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Active/Inactive</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher, index) => (
                <tr key={teacher._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#EBF6FF]'}>
                  <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={teacher.profile.photo}
                        alt={`${teacher.profile.firstName}`}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.profile.firstName} {teacher.profile.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {teacher.profile.subjects || 'Non Teaching'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {teacher.profile.class || 'Non Teaching'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {teacher.userId.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {teacher.profile.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {teacher.profile.salary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeachersTable;