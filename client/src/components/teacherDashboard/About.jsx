import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherProfile } from '../../redux/teacher/aboutSlice';
import Header from '../adminDashboard/layout/Header';

function About() {
  const dispatch = useDispatch();
  const { teacherProfile, loading, error } = useSelector((state) => state.about);

  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  const profile = teacherProfile?.Data?.profile;
  const userInfo = teacherProfile?.Data?.userId;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 mt-10 md:mt-20 md:ml-72">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">About</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-2 text-base sm:text-lg">
            <span>Home</span> {">"} <span className="font-medium text-[#146192]">About</span>
          </h1>
        </div>

        {/* Header + Edit Button */}
        <div className="flex items-center gap-4">
          <Header />
          <button className="bg-[#146192] text-white px-4 py-2 rounded-lg hover:bg-[#0e4a70] transition duration-200">
            Edit
          </button>
        </div>
      </div>

      {loading && <p>Loading profile...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {profile && (
        <div className="flex flex-col md:flex-row gap-8 mx-4 md:mx-8 md:ml-72">
          {/* Personal Details Section */}
          <div className="bg-white p-6 rounded-lg w-full max-w-md md:ml-0">
            {/* Profile image and name */}
            <div className="flex flex-col items-center">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
              />
              <h3 className="text-xl font-bold text-[#285A87] mt-2">{profile.fullname}</h3>
            </div>

            {/* Personal Details box */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-br from-[#bed3e7] to-[#ede9c2] p-6">
              <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">Personal Details</h4>
              <div className="text-sm space-y-3">
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Name</span> <span>-</span> <span className='text-lg'>{profile.fullname}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ E-mail</span> <span>-</span> <span className='text-lg'>{userInfo?.email}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Phone</span> <span>-</span> <span className='text-lg'>{profile.phoneNumber}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Gender</span> <span>-</span> <span className='text-lg'>{profile.gender}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Date of Birth</span> <span>-</span>
                  <span className='text-lg'>{new Date(profile.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Place of Birth</span> <span>-</span> <span className='text-lg'>{profile.pob}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Address</span> <span>-</span> <span className='text-lg'>{profile.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* School Details Section */}
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">School Details</h4>
            <div className="text-sm space-y-3">
              <div className="flex gap-3">
                <span className="text-[#285A87] text-lg">○ Employee ID</span> <span>-</span> <span className='text-lg'>{profile.employeeId}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#285A87] text-lg">○ Subjects</span> <span>-</span> <span className='text-lg'>{profile.subjects.join(', ')}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#285A87] text-lg">○ Class</span> <span>-</span> <span className='text-lg'>{profile.class}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#285A87] text-lg">○ Section</span> <span>-</span> <span className='text-lg'>{profile.section}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#285A87] text-lg">○ Joining Date</span> <span>-</span> <span className='text-lg'>{teacherProfile?.Data?.createdAt}</span>
              </div>

              <div className="flex gap-3">
                <span className="text-[#285A87] text-lg">○ Salary</span> <span>-</span> <span className='text-lg'>{profile.salary}</span>
              </div>
            </div>

            {/* Qualification Details Section */}
            {teacherProfile?.Data?.education.length > 0 && (
              <div className="bg-white p-6 rounded-lg w-full max-w-md mt-6">
                <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">Qualification Details</h4>
                <div className="space-y-3">
                  {teacherProfile.Data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border border-gray-200 p-4 rounded-md bg-[#1982C429]"
                    >
                      <div className="flex justify-between">
                        <span className="text-[#285A87] text-lg font-medium">Degree</span>
                        <span className="text-black text-lg">{edu.degree}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#285A87] text-lg font-medium">University</span>
                        <span className="text-black text-lg">{edu.university}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#285A87] text-lg font-medium">City</span>
                        <span className="text-black text-lg">{edu.city}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
             {/* Bank Details Section */}
          {profile && (
            <div className="bg-white p-6 rounded-lg w-full max-w-md mt-6">
              <h4 className="font-semibold text-[#285A87] text-center text-xl mb-4 underline">Bank Details</h4>
              <div className="text-sm space-y-3">
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Bank Name</span> <span>-</span> <span className='text-lg'>{profile.bankName}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Account Holder Name</span> <span>-</span> <span className='text-lg'>{profile.accountHolderName}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ Account Number</span> <span>-</span> <span className='text-lg'>{profile.accountNumber}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#285A87] text-lg">○ IFSC Code</span> <span>-</span> <span className='text-lg'>{profile.ifscCode}</span>
                </div>
              </div>
            </div>
          )}
        </div>
    
          </div>
        

      )}
    </>
  );
}

export default About;
