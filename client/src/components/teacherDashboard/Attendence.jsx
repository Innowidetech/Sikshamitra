import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../adminDashboard/layout/Header';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaSearch, FaLink } from 'react-icons/fa';
import { fetchTeaAttendance } from '../../redux/teacher/teaAttendanceSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

function DonutChart({ attendanceData }) {
  const data = {
    labels: ['Present', 'Absent', 'Holidays'],
    datasets: [
      {
        label: 'Attendance',
        data: [
          attendanceData.present || 0,
          attendanceData.absent || 0,
          attendanceData.holiday || 0,
        ],
        backgroundColor: ['#4CAF50', '#F44336', '#FFEB3B'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="w-[250px] h-[250px]">
      <Doughnut data={data} options={options} />
    </div>
  );
}

const InfoBox = ({ label, value, bg }) => (
  <div className={`p-4 rounded-lg text-center shadow-md`} style={{ backgroundColor: bg }}>
    <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
    <p className="text-2xl font-bold text-[#146192]">{value}</p>
  </div>
);

const SelectSelector = ({ label, options, onChange, disabled, value }) => (
  <div className="flex-1">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <select
      className="w-full border px-4 py-2 rounded-lg bg-[#F5F5F5]"
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      value={value}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const DateSelector = ({ label, onChange, value, disabled }) => (
  <div className="flex-1">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type="date"
      className="w-full border px-4 py-2 rounded-lg bg-[#F5F5F5]"
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  </div>
);

function Attendence({ handleTabChange }) {
  const dispatch = useDispatch();
  const { loading, error, attendance } = useSelector((state) => state.teaAttendance);

  // Get today's date in yyyy-mm-dd format
  const todayStr = new Date().toISOString().slice(0, 10);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState(todayStr); // default today’s date
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false); // to trigger search on button click

  const monthMap = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
  };

  // Fetch attendance whenever filters change
  useEffect(() => {
    const query = {};
    if (date) query.date = date;
    if (month) query.month = monthMap[month];
    if (year) query.year = year;
    if (searchQuery) query.studentName = searchQuery;

    // Only fetch if at least one filter is active
    if (date || (month && year) || searchQuery) {
      dispatch(fetchTeaAttendance(query));
    }
  }, [dispatch, date, month, year, searchQuery]);

  // Extract student attendance records for table display
  const extractStudentRecords = (attendanceData) => {
    if (!Array.isArray(attendanceData)) return [];

    return attendanceData.flatMap((entry) => {
      if (Array.isArray(entry?.studentAttendance)) {
        return entry.studentAttendance.map((student) => ({
          ...student,
          date: student.date || entry.date,
        }));
      }
      return [];
    });
  };

  const allStudentRecords = extractStudentRecords(attendance);

  // Filter based on searchQuery (only if searchQuery present)
  const filteredByName = searchQuery
    ? allStudentRecords.filter((student) =>
        student?.student?.studentProfile?.fullname
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : allStudentRecords;

  // Filter by Date
  const filterDataByDate = (date) => {
    if (!date) return filteredByName;
    const formatted = new Date(date).toLocaleDateString();
    return filteredByName.filter(
      (student) =>
        new Date(student.date).toLocaleDateString() === formatted
    );
  };

  // Filter by Month + Year
  const filterDataByMonthYear = (month, year) => {
    if (!month || !year) return filteredByName;
    const monthNum = monthMap[month] - 1;
    return filteredByName.filter((student) => {
      const studentDate = new Date(student.date);
      return (
        studentDate.getMonth() === monthNum &&
        studentDate.getFullYear() === parseInt(year)
      );
    });
  };

  // Decide data to display in table and donut based on filters
  let displayData = [];

  if (date) {
    displayData = filterDataByDate(date);
  } else if (month && year) {
    displayData = filterDataByMonthYear(month, year);
  } else {
    displayData = filteredByName; // default if no date or month/year selected
  }

  // Compute summary stats for donut chart from displayData
  const summary = displayData.reduce(
    (acc, record) => {
      acc.total += 1;
      if (record.status === 'Present') acc.present += 1;
      else if (record.status === 'Absent') acc.absent += 1;
      else if (record.status === 'Holiday') acc.holiday += 1;
      return acc;
    },
    { total: 0, present: 0, absent: 0, holiday: 0 }
  );

  const noData = !displayData || displayData.length === 0;

  return (
    <>
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Attendance</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Attendance</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="mx-8 mt-10 md:ml-72">
        {/* Donut Chart and Stats */}
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 shadow-lg border rounded-xl">
          <div className="flex justify-center items-center min-h-[250px]">
            {loading ? (
              <div className="loader border-4 border-blue-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
            ) : noData ? (
              <p className="text-gray-500">{error || 'No attendance data available'}</p>
            ) : (
              <DonutChart attendanceData={summary} />
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <InfoBox label="Total" value={summary.total} bg="#E0F7FA" />
            <InfoBox label="Present" value={summary.present} bg="#E8F5E9" />
            <InfoBox label="Absent" value={summary.absent} bg="#FFEBEE" />
            <InfoBox label="Holiday" value={summary.holiday} bg="#FFF9C4" />
          </div>
        </div>

        {/* Mark Attendance Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 bg-white p-4 ">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <FaLink className="text-[#146192] text-xl" />
            <h2 className="text-lg font-semibold text-gray-800">Class Attendance Student List</h2>
          </div>
          <div>
            <button
              className="bg-[#146192] text-white px-6 py-3 rounded-lg shadow hover:bg-[#0e4a73] transition duration-300"
              onClick={() => handleTabChange('markattendance')}
            >
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow border flex flex-col sm:flex-row gap-4 w-full max-w-[900px]">
          <DateSelector
            label="Date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setMonth('');
              setYear('');
              setSearchQuery('');
            }}
            disabled={!!month || !!year}
          />
          <SelectSelector
            label="Month"
            value={month}
            options={Object.keys(monthMap)}
            onChange={(value) => {
              setMonth(value);
              setDate('');
              setSearchQuery('');
            }}
            disabled={!!date}
          />
          <SelectSelector
            label="Year"
            value={year}
            options={['2023', '2024', '2025', '2026']}
            onChange={(value) => {
              setYear(value);
              setDate('');
              setSearchQuery('');
            }}
            disabled={!!date}
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search Student"
              className="px-4 py-2 border rounded-lg w-60 mt-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setTriggerSearch(!triggerSearch);
              }}
              disabled={!!date || !!month || !!year}
            />
            <button
              className="bg-[#146192] text-white px-4 py-2 rounded-lg shadow hover:bg-[#0e4a73] transition duration-300 mt-6"
              onClick={() => setTriggerSearch(!triggerSearch)}
              disabled={!!date || !!month || !!year}
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-[#f5f5f5]">
              <tr>
                {[
                  'S.No', 'Student Name', 'Registration Number', 'Parent Name',
                  'Parent Mobile No.', 'Student Gender', 'Date', 'Status',
                ].map((heading) => (
                  <th key={heading} className="px-4 py-2 border font-medium text-gray-600">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center text-gray-500">Loading...</td>
                </tr>
              ) : noData ? (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center text-gray-500">
                    No data available for the selected filters.
                  </td>
                </tr>
              ) : (
                displayData.map((student, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{student.student.studentProfile.fullname}</td>
                    <td className="px-4 py-2 border">{student.student.studentProfile.registrationNumber}</td>
                    <td className="px-4 py-2 border">{student.parentProfile.fatherName}</td>
                    <td className="px-4 py-2 border">{student.parentProfile.fatherPhoneNumber}</td>
                    <td className="px-4 py-2 border">{student.student.studentProfile.gender}</td>
                    <td className="px-4 py-2 border">
                      {student.date ? new Date(student.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          student.status === 'Present'
                            ? 'bg-green-500'
                            : student.status === 'Absent'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Attendence;
