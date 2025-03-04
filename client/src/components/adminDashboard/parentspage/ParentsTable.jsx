import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useSelector, useDispatch } from 'react-redux';
import { fetchParents } from '../../../redux/parentSlice';

function ParentsTable() {
  const dispatch = useDispatch();
  const { parents, loading, error } = useSelector((state) => state.parents);

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [filteredParents, setFilteredParents] = useState(parents);

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClassChange = (e) => {
    setClassFilter(e.target.value);
  };

  const handleSearchClick = () => {
    const newFilteredParents = parents.filter((parent) => {
      const matchesSearchQuery = parent.parentProfile?.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClassFilter = classFilter
        ? parent.parentProfile?.parentOf?.some((child) => child.studentProfile?.class === classFilter)
        : true;

      return matchesSearchQuery && matchesClassFilter;
    });

    setFilteredParents(newFilteredParents);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-hidden min-h-screen p-4 w-[240px] md:w-[460px] lg:w-[700px] xl:w-full xl:max-w-6xl md:ml-6 xl:ml-4">
      <div className="flex gap-4 mb-4">
        <div className="bg-[#EEF0F7] rounded-lg overflow-hidden w-1/2">
          <div className="flex items-center px-3">
            <CiSearch className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Parent Name or Student Name"
              className="w-full px-4 py-3 focus:outline-none bg-[#EEF0F7]"
            />
          </div>
        </div>

        <div className="bg-[#EEF0F7] rounded-lg overflow-hidden w-1/2">
          <select
            value={classFilter}
            onChange={handleClassChange}
            className="w-full px-4 py-3 focus:outline-none bg-[#EEF0F7]"
          >
            <option value="">Select Class</option>
            {[...Array(12).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                Class {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSearchClick}
          className="bg-[#146192] text-white px-6 py-3 rounded-lg ml-2"
          style={{ fontFamily: 'Poppins' }}
        >
          Search
        </button>
      </div>

      {/* Parents Table */}
      <div className="border border-[#DDDEEE] rounded-lg overflow-hidden max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="sticky left-0 bg-white px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Sno</th>
                <th className="sticky left-0 bg-white px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Student Name</th>
                <th className="sticky left-0 bg-white px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Class</th>
                <th className="sticky left-0 bg-white px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Parent Name</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Occupation</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Address</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-[#146192]">E-mail</th>
                <th className="px-6 py-3 text-center md:text-lg font-medium text-[#146192]">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No student data available
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent, index) => {
                  return parent.parentProfile?.parentOf?.map((child, childIndex) => {
                    const student = child.studentProfile;
                    const studentName = `${student.firstName.trim()} ${student.lastName.trim()}`;
                    const studentClass = student.class || 'N/A';

                    return (
                      <tr key={child._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#EBF6FF]'}>
                        <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {studentName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {studentClass}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {parent.parentProfile?.fatherName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {parent.parentProfile?.fatherOccupation || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {parent.parentProfile?.fatherAddress || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {parent.userId?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {parent.parentProfile?.fatherPhoneNumber || 'N/A'}
                        </td>
                      </tr>
                    );
                  });
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ParentsTable;
