import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './layout/Header';
import {
  fetchProfile,
  fetchAttendance,
  fetchNotices,
  fetchCalendar,
} from '../../redux/student/studashboardSlice';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const {
    profile,
    attendance,
    notices,
    calendar,
  } = useSelector((state) => state.studentDashboard);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchNotices());
    dispatch(fetchCalendar());
  }, [dispatch]);

  useEffect(() => {
    if (month && year) {
      dispatch(fetchAttendance({ month, year }));
    } else {
      dispatch(fetchAttendance());
    }
  }, [month, year, dispatch]);

  const monthlySummary = attendance?.monthlySummary || {};
  const {
    totalDays = 0,
    present = 0,
    absent = 0,
    holiday = 0,
    presentPercentage = '0%',
  } = monthlySummary;

  const attendanceData = {
    labels: ['Present', 'Absent', 'Holiday'],
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

  const calendarData = Array.isArray(calendar) ? calendar : [];

  const todayDate = attendance?.todayDate || 'No date';
  const todayAttendance = attendance?.todayAttendance || 'No Record';

  const handleDateClick = (date) => {
    const eventOnDate = calendarData.find(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
    if (eventOnDate) {
      setSelectedDate(date);
      setSelectedEvent(eventOnDate);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };

  return (
    <>
      {/* Responsive Page Header */}
      <div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Dashboard</h1>
          <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-1 text-sm sm:text-base">
            <span>Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192]">Dashboard</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Header for Mobile */}
      <div className="md:hidden px-4 mb-4">
        <Header />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Left Side */}
        <div className="flex-1">

          {/* Attendance */}
          <div className="border rounded-md shadow-lg p-5 mb-6 bg-white ">
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

            {totalDays > 0 ? (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex justify-center items-center w-full lg:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32">
                      <Pie data={attendanceData} options={pieChartOptions} />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-black">
                        {presentPercentage}
                      </div>
                    </div>
                    <p className="text-sm mt-2 font-medium text-center">Present Percentage</p>
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
            ) : (
              <div className="text-center text-gray-500 font-medium">No attendance data available.</div>
            )}
          </div>

          {/* Today's Attendance */}
          <div className="bg-[#f9f9f9] border rounded-md p-4 mb-6">
            <h3 className="text-[#285A87] text-lg font-bold mb-2">Today's Attendance</h3>
            <div className="flex items-center justify-between bg-[#F0F7FF] rounded-md p-4 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black transform -translate-x-1/2" />
              <p className="flex-1 text-center font-semibold">{todayDate}</p>
              <p className="flex-1 text-center font-semibold">{todayAttendance}</p>
            </div>
          </div>

     <div className="w-full px-2 sm:px-4 md:px-8 lg:px-16 py-4 flex justify-center items-center">
  <div className={`w-full max-w-[320px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[750px] xl:max-w-[850px] ${showPopup ? 'blur-sm pointer-events-none' : ''}`}>
    <div className="shadow-lg rounded-xl p-3 bg-white w-full">
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          const eventOnDate = calendarData.some(
            (event) => new Date(event.date).toDateString() === date.toDateString()
          );
          return eventOnDate ? 'bg-[#FFE082] rounded-md text-black font-bold' : '';
        }}
        className="w-full text-sm sm:text-base"
      />
    </div>
  </div>

  {/* Popup for Event Details */}
  {showPopup && selectedEvent && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
        <h3 className="text-lg font-bold mb-2">Event Details:</h3>
        <p><strong>Title:</strong> {selectedEvent.title}</p>
        <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#146192] text-white rounded hover:bg-[#0e3e62] w-full"
          onClick={closePopup}
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>


          {/* Notices */}
          <div className="bg-white rounded-lg shadow-xl p-6 border mb-6 min-h-[300px] mt-5">
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
        </div>

        {/* Profile Section */}
        <div className="w-full lg:w-1/3 border rounded-lg p-6 shadow-md bg-white h-1/2">
          <div className="text-center mb-4">
            <img
              src={profile?.Data?.studentProfile?.photo || 'default-profile.jpg'}
              alt="Profile"
              className="mx-auto rounded-full w-32 h-32 object-cover"
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
    </>
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
  <div className="flex justify-between text-sm mb-2">
    <span className="font-semibold">{label}:</span>
    <span>{value || 'N/A'}</span>
  </div>
);

export default StudentDashboard;
