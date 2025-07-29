import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaFemale, FaMale } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../redux/admission'; // Adjust the import path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Application = () => {
  const dispatch = useDispatch();
  const { admissions, loading, error } = useSelector((state) => state.admissions);
  const [activeTab, setActiveTab] = useState('online');
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchAdmissions());
  }, [dispatch]);

  const onlineAdmissions = admissions?.onlineRequests || [];
  const offlineAdmissions = admissions?.offlineRequests || [];
  const filteredAdmissions = activeTab === 'online' ? onlineAdmissions : offlineAdmissions;

  const total = onlineAdmissions.length + offlineAdmissions.length;

  const maleCountOnline = onlineAdmissions.filter(
    s => s.studentDetails?.gender?.toLowerCase() === 'male'
  ).length;
  const maleCountOffline = offlineAdmissions.filter(
    s => s.gender?.toLowerCase() === 'male'
  ).length;
  const femaleCountOnline = onlineAdmissions.filter(
    s => s.studentDetails?.gender?.toLowerCase() === 'female'
  ).length;
  const femaleCountOffline = offlineAdmissions.filter(
    s => s.gender?.toLowerCase() === 'female'
  ).length;

  const maleCount = maleCountOnline + maleCountOffline;
  const femaleCount = femaleCountOnline + femaleCountOffline;

  const handleRowClick = (index) => {
    setExpandedRowIndex(index === expandedRowIndex ? null : index);
  };

  const handleCreateAccount = (studentId) => {
    console.log("Creating account for:", studentId);
    toast.success("Account created successfully!");
  };

  const renderTableRows = () => {
    if (activeTab === 'online') {
      return filteredAdmissions.length === 0 ? (
        <tr>
          <td colSpan="8" className="text-center p-4">No online applications found.</td>
        </tr>
      ) : (
        filteredAdmissions.map((student, index) => {
          const sd = student.studentDetails;
          const pd = student.parentDetails;
          const ed = student.educationDetails[0] || {};

          return (
            <React.Fragment key={student._id || index}>
              <tr
                className="cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleRowClick(index)}
              >
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{sd.firstName} {sd.lastName}</td>
                <td className="border p-2">{sd.classToJoin}</td>
                <td className="border p-2">{pd.fatherPhone || pd.motherPhone || 'N/A'}</td>
                <td className="border p-2">{sd.dob}</td>
                <td className="border p-2">{sd.email}</td>
                <td className="border p-2">{sd.address}</td>
                <td className="border p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateAccount(student._id);
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Create Account
                  </button>
                </td>
              </tr>

              {expandedRowIndex === index && (
                <tr>
                  <td colSpan="8" className="border p-4 bg-gray-50">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {sd.photo?.url && (
                        <img
                          src={sd.photo.url}
                          alt="Student"
                          className="w-28 h-28 object-cover rounded border"
                        />
                      )}
                      <div className="text-sm flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
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
                        <div className="flex flex-wrap items-center gap-4 mt-2 col-span-2">
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
              )}
            </React.Fragment>
          );
        })
      );
    } else {
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
      <ToastContainer />

      <div className="flex justify-between items-center mx-4 sm:mx-6 lg:mx-8 py-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 px-4 gap-6 mx-4 lg:mx-8 mb-6">
        <StatCard icon={<FaUserGraduate />} label="New Admissions" value={total} color="#5C4E8E" />
        <StatCard icon={<FaMale />} label="Male" value={maleCount} color="#FFC000" />
        <StatCard icon={<FaFemale />} label="Female" value={femaleCount} color="#3FB56F" />
      </div>

      <div className="mx-4 lg:mx-8 mb-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab} Applications</h2>
          <div className="flex gap-2 flex-wrap">
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
          <div className="overflow-auto">
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
                  {activeTab === 'online' && (
                    <th className="border p-2">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          </div>
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
