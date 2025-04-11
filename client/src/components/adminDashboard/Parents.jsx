import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchParents } from '../../redux/parentSlice';
import { Search } from 'lucide-react';

function Parents() {
  const dispatch = useDispatch();
  const { parents, loading, error } = useSelector((state) => state.parents);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParents, setFilteredParents] = useState([]);

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  useEffect(() => {
    if (parents) {
      handleSearch();
    }
  }, [parents, searchQuery]);

  const handleSearch = () => {
    const searchLower = searchQuery.toLowerCase();
    const filtered = parents.filter((parent) => {
      const studentMatches = parent.parentProfile?.parentOf?.some((child) => {
        const student = child.studentProfile;
        return (
          student?.fullname?.toLowerCase().includes(searchLower) ||
          student?.registrationNumber?.toLowerCase().includes(searchLower) ||
          student?.class?.toLowerCase().includes(searchLower) ||
          student?.section?.toLowerCase().includes(searchLower)
        );
      });
      return studentMatches;
    });

    setFilteredParents(filtered);
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">Parents</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" > "}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Parents List
            </span>
          </h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="mx-8 mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Student Name, ID, Class, or Section"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="mx-8 mb-6 hidden lg:block">
        <div className="bg-white rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y border-2">
              <thead style={{ fontFamily: "Poppins" }}>
                <tr>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Student ID
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Student Name
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Parent Name
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
                    Occupation
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                   Tution Fees
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Monthly Fees
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    HalfYearly Fees
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192]">
                    Pending Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-2 py-4 text-center text-gray-500">
                      No student data available
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((parent) => 
                    parent.parentProfile?.parentOf?.map((child, index) => {
                      const student = child.studentProfile;
                      return (
                        <tr key={child._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-2 py-2 text-sm border-r">{student?.registrationNumber || 'N/A'}</td>
                          <td className="px-2 py-2 text-sm border-r">
                            {student?.fullname || 'N/A'}
                          </td>
                          <td className="px-2 py-2 text-sm border-r">
                            {parent.parentProfile?.fatherName || 'N/A'}
                          </td>
                          <td className="px-2 py-2 text-sm border-r">{student?.class || 'N/A'}</td>
                          <td className="px-2 py-2 text-sm border-r">{student?.section || 'N/A'}</td>
                          <td className="px-2 py-2 text-sm border-r">{student?.gender || 'N/A'}</td>
                          <td className="px-2 py-2 text-sm border-r">
                            {parent.parentProfile?.fatherOccupation || 'N/A'}
                          </td>
                          <td className="px-2 py-2 text-sm border-r">
                            ₹{student?.fees?.toLocaleString() || 'N/A'}
                          </td>
                          <td className="px-2 py-2 text-sm border-r">
                            ₹{child?.monthlyFees || 'N/A'}
                          </td>
                          <td className="px-2 py-2 text-sm border-r">
                            ₹{child?.halfYearlyFees || 'N/A'}
                          </td>
                          <td className="px-2 py-2 text-sm">
                            ₹{child?.pendingAmount?.toLocaleString() || 'N/A'}
                          </td>
                        </tr>
                      );
                    })
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile and Tablet View - Cards */}
      <div className="mx-4 mb-6 lg:hidden shadow-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {filteredParents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No student data available
              </div>
            ) : (
              filteredParents.map((parent) =>
                parent.parentProfile?.parentOf?.map((child, index) => {
                  const student = child.studentProfile;
                  return (
                    <div key={child._id} className="bg-white p-4 rounded-lg">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-[#146192]">Student Id</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{student?.registrationNumber || 'N/A'}</div>

                        <div className="text-[#146192]">Student Name</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{student?.fullname || 'N/A'}</div>

                        <div className="text-[#146192]">Parent Name</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{parent.parentProfile?.fatherName || 'N/A'}</div>

                        <div className="text-[#146192]">Class</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{student?.class || 'N/A'}</div>

                        <div className="text-[#146192]">Section</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{student?.section || 'N/A'}</div>

                        <div className="text-[#146192]">Gender</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{student?.gender || 'N/A'}</div>

                        <div className="text-[#146192]">Occupation</div>
                        <div className="text-center">-</div>
                        <div className="text-right">{parent.parentProfile?.fatherOccupation || 'N/A'}</div>

                        <div className="text-[#146192]">Tution Fees</div>
                        <div className="text-center">-</div>
                        <div className="text-right">₹{student?.fees?.toLocaleString() || 'N/A'}</div>

                        <div className="text-[#146192]">Monthly Fees</div>
                        <div className="text-center">-</div>
                        <div className="text-right">₹{child?.monthlyFees || 'N/A'}</div>

                        <div className="text-[#146192]">HalfYearly Fees</div>
                        <div className="text-center">-</div>
                        <div className="text-right">₹{child?.halfYearlyFees || 'N/A'}</div>

                        <div className="text-[#146192] font-medium">Pending Amount</div>
                        <div className="text-center">-</div>
                        <div className="text-right font-medium">₹{child?.pendingAmount?.toLocaleString() || 'N/A'}</div>
                      </div>
                      <hr className="border mt-4 border-[#146192]" />
                    </div>
                  );
                })
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Parents;