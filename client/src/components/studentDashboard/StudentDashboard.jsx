import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, fetchAttendance, fetchNotices } from '../../redux/student/studashboardSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  
  const { profile, attendance, notices, loading, error } = useSelector(state => state.studentDashboard);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchAttendance({}));
    dispatch(fetchNotices());
  }, [dispatch]);

  // Handling loading, error, and empty states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const studentProfile = profile?.Data;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Student Dashboard</h1>

        {/* Attendance */}
        <div>
          <h3>Attendance</h3>
          {Array.isArray(attendance) && attendance.length > 0 ? (
            <ul>
              {attendance.map((item, index) => (
                <li key={index}>
                  {item.date}: {item.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendance data available</p>
          )}
        </div>

        {/* Notices */}
        <div>
          <h3>Notices</h3>
          {notices.length > 0 ? (
            <ul>
              {notices.map((notice, index) => (
                <li key={index}>{notice.title}</li>
              ))}
            </ul>
          ) : (
            <p>No notices available</p>
          )}
        </div>
      </div>

      {/* Profile Section - Right Side */}
      <div className="profile-box" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px',marginTop:'30px' }}>
        {/* Profile Picture */}
        <div className="profile-image-container" style={{ textAlign: 'center', marginBottom: '15px' }}>
          <img 
            src={studentProfile?.studentProfile?.photo} 
            alt="Profile" 
            className="h-32 w-32 rounded-full"
            style={{ width: '140px', height: '140px', borderRadius: '50%' }}
          />
        </div>

        {/* Profile Name */}
        {profile ? (
          <div className="profile-name" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h2>{studentProfile?.studentProfile.fullname}</h2>
          </div>
        ) : (
          <p>No profile data available</p>
        )}

        {/* Personal Details Section Inside Box */}
        <div style={{
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          background: 'linear-gradient(to right, #A0C9D6, #F9E1A3)', // Gradient background
          color: '#fff'  // White text color for contrast
        }}>
          <h3 
  style={{
    textDecoration: 'underline', 
    marginBottom: '10px', 
    color: '#285A87', 
    fontSize: '20px',        // Larger font size
    fontWeight: 'semibold',      // Make the font bold
    marginTop: '20px',
    
  }}
>
  Personal Details
</h3>


<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
    <li style={{ marginBottom: '10px' }}>
      <strong>Name </strong>- {studentProfile?.studentProfile.fullname}
    </li>
  </ul>
</div>

<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Email </strong>- {studentProfile?.userId.email}
  </li>
  </ul>
</div>

<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Phone </strong>- {profile?.ParentData?.parentProfile?.fatherPhoneNumber}
  </li>
  </ul>
</div>

<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Gender </strong>- {studentProfile?.studentProfile.gender}
  </li>
  </ul>
</div>

<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Date of Birth </strong>- {studentProfile?.studentProfile.dob}
  </li>
  </ul>
</div>

<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Address </strong>- {studentProfile?.studentProfile.address}
  </li>
  </ul>
</div>
<h3 
  style={{
    textDecoration: 'underline', 
    marginBottom: '20px', 
    color: '#285A87', 
    fontSize: '20px', 
    fontWeight: 'semibold', 
    marginTop: '20px',
  }}
>
  Previous Education Details
</h3>
<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
    {studentProfile?.studentProfile.previousEducation && studentProfile.studentProfile.previousEducation.length > 0 ? (
      studentProfile.studentProfile.previousEducation.map((education, index) => (
        <li key={index} style={{ marginBottom: '10px' }}>
          <strong>School Name: </strong> {education.schoolName || 'N/A'}<br />
         
        </li>
      ))
    ) : (
      <li style={{ marginBottom: '10px' }}>
        No previous education details available.
      </li>
    )}
  </ul>
</div>
<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
    {studentProfile?.studentProfile.previousEducation && studentProfile.studentProfile.previousEducation.length > 0 ? (
      studentProfile.studentProfile.previousEducation.map((education, index) => (
        <li key={index} style={{ marginBottom: '10px' }}>
          <strong>Duration: </strong> {education.schoolName || 'N/A'}<br />
         
        </li>
      ))
    ) : (
      <li style={{ marginBottom: '10px' }}>
        No previous education details available.
      </li>
    )}
  </ul>
</div>
<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Class </strong>- {studentProfile?.studentProfile.class}
  </li>
  </ul>
</div>
<h3 
  style={{
    textDecoration: 'underline', 
    marginBottom: '20px', 
    color: '#285A87', 
    fontSize: '20px', 
    fontWeight: 'semibold', 
    marginTop: '20px',
  }}
>
  Admin Details
</h3>
<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
<ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
<li style={{ marginBottom: '10px' }}>
  <strong>Student ID </strong>- {studentProfile?.Data?._id}
  </li>
  </ul>
</div>
<div style={{ marginBottom: '10px', marginTop: '20px', color: '#285A87', fontWeight: 'normal' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
    <li style={{ marginBottom: '10px' }}>
      <strong>Joining Date </strong>-
      {studentProfile?.Data?.userId?.createdAt }
       
    </li>
  </ul>
</div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
