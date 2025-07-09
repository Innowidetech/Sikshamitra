import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaFemale, FaMale } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../redux/admission'; // Adjust the import path

const Application = () => {
  const dispatch = useDispatch();

  // Fetch admissions state from Redux
  // Expecting the state.admissions to hold the full API response: { onlineRequests: [], offlineRequests: [] }
  const { admissions, loading, error } = useSelector((state) => state.admissions);

  const [activeTab, setActiveTab] = useState('online'); // 'online' or 'offline'

  useEffect(() => {
    dispatch(fetchAdmissions());
  }, [dispatch]);

  // Safe fallback in case admissions is undefined
  const onlineAdmissions = admissions?.onlineRequests || [];
  const offlineAdmissions = admissions?.offlineRequests || [];

  // Filter based on active tab
  const filteredAdmissions = activeTab === 'online' ? onlineAdmissions : offlineAdmissions;

  // Calculate stats dynamically
  const total = onlineAdmissions.length + offlineAdmissions.length;

  // Extract gender from online and offline separately, then sum
  const maleCountOnline = onlineAdmissions.filter(
    s => s.studentDetails?.gender?.toLowerCase() === 'male'
  ).length;

  const maleCountOffline = offlineAdmissions.filter(
    s => s.gender?.toLowerCase() === 'male' // offline requests might not have gender? Adjust accordingly
  ).length;

  const femaleCountOnline = onlineAdmissions.filter(
    s => s.studentDetails?.gender?.toLowerCase() === 'female'
  ).length;

  const femaleCountOffline = offlineAdmissions.filter(
    s => s.gender?.toLowerCase() === 'female'
  ).length;

  const maleCount = maleCountOnline + maleCountOffline;
  const femaleCount = femaleCountOnline + femaleCountOffline;

  // Helper function to render table rows depending on type (online/offline)
  const renderTableRows = () => {
    if (activeTab === 'online') {
      return filteredAdmissions.length === 0 ? (
        <tr>
          <td colSpan="7" className="text-center p-4">No online applications found.</td>
        </tr>
      ) : (
        filteredAdmissions.map((student, index) => {
          const sd = student.studentDetails;
          const pd = student.parentDetails;
          const ed = student.educationDetails[0] || {};

          return (
            <React.Fragment key={student._id || index}>
              <tr>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{sd.firstName} {sd.lastName}</td>
                <td className="border p-2">{sd.classToJoin}</td>
                <td className="border p-2">{pd.fatherPhone || pd.motherPhone || 'N/A'}</td>
                <td className="border p-2">{sd.dob}</td>
                <td className="border p-2">{sd.email}</td>
                <td className="border p-2">{sd.address}</td>
              </tr>
              <tr>
                <td colSpan="7" className="border p-4 bg-gray-50">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {sd.photo?.url && (
                      <img
                        src={sd.photo.url}
                        alt="Student"
                        className="w-28 h-28 object-cover rounded border"
                      />
                    )}
                    <div className="text-sm flex-1 grid grid-cols-2 gap-2">
                      <p><strong>Date & Place of birth:</strong> {sd.dob}, {sd.placeOfBirth}</p>
                      <p><strong>City:</strong> {ed.city || 'N/A'}</p>
                      <p><strong>School Name:</strong> {sd.schoolName}</p>
                      <p><strong>Class:</strong> {ed.class || 'N/A'}</p>
                      <p><strong>Start Date:</strong> {ed.startDate ? new Date(ed.startDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>End Date:</strong> {ed.endDate ? new Date(ed.endDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Father Name:</strong> {pd.fatherName}</p>
                      <p><strong>Mother Name:</strong> {pd.motherName}</p>
                      <p><strong>Father Phone No:</strong> {pd.fatherPhone}</p>
                      <p><strong>Mother Phone No:</strong> {pd.motherPhone}</p>
                      <p><strong>Address:</strong> {pd.address}</p>
                      <div className="flex items-center gap-4 mt-2 col-span-2">
                        {pd.aadharCard && (
                          <a href={pd.aadharCard} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">
                            <span className="text-red-500">PDF</span> Aadhar Card
                          </a>
                        )}
                        {pd.panCard && (
                          <a href={pd.panCard} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">
                            <span className="text-red-500">PDF</span> Pan Card
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          );
        })
      );
    } else {
      // Offline tab
      return filteredAdmissions.length === 0 ? (
        <tr>
          <td colSpan="7" className="text-center p-4">No offline applications found.</td>
        </tr>
      ) : (
        filteredAdmissions.map((student, index) => (
          <tr key={student._id || index}>
            <td className="border p-2">{index + 1}</td>
            <td className="border p-2">{student.fullname}</td>
            <td className="border p-2">{student.class}</td>
            <td className="border p-2">{student.phoneNumber}</td>
            <td className="border p-2">{new Date(student.dob).toLocaleDateString()}</td>
            <td className="border p-2">{student.email}</td>
            <td className="border p-2">{student.address}</td>
          </tr>
        ))
      );
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">Admission</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" > "}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Admission Application
            </span>
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 px-4 gap-6 mx-4 lg:mx-8 mb-6">
        <StatCard icon={<FaUserGraduate />} label="New Admissions" value={total} color="#5C4E8E" />
        <StatCard icon={<FaMale />} label="Male" value={maleCount} color="#FFC000" />
        <StatCard icon={<FaFemale />} label="Female" value={femaleCount} color="#3FB56F" />
      </div>

      {/* Toggle and Table */}
      <div className="mx-4 lg:mx-8 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab} Applications</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('online')}
              className={`px-4 py-2 rounded shadow transition ${activeTab === 'online' ? 'bg-[#FF9F00] text-white' : 'border border-[#FF9F00] text-[#FF9F00] hover:bg-[#FFF4E5]'}`}
            >
              Online Application
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`px-4 py-2 rounded shadow transition ${activeTab === 'offline' ? 'bg-[#FF9F00] text-white' : 'border border-[#FF9F00] text-[#FF9F00] hover:bg-[#FFF4E5]'}`}
            >
              Offline Application
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <table className="min-w-full border border-collapse border-black text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">S.no</th>
                <th className="border p-2">Full Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Phone Number</th>
                <th className="border p-2">Date Of Birth</th>
                <th className="border p-2">E-mail ID</th>
                <th className="border p-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-lg shadow p-6 flex items-center justify-around space-x-4 border-l-[8px]`} style={{ borderColor: color }}>
    <div className="rounded-full">{icon}</div>
    <hr className="h-14 w-[2px] bg-gray-300" />
    <div>
      <p>{label}</p>
      <h3 className="text-center text-2xl font-medium">{value}</h3>
    </div>
  </div>
);

export default Application;
