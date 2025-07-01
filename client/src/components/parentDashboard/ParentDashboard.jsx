import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParentDetails, fetchCalendar } from '../../redux/parent/parentdashboardSlice';
import Header from './layout/Header';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from './Calendar';

ChartJS.register(ArcElement, Tooltip, Legend);

function ParentDashboard() {
  const dispatch = useDispatch();
  const { parent, students, calendar, loading, error } = useSelector((state) => state.parent);

  // Start with null, will set after students load
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentData, setSelectedStudentData] = useState(null);

  useEffect(() => {
    dispatch(fetchParentDetails());
    dispatch(fetchCalendar());
  }, [dispatch]);

  // When students load, set the default selected student as the first student
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].studentId);
      setSelectedStudentData(students[0]);
    }
  }, [students, selectedStudentId]);

  // When selectedStudentId changes, update selectedStudentData
  useEffect(() => {
    if (selectedStudentId) {
      const studentData = students.find((student) => student.studentId === selectedStudentId);
      setSelectedStudentData(studentData);
    }
  }, [selectedStudentId, students]);

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const pieData = {
    datasets: [
      {
        data: [
          selectedStudentData?.counts?.Present || 0,
          selectedStudentData?.counts?.Absent || 0,
          selectedStudentData?.counts?.Holiday || 0,
        ],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const handleCalendarEventAdded = () => {
    dispatch(fetchCalendar());
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 md:ml-56 mt-24">
      <Header />

      {/* Student selection dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mt-6 gap-2 sm:gap-4">
        <label htmlFor="student-dropdown" className="text-base md:text-lg font-semibold text-[#121313]">
          Select Student:
        </label>
        <select
          id="student-dropdown"
          value={selectedStudentId || ''}
          onChange={handleStudentChange}
          className="px-4 py-2 rounded-lg w-full sm:w-48 bg-[#D8E7F5]"
        >
          {students.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.student.studentProfile.fullname}
            </option>
          ))}
        </select>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 space-y-6">
          {selectedStudentData && (
            <div className="border rounded-md shadow-lg p-5">
              <h2 className="text-xl font-semibold mb-4">
                {selectedStudentData.student.studentProfile.fullname}&apos;s Attendance
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Pie Chart */}
                <div className="flex justify-center items-center sm:w-1/3">
                  <div className="relative w-32 h-32">
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,
                        plugins: { tooltip: { enabled: true } },
                        maintainAspectRatio: false,
                        aspectRatio: 1,
                        cutout: '70%',
                      }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white">
                      Attendance
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="sm:w-2/3 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center">
                      <h3 className="text-xs font-bold">Total Days</h3>
                      <p className="text-2xl font-bold text-[#5FE33E]">{selectedStudentData.totalDays}</p>
                    </div>
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center">
                      <h3 className="text-xs font-bold">Present</h3>
                      <p className="text-2xl font-bold text-[#5FE33E]">{selectedStudentData.counts.Present}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center">
                      <h3 className="text-xs font-bold">Absent</h3>
                      <p className="text-2xl font-bold text-[#5FE33E]">{selectedStudentData.counts.Absent}</p>
                    </div>
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center">
                      <h3 className="text-xs font-bold">Holiday</h3>
                      <p className="text-2xl font-bold text-[#5FE33E]">{selectedStudentData.counts.Holiday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notices */}
          <div className="border rounded-md shadow-lg p-5">
            <h2 className="text-xl font-semibold mb-4">Notices</h2>
            {selectedStudentData?.notices?.length > 0 ? (
              selectedStudentData.notices.map((notice, index) => {
                const bgColors = ['bg-[#14619259]', 'bg-[#FF9F1C80]', 'bg-[#14619259]'];
                const bgColor = bgColors[index % bgColors.length];

                return (
                  <div key={notice._id} className={`${bgColor} p-4 mb-4 rounded-lg shadow-lg`}>
                    <h3 className="font-bold text-center text-lg">{notice.title}</h3>
                    <p className="text-center font-medium text-black">{notice.createdByText}</p>
                    <p className="mt-2 text-center text-base">{notice.noticeMessage}</p>
                    <p className="text-xs text-black mt-2">{new Date(notice.date).toLocaleDateString()}</p>
                  </div>
                );
              })
            ) : (
              <p>No notices available.</p>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <Calendar events={calendar || []} onEventAdded={handleCalendarEventAdded} />
          </div>

          {selectedStudentData && (
            <div className="bg-white border shadow-md w-full p-2 rounded-lg">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={selectedStudentData.student.studentProfile.photo}
                  alt="Student"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-4"
                />
                <h2 className="text-lg md:text-xl font-semibold">{selectedStudentData.student.studentProfile.fullname}</h2>
                <p className="text-sm text-gray-500">
                  {selectedStudentData.student.studentProfile.class} - {selectedStudentData.student.studentProfile.section}
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#bad8ec] to-[#f8e3b7] shadow-lg rounded-lg p-4 border border-[#DBDBDB]">
                <h1 className="text-lg text-[#146192] font-bold underline mb-2">Personal Details</h1>
                <ul className="list-none space-y-1">
                  <li className="flex justify-between">
                    <span className="text-[#146192]">Name:</span>
                    <span>{selectedStudentData.student.studentProfile.fullname}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#146192]">Email:</span>
                    <span>{selectedStudentData.student.userId?.email}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#146192]">Date of Birth:</span>
                    <span>{new Date(selectedStudentData.student.studentProfile.dob).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#146192]">Address:</span>
                    <span>{selectedStudentData.student.studentProfile.address}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#146192]">Phone:</span>
                    <span>{selectedStudentData.student.studentProfile.registrationphone}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#146192]">Gender:</span>
                    <span>{selectedStudentData.student.studentProfile.gender}</span>
                  </li>

                  {/* Previous Education */}
                  <li>
                    <span className="font-bold text-lg underline text-[#146192] mt-4 block">
                      Previous Education:
                    </span>
                    <div>
                      {selectedStudentData.student.studentProfile.previousEducation.length > 0 ? (
                        selectedStudentData.student.studentProfile.previousEducation.map((edu) => (
                          <div key={edu._id} className="mt-2">
                            <div className="flex justify-between text-[#146192]">
                              <span>School Name:</span>
                              <span className='text-black'>{edu.schoolName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-[#146192]">
                              <span>Duration:</span>
                              <span className='text-black'>{edu.duration || 'N/A'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No previous education details available.</p>
                      )}
                    </div>
                  </li>


                  {/* Student Details */}
                  <li>
                    <span className="font-bold text-lg underline text-[#146192] block mt-4">Student Details:</span>
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between">
                        <span className="text-[#146192]">Registration Number:</span>
                        <span>{selectedStudentData.student.studentProfile.registrationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#146192]">Joining Date:</span>
                        <span>{new Date(selectedStudentData.student.createdAt).toLocaleDateString()}</span>
                      </div>

                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
