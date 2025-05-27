import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdatedStudents } from '../../redux/studentsSlice';

const StudentHistory = () => {
  const dispatch = useDispatch();
  const { updatedStudentHistory, loading, error } = useSelector(state => state.students);

  const [filters, setFilters] = useState({
    name: '',
    regNumber: '',
    class: '',
    section: ''
  });

  useEffect(() => {
    dispatch(fetchUpdatedStudents());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = updatedStudentHistory.filter(entry => {
    const student = entry.updatedData;
    return (
      (!filters.name || student.fullname?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.regNumber || student.registrationNumber?.toLowerCase().includes(filters.regNumber.toLowerCase())) &&
      (!filters.class || student.class === filters.class) &&
      (!filters.section || student.section === filters.section)
    );
  });

  const classOptions = [...new Set(updatedStudentHistory.map(e => e.updatedData.class).filter(Boolean))];
  const sectionOptions = [...new Set(updatedStudentHistory.map(e => e.updatedData.section).filter(Boolean))];

  return (
    <div className="p-6 font-sans">
      {/* Filters */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          <input
            name="name"
            value={filters.name}
            onChange={handleInputChange}
            placeholder="Search by Student name..."
            className="border px-3 py-1 rounded-md text-sm  bg-[#1461921A]"
          />
          <input
            name="regNumber"
            value={filters.regNumber}
            onChange={handleInputChange}
            placeholder="Search by Registration number..."
            className="border px-3 py-1 rounded-md text-sm  bg-[#1461921A]"
          />
          <select
            name="class"
            value={filters.class}
            onChange={handleInputChange}
            className="border px-3 py-1 rounded-md text-sm  bg-[#1461921A]"
          >
            <option value="">Class</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            name="section"
            value={filters.section}
            onChange={handleInputChange}
            className="border px-3 py-1 rounded-md text-sm  bg-[#1461921A]"
          >
            <option value="">Section</option>
            {sectionOptions.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>
        
      </div>

      {loading && <p className="text-gray-600">Loading updated students...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && filteredData.length === 0 && (
        <p className="text-gray-500">No student updates found.</p>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <div className="space-y-10">
          {filteredData.map((entry, index) => {
            const prev = entry.previousData;
            const updated = entry.updatedData;

            const prevActive = prev.isActive === true || prev.isActive === 'true' || prev.isActive === 'Active';
            const updatedActive = updated.isActive === true || updated.isActive === 'true' || updated.isActive === 'Active';

            return (
              <div
                key={entry._id || index}
                className="bg-white p-4 shadow-md rounded-md border border-gray-300"
              >
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="w-full md:w-1/2 bg-[#1461921A] border border-gray-300 rounded-lg p-4 shadow-sm relative">
                    <h3 className="text-lg font-bold mb-3">Previous Data</h3>
                    <Checkmark isActive={prevActive} />
                    <StudentInfo data={prev} highlightKey="fullname" />
                  </div>
                  <div className="w-full md:w-1/2 bg-[#1461921A] border border-gray-300 rounded-lg p-4 shadow-sm relative">
                    <h3 className="text-lg font-bold mb-3 ">Updated Data</h3>
                    <Checkmark isActive={updatedActive} />
                    <StudentInfo data={updated} highlightKey="fullname" />
                  </div>
                </div>

                {/* Reason for Edit */}
                <div className="mt-4">
                  <label className="text-sm font-medium block mb-1">Reason For Edit :</label>
                  <div className="border px-4 py-2 rounded-md bg-gray-50 text-base">{entry.reason}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StudentInfo = ({ data, highlightKey }) => {
  const infoFields = [
    ['Student Name', 'fullname'],
    ['Registration Number', 'registrationNumber'],
    ['Class', 'class'],
    ['Section', 'section'],
    ['Student Gender', 'gender'],
    ['DOB', 'dob'],
    ['Fees', 'fees'],
    ['Address', 'address']
  ];

  // Helper to format date without time (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Create date object
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fallback to original if invalid

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="text-base space-y-1 ">
      {infoFields.map(([label, key]) => (
        <div key={key}>
          <span className="font-semibold text-[#146192]">{label} : </span>
          <span className={key === highlightKey ? 'font-bold text-[#000000]' : ''}>
            {key === 'dob' ? formatDate(data[key]) : data[key]}
          </span>
        </div>
      ))}
    </div>
  );
};

const Checkmark = ({ isActive }) => (
  <span className={`absolute top-4 right-4 text-xl ${isActive ? 'text-green-500' : 'text-red-500'}`}>
    {isActive ? '✔️' : '❌'}
  </span>
);

export default StudentHistory;
