import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import Header from './layout/Header';
import { fetchAttendance, fetchNotices } from '../../redux/student/studashboardSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { attendance, notices, loading, error } = useSelector((state) => state.studentDashboard);

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    // Fetch attendance and notices when the month/year changes
    dispatch(fetchAttendance({ month: selectedMonth, year: selectedYear }));
    dispatch(fetchNotices());
  }, [dispatch, selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  // Find the attendance data for the selected month
  const selectedAttendance = attendance.find(
    (item) => item.month === selectedMonth
  ) || { total: 100, present: 65, absent: 20, holidays: 5 };

  const formattedMonthYear = `MM_${selectedMonth.toString().padStart(2, '0')}_YYYY_${selectedYear}`;

  return (
    <div className="min-h-screen p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mx-8 overflow-x-hidden -mt-20">
        <h1 className="text-xl font-bold text-[#146192] xl:text-[36px]" style={{ fontFamily: 'Poppins' }}>
          Dashboard
        </h1>
        <div className="relative flex items-center space-x-6 ml-80">
          <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 text-[#146192] w-5 h-5" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#1982C4]/20 md:w-40 lg:w-64 shadow-[4px_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
        <Header />
      </div>

      {/* Attendance Section */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-6 border border-[#DBDBDB] mt-10">
        <h2 className="text-xl font-bold text-[#285A87] mb-3">Attendance</h2>

        <div className="flex gap-4">
          {/* Left Side: Pie Chart */}
          <div className="flex items-center justify-center w-1/3 p-4">
            <div className="w-24 h-24 bg-[#1982C4] rounded-full flex justify-center items-center text-white">
              <p className="text-sm">
                {selectedAttendance.total > 0
                  ? `${((selectedAttendance.present / selectedAttendance.total) * 100).toFixed(2)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          {/* Right Side: Attendance Data */}
          <div className="w-2/3 relative">
            <div className="flex gap-4 mb-4">
              <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                <h3 className="text-xs font-bold text-[#292929]">Total</h3>
                <p className="text-2xl font-bold text-[#5FE33E]">{selectedAttendance.total}</p>
              </div>
              <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                <h3 className="text-xs font-bold text-[#292929]">Present</h3>
                <p className="text-2xl font-bold text-[#5FE33E]">{selectedAttendance.present}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                <h3 className="text-xs font-bold text-[#292929]">Absent</h3>
                <p className="text-2xl font-bold text-[#5FE33E]">{selectedAttendance.absent}</p>
              </div>
              <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                <h3 className="text-xs font-bold text-[#292929]">Holidays</h3>
                <p className="text-2xl font-bold text-[#5FE33E]">{selectedAttendance.holidays}</p>
              </div>
            </div>

            {/* Month-Year Format */}
            <div className="absolute top-0 right-0 -mt-12 mr-2 bg-[#146192] text-white py-1 px-3 rounded-lg text-lg font-semibold">
              {formattedMonthYear}
            </div>
          </div>
        </div>

        {/* Month and Year Input Fields */}
        <div className="flex justify-between mt-6">
          <div className="flex items-center gap-4">
            <label htmlFor="month" className="text-[#1982C4] font-semibold">Enter Month (MM)</label>
            <input
              type="number"
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              min="1"
              max="12"
              className="p-2 rounded-md border border-[#DBDBDB] w-20"
              placeholder="MM"
            />
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="year" className="text-[#1982C4] font-semibold">Enter Year (YYYY)</label>
            <input
              type="number"
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="p-2 rounded-md border border-[#DBDBDB] w-32"
              placeholder="YYYY"
            />
          </div>
        </div>
      </div>

      {/* New Section: Today's Attendance */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-6 border border-[#DBDBDB] mt-10 min-h-[200px]">
  <h2 className="text-xl font-bold text-[#285A87] mb-3">Today's Attendance</h2>

  {/* Larger box to hold everything inside */}
  <div className="flex items-center justify-between pt-4 px-20 bg-[#F0F7FF]">

    {/* Left Side: Date */}
    <div className="flex items-center gap-4 w-1/3">
      <p className="text-[#285A87] font-bold text-2xl text-center">
        13th May <br /> 2024
      </p>
    </div>

    {/* Vertical Line */}
    <div className="border-l-4 border-[#1982C4] h-32"></div>

    {/* Right Side: Present Box */}
    <div className="flex items-center justify-center w-32 h-12 border-2 border-red-500 text-center text-red-500 font-bold rounded-full bg-white">
      Present
    </div>

  </div>



 
</div>
<div className="w-1/2 bg-white rounded-lg shadow-xl p-6 border border-[#DBDBDB] mt-10 min-h-[400px]">
<h2 className="text-xl font-bold text-[#000000] mb-3">Notices</h2>
<div className="w-full bg-[#14619259]  shadow-xl p-6 border border-[#14619259] mt-10 min-h-[150px]">
   <h2 className='text-xl font-bold text-[#000000] text-center'>Annual Sports Day   - 20th jan 2025</h2>
   <p className='text-xl font-poppins text-[#000000] text-center'>The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.</p>
</div>

<div className="w-full bg-[#FF9F1C80]  shadow-xl p-6 border border-[#FF9F1C80] mt-10 min-h-[150px]">
   <h2 className='text-xl font-bold text-[#000000] text-center'>Annual Sports Day   - 20th jan 2025</h2>
   <p className='text-xl font-poppins text-[#000000] text-center'>The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.</p>
</div>


</div>

    </div>
  );
};

export default StudentDashboard;
