import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Calendar } from "lucide-react";
import Header from './layout/Header';
import { fetchAttendance, fetchNotices } from '../../redux/student/studashboardSlice';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function StudentDashboard() {
  const dispatch = useDispatch();
  const { attendance, notices } = useSelector((state) => state.studentDashboard);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    dispatch(fetchAttendance());
    dispatch(fetchNotices());
  }, [dispatch]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer
            ${day === new Date().getDate() ? 'bg-[#1982C4] text-white' : 'hover:bg-gray-100'}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mx-8 overflow-x-hidden">
        <div className="flex justify-between items-center py-6 px-8">
          <h1 className="text-xl font-bold text-[#1982C4] xl:text-[36px]" style={{ fontFamily: "Poppins" }}>
            Dashboard
          </h1>
        </div>
        <div className="relative flex items-center space-x-6">
          <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 text-[#146192] w-5 h-5" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#1982C4]/20 md:w-40 lg:w-64 shadow-[4px_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
        <div>
          <Header />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Overall Attendance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-[6px] border-[#1982C4] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#1982C4]">
                    {attendance.overall}%
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-sm text-gray-600 uppercase tracking-wider">MY OVERALL</h2>
                <h3 className="text-xl font-bold text-gray-800">ATTENDANCE</h3>
              </div>
            </div>
          </div>

          {/* Monthly Attendance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Monthly Attendance</h2>
            <div className="space-y-6">
              {attendance.monthly?.map((month, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-gray-600 font-medium">{month.name}</span>
                    <div className="text-xs text-gray-400">{month.days} attended</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1982C4] rounded-full transition-all duration-300"
                        style={{ width: `${month.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{month.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Calendar</h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  ‹
                </button>
                <span className="text-gray-600 font-medium">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
              {generateCalendarDays()}
            </div>
          </div>
        </div>

        {/* Notices Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Notices</h2>
          <div className="space-y-4 max-h-[800px] overflow-y-auto">
            {notices.data?.map((notice, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-[#1982C4]`}>
                    {notice.date}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;