import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdatedIncomeHistory } from '../../redux/accountSlice';

const AccountHistory = () => {
  const dispatch = useDispatch();
  const { updatedIncomeHistory, status, errorIncomeHistory } = useSelector(state => state.accounts);

  // Filters state
  const [filters, setFilters] = useState({
    name: '',
    regNumber: '',
    class: '',
    section: '',
  });

  useEffect(() => {
    dispatch(fetchUpdatedIncomeHistory());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const extractFields = (data) => ({
    name:
      data?.fullname ||
      data?.studentId?.studentProfile?.fullname ||
      `${data?.studentDetails?.firstName || ''} ${data?.studentDetails?.lastName || ''}`.trim(),
    regNumber:
      data?.registrationNumber ||
      data?.studentId?.studentProfile?.registrationNumber ||
      data?.studentDetails?.registrationNumber || // if applicable
      '',
    class: data?.class || data?.studentId?.studentProfile?.class || data?.studentDetails?.classToJoin || '',
    section: data?.section || data?.studentId?.studentProfile?.section || '',
  });

  // Filter logic
  const filteredData = updatedIncomeHistory.filter(entry => {
    const updated = extractFields(entry.updatedData);

    if (filters.name && !updated.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.regNumber && !updated.regNumber.toLowerCase().includes(filters.regNumber.toLowerCase())) {
      return false;
    }

    if (filters.class && updated.class !== filters.class) {
      return false;
    }

    if (filters.section && updated.section !== filters.section) {
      return false;
    }

    return true;
  });

  // Generate class and section options dynamically
  const classOptions = Array.from(new Set(updatedIncomeHistory.map(entry => {
    const cls = entry.updatedData?.class || '';
    return cls || null;
  }).filter(Boolean))).sort();

  const sectionOptions = Array.from(new Set(updatedIncomeHistory.map(entry => {
    const sec = entry.updatedData?.section || '';
    return sec || null;
  }).filter(Boolean))).sort();

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const renderDataCard = (title, data) => {
    return (
      <div className="bg-[#1461921A] rounded-lg p-4 shadow-md w-full sm:w-[48%] mb-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p><strong className='text-[#146192] text-base'>Date:</strong> {formatDate(data?.date || data?.createdAt)}</p>
        <p><strong className='text-[#146192] text-base'>Purpose:</strong> {data?.purpose || 'N/A'}</p>
        <p><strong className='text-[#146192] text-base'>Amount:</strong> ₹{data?.amount || 0}</p>
        <p><strong className='text-[#146192] text-base'>Transaction ID:</strong> {data?._id || 'N/A'}</p>
        <p><strong className='text-[#146192] text-base'>Name:</strong> {extractFields(data).name}</p>
        <p><strong className='text-[#146192] text-base'>Class:</strong> {extractFields(data).class}</p>
        <p><strong className='text-[#146192] text-base'>Section:</strong> {extractFields(data).section}</p>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Updated Income History</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleInputChange}
          placeholder="Search by Name"
          className="border rounded px-3 py-2 bg-[#1461921A]"
        />

        <input
          type="text"
          name="regNumber"
          value={filters.regNumber}
          onChange={handleInputChange}
          placeholder="Search by Registration Number"
          className="border rounded px-3 py-2 bg-[#1461921A]"
        />

        <select
          name="class"
          value={filters.class}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 bg-[#1461921A]"
        >
          <option value="">Select Class</option>
          {classOptions.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <select
          name="section"
          value={filters.section}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 bg-[#1461921A]"
        >
          <option value="">Select Section</option>
          {sectionOptions.map(sec => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
      </div>

      {status === 'loading' && <p>Loading updated income history...</p>}
      {errorIncomeHistory && <p className="text-red-500">Error: {errorIncomeHistory}</p>}

      {!status === 'loading' && filteredData.length === 0 && (
        <p className="text-gray-500">No updated income history found.</p>
      )}

      {filteredData.map(entry => (
        <div key={entry._id} className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm ">
          <div className="flex flex-col sm:flex-row sm:justify-between  sm:gap-4">
            {renderDataCard('Previous Data', entry.previousData)}
            {renderDataCard('Updated Data', entry.updatedData)}
          </div>
          <div className="mt-4 " >
            <label className="block font-medium mb-1 text-sm text-gray-700">Reason For Edit:</label>
            <input
              type="text"
              value={entry.reasonForEdit}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountHistory;
