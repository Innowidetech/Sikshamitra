import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParentDetails, fetchCalendar } from '../../redux/parent/parentdashboardSlice';
import Header from './layout/Header';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from './Calendar';

// Register chart elements for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

function ParentDashboard() {
  const dispatch = useDispatch();
  const { parent, students, calendar, loading, error } = useSelector((state) => state.parent);

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || null); // Default to first student
  const [selectedStudentData, setSelectedStudentData] = useState(students[0] || null);

  useEffect(() => {
    // Fetch both parent details and calendar events when component mounts
    dispatch(fetchParentDetails());
    dispatch(fetchCalendar());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStudentId) {
      const studentData = students.find((student) => student.studentId === selectedStudentId);
      setSelectedStudentData(studentData);
    }
  }, [selectedStudentId, students]);

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value); // Update selected student by ID
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
    <div>
      <Header />

      {/* Dropdown to select student */}
      <div className="flex justify-start items-center mx-8 mt-6">
        <label htmlFor="student-dropdown" className="text-lg font-semibold text-[#121313]">
          Select Student:
        </label>
        <select
          id="student-dropdown"
          value={selectedStudentId}
          onChange={handleStudentChange}
          className="ml-4 px-4 py-2 rounded-lg w-48 bg-[#D8E7F5]"
        >
          {students.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.student.studentProfile.fullname}
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <div className="flex mx-8 mt-6">
        {/* Left side: Attendance and Notices */}
        <div className="w-1/2">
          {selectedStudentData && (
            <div className="attendance-section border rounded-md shadow-lg p-5">
              <h2 className="text-xl font-semibold">{selectedStudentData.student.studentProfile.fullname}'s Attendance</h2>
              <div className="flex gap-4 mb-4">
                {/* Donut Chart */}
                <div className="w-1/3 flex justify-center items-center">
                  <div className="relative w-32 h-32">
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,
                        plugins: {
                          tooltip: {
                            enabled: true,
                          },
                        },
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

                {/* Attendance data */}
                <div className="w-2/3">
                  <div className="flex gap-4 mb-4">
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

          {/* Notices section below Attendance */}
          <div className="notices-section mt-6 border rounded-md shadow-lg p-5">
            <h2 className="text-xl font-semibold mb-4">Notices</h2>
            {selectedStudentData?.notices?.length > 0 ? (
              selectedStudentData.notices.map((notice, index) => {
                const bgColors = [
                  "bg-[#14619259]",
                  "bg-[#FF9F1C80]",
                  "bg-[#14619259]",
                ];

                const bgColor = bgColors[index % bgColors.length];

                return (
                  <div key={notice._id} className={`${bgColor} p-4 mb-4 rounded-lg shadow-lg`}>
                    <h3 className="font-bold text-center text-lg">{notice.title}</h3>
                    <p className="text-semibold text-[#000000] text-center">{notice.createdByText}</p>
                    <p className=" mt-2 text-center text-base">{notice.noticeMessage}</p>
                    <p className="text-xs text-[#000000]  mt-2">{new Date(notice.date).toLocaleDateString()}</p>
                  </div>
                );
              })
            ) : (
              <p>No notices available.</p>
            )}
          </div>
        </div>

        {/* Right side: Student Details */}
        <div className="w-1/2 pl-6">
          <div className="bg-white rounded-lg shadow mb-5">
            <Calendar
              events={calendar || []}
              onEventAdded={handleCalendarEventAdded}
            />
          </div>
          {selectedStudentData && (
            <div className="bg-white border shadow-md p-7 rounded-lg">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={selectedStudentData.student.studentProfile.photo}
                  alt="Student"
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold">
                  {selectedStudentData.student.studentProfile.fullname}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedStudentData.student.studentProfile.class} - {selectedStudentData.student.studentProfile.section}
                </p>
              </div>

              {/* Personal details in an unordered list format */}
              <div className="bg-gradient-to-r from-[#bad8ec] to-[#f8e3b7] shadow-lg rounded-lg p-6 border border-[#DBDBDB]">
              <h1 className='text-lg text-[#146192] font-bold  underline'>Personal Details</h1>

                <ul className="list-none">
                  <li className="flex justify-between py-1">
                    <span className=" text-[#146192]">Name:</span>
                    <span>{selectedStudentData.student.studentProfile.fullname}</span>
                  </li>

                  <li className="flex justify-between py-1">
  <span className="text-[#146192]">Email:</span>
  <span>{selectedStudentData?.student?.userId?.email}</span>
</li>


                  <li className="flex justify-between py-1">
                    <span className=" text-[#146192]">Date of Birth:</span>
                    <span>{new Date(selectedStudentData.student.studentProfile.dob).toLocaleDateString()}</span>
                  </li>

                  <li className="flex justify-between py-1">
                    <span className=" text-[#146192]">Address:</span>
                    <span>{selectedStudentData.student.studentProfile.address}</span>
                  </li>

                  <li className="flex justify-between py-1">
                    <span className=" text-[#146192] ">Phone:</span>
                    <span>{selectedStudentData.student.studentProfile.registrationphone}</span>
                  </li>

                  <li className="flex justify-between py-1">
                    <span className=" text-[#146192]" >Gender:</span>
                    <span>{selectedStudentData.student.studentProfile.gender}</span>
                  </li>

                  

                  {/* Previous Education */}
                  <li className="mb-4">
                    <span className=" font-bold text-lg  underline text-[#146192]">Previous Education:</span>
                    <div>
                      {selectedStudentData.student.studentProfile.previousEducation.length > 0 ? (
                        selectedStudentData.student.studentProfile.previousEducation.map((edu, index) => (
                          <div key={edu._id} className="mb-2">
                            <ul>
                              <li className="flex justify-between py-1">
                                <span className='text-[#146192]'>School Name:{edu.schoolName || "N/A"}</span>
                              </li>
                              <li className="flex justify-between py-1">
                                <span className='text-[#146192]'>Duration:{edu.duration || "N/A"}</span>
                              </li>
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p>No previous education details available.</p>
                      )}
                    </div>
                  </li>

                  {/* About section */}
                  <span className=" font-bold text-lg  underline text-[#146192]">Students Details:</span>
                  <li className=" flex justify-between py-1">
                    <span className="text-[#146192]">Registration Number:</span>
                    <p>{selectedStudentData.student.studentProfile.registrationNumber}</p>
                  </li>
                  <li className=" flex justify-between py-1">
                    <span className="text-[#146192]">Joining Date:</span>
                    <p>{selectedStudentData.student.studentProfile.joiningDate}</p>
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
