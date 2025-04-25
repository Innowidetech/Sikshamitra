import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherProfile, editTeacherProfile } from '../../redux/teacher/aboutSlice';
import Header from '../adminDashboard/layout/Header';

function About() {
  const dispatch = useDispatch();
  const { teacherProfile, loading, error } = useSelector((state) => state.about);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    pob: '',
    address: '',
  });

  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  useEffect(() => {
    if (teacherProfile?.Data?.profile) {
      const { profile } = teacherProfile.Data;
      setFormData({
        fullname: profile.fullname || '',
        email: teacherProfile.Data.userId?.email || '',
        phoneNumber: profile.phoneNumber || '',
        gender: profile.gender || '',
        dob: profile.dob || '',
        pob: profile.pob || '',
        address: profile.address || '',
      });
    }
  }, [teacherProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editTeacherProfile(formData)).then(() => {
      dispatch(fetchTeacherProfile());  // Fetch updated profile after editing
      setShowEditModal(false);  // Close modal
    });
  };

  const profile = teacherProfile?.Data?.profile;
  const userInfo = teacherProfile?.Data?.userId;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 mt-10 md:mt-20 md:ml-72">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">About</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-2 text-base sm:text-lg">
            <span>Home</span> {">"} <span className="font-medium text-[#146192]">About</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Header />
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-[#146192] text-white px-4 py-2 rounded-lg hover:bg-[#0e4a70] transition duration-200"
          >
            Edit
          </button>
        </div>
      </div>

      {loading && <p className="mt-4 text-center">Loading profile...</p>}
      {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}

      {profile && (
        <div className="flex flex-col md:flex-row gap-8 mx-4 md:mx-8 md:ml-72">

          {/* Personal Details */}
          <div className="bg-white p-6 rounded-lg w-full max-w-md md:ml-0">
            <div className="flex flex-col items-center">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
              />
              <h3 className="text-xl font-bold text-[#285A87] mt-2">{profile.fullname}</h3>
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-br from-[#bed3e7] to-[#ede9c2] p-6">
              <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">Personal Details</h4>
              <div className="text-sm space-y-3">
                <Detail label="Name" value={profile.fullname} />
                <Detail label="E-mail" value={userInfo?.email} />
                <Detail label="Phone" value={profile.phoneNumber} />
                <Detail label="Gender" value={profile.gender} />
                <Detail label="Date of Birth" value={new Date(profile.dob).toLocaleDateString()} />
                <Detail label="Place of Birth" value={profile.pob} />
                <Detail label="Address" value={profile.address} />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-6 w-full">

            {/* School Details */}
            <div className="bg-white p-6 rounded-lg w-full">
              <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">School Details</h4>
              <div className="text-sm space-y-3">
                <Detail label="Employee ID" value={profile.employeeId} />
                <Detail label="Subjects" value={profile.subjects.join(', ')} />
                <Detail label="Class" value={profile.class} />
                <Detail label="Section" value={profile.section} />
                <Detail label="Joining Date" value={teacherProfile?.Data?.createdAt} />
                <Detail label="Salary" value={profile.salary} />
              </div>
            </div>

            {/* Qualification */}
            {teacherProfile?.Data?.education.length > 0 && (
              <div className="bg-white p-6 rounded-lg w-full">
                <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">Qualification Details</h4>
                <div className="space-y-3">
                  {teacherProfile.Data.education.map((edu, index) => (
                    <div key={index} className="flex flex-col gap-2 border border-gray-200 p-4 rounded-md bg-[#1982C429]">
                      <Detail label="Degree" value={edu.degree} horizontal />
                      <Detail label="University" value={edu.university} horizontal />
                      <Detail label="City" value={edu.city} horizontal />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bank Details */}
            <div className="bg-white p-6 rounded-lg w-full">
              <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">Bank Details</h4>
              <div className="text-sm space-y-3">
                <Detail label="Bank Name" value={profile.bankName} />
                <Detail label="Account Holder Name" value={profile.accountHolderName} />
                <Detail label="Account Number" value={profile.accountNumber} />
                <Detail label="IFSC Code" value={profile.ifscCode} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl shadow-xl relative">
            <h2 className="text-xl font-semibold text-[#285A87] mb-4">Edit Personal Details</h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </button>
            <form className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {['fullname', 'email', 'phoneNumber', 'gender', 'dob', 'pob', 'address'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === 'dob' ? 'date' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-4 py-2 rounded-lg hover:bg-[#0e4a70]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const Detail = ({ label, value, horizontal = false }) => (
  <div className={`flex ${horizontal ? 'justify-between' : 'gap-3'}`}>
    <span className="text-[#285A87] text-lg">{horizontal ? label : `○ ${label}`}</span>
    {!horizontal && <span>-</span>}
    <span className="text-lg text-black">{value}</span>
  </div>
);

export default About;

