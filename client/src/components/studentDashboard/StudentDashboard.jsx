import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  fetchAttendance,
  fetchNotices,
  fetchCalendar,
} from '../../redux/student/studashboardSlice';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const {
    profile,
    attendance,
    notices,
    calendar,
    loading,
    error,
  } = useSelector((state) => state.studentDashboard);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchNotices());
    dispatch(fetchCalendar());
  }, [dispatch]);

  useEffect(() => {
    if (month && year) {
      dispatch(fetchAttendance({ month, year }));
    }
  }, [month, year, dispatch]);

  const monthlySummary = attendance?.monthlySummary || {};
  const { totalDays, present, absent, holiday, presentPercentage } = monthlySummary;

  const attendanceData = {
    labels: [],
    datasets: [
      {
        data: [present, absent, holiday],
        backgroundColor: ['#5FE33E', '#F44336', '#FFC107'],
        borderColor: ['#5FE33E', '#F44336', '#FFC107'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutout: '70%',
  };

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const calendarData = Array.isArray(calendar?.calendars) ? calendar.calendars : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Side */}
      <div className="flex-1">
        {/* Attendance */}
        <div className="border rounded-md shadow-lg p-5 mb-6 bg-white">
          <h3 className="text-[#285A87] text-xl font-bold mb-4">Attendance</h3>
          <div className="flex flex-wrap justify-end items-center mb-4 gap-4">
            <div>
              <label htmlFor="month" className="mr-2">Month:</label>
              <select
                id="month"
                value={month}
                onChange={handleMonthChange}
                className="p-2 bg-[#146192] text-white rounded"
              >
                <option value="">Select Month</option>
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="mr-2">Year:</label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={handleYearChange}
                className="p-2 bg-[#146192] text-white rounded w-32"
              />
            </div>
          </div>

          {month && year && (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex justify-center items-center w-full lg:w-1/3">
                <div className="relative w-32 h-32">
                  <Pie data={attendanceData} options={pieChartOptions} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-black">
                    {presentPercentage ? `${presentPercentage}` : 'No data'}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/3 space-y-4">
                <div className="flex gap-4">
                  <InfoCard label="Total Days" value={totalDays} color="#5FE33E" />
                  <InfoCard label="Present" value={present} color="#5FE33E" />
                </div>
                <div className="flex gap-4">
                  <InfoCard label="Absent" value={absent} color="#F44336" />
                  <InfoCard label="Holiday" value={holiday} color="#FFC107" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Today's Attendance */}
        <div className="bg-[#f9f9f9] border rounded-md p-4 mb-6">
          <h3 className="text-[#285A87] text-lg font-bold mb-2">Today's Attendance</h3>
          <div className="flex items-center justify-between bg-[#F0F7FF] rounded-md p-4 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black transform -translate-x-1/2" />
            <p className="flex-1 text-center font-semibold">{attendance?.todayDate || 'No date'}</p>
            <p className="flex-1 text-center font-semibold">
              {attendance?.todayAttendance || 'No Record'}
            </p>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-lg shadow-xl p-6 border mb-6 min-h-[300px]">
          <h2 className="text-xl font-bold text-[#000000] mb-3">Notices</h2>
          {Array.isArray(notices) && notices.length > 0 ? (
            notices.map((notice, index) => (
              <div
                key={notice._id}
                className={`shadow p-4 border rounded-lg mb-4 ${index % 2 === 0 ? 'bg-[#14619259] border-[#14619259]' : 'bg-[#FF9F1C80] border-[#FF9F1C80]'}`}
              >
                <h3 className="text-lg font-bold text-center">
                  {notice.title} - {new Date(notice.date).toLocaleDateString()}
                </h3>
                <p className="text-center">{notice.noticeMessage}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No notices available.</p>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-xl p-6 border min-h-[300px]">
          <h2 className="text-xl font-bold text-[#000000] mb-3">Academic Calendar</h2>
          {calendarData.length > 0 ? (
            calendarData.map((event) => (
              <div
                key={event._id}
                className="shadow p-4 border border-[#14619259] rounded-md mb-4 bg-[#E6F0FA]"
              >
                <h3 className="text-lg font-semibold text-[#146192]">
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </h3>
                <p className="text-sm text-[#333]">{event.description}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No calendar events available.</p>
          )}
        </div>
      </div>

      {/* Right Side - Profile */}
      <div className="w-full lg:w-1/3 border rounded-lg p-6 shadow-md bg-white h-1/2">
        <div className="text-center mb-4">
          <img
            src={profile?.Data?.studentProfile?.photo || 'default-profile.jpg'}
            alt="Profile"
            className="mx-auto rounded-full w-32 h-32 "
          />
          <h2 className="mt-4 text-lg font-bold">{profile?.Data?.studentProfile?.fullname || 'Name Not Available'}</h2>
        </div>
        <div className="bg-gradient-to-r from-[#bad8ec] to-[#f8e3b7] p-4 rounded-lg shadow-inner">
          <Section title="Personal Details">
            <Detail label="Name" value={profile?.Data?.studentProfile?.fullname} />
            <Detail label="Email" value={profile?.Data?.userId?.email} />
            <Detail label="Date of Birth" value={profile?.Data?.studentProfile?.dob && new Date(profile.Data.studentProfile.dob).toLocaleDateString()} />
            <Detail label="Address" value={profile?.Data?.studentProfile?.address} />
            <Detail label="Phone" value={profile?.ParentData?.parentProfile?.fatherPhoneNumber} />
            <Detail label="Gender" value={profile?.Data?.studentProfile?.gender} />
          </Section>

          <Section title="Previous Education">
            {profile?.Data?.studentProfile?.previousEducation?.length > 0 ? (
              profile.Data.studentProfile.previousEducation.map((edu) => (
                <div key={edu._id} className="mb-2">
                  <Detail label="School Name" value={edu.schoolName} />
                  <Detail label="Duration" value={edu.duration} />
                </div>
              ))
            ) : (
              <p>No previous education details available.</p>
            )}
          </Section>

          <Section title="Admin Details">
            <Detail label="Student ID" value={profile?.Data?.userId?._id} />
            <Detail label="Joining Date" value={profile?.Data?.studentProfile?.joiningDate} />
          </Section>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, color }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 text-center flex-1">
    <h3 className="text-sm font-bold">{label}</h3>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h1 className="text-lg text-[#146192] font-bold underline mb-3">{title}</h1>
    <div>{children}</div>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="text-[#146192]">{label}:</span>
    <span>{value || 'N/A'}</span>
  </div>
);

export default StudentDashboard;
