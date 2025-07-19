import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTimetable } from '../../redux/student/timeTableSlice';
import { createMeeting, fetchConnects } from '../../redux/student/connectQueriesSlice';

const SchedulePage = () => {
  const dispatch = useDispatch();
  const { timetable } = useSelector((state) => state.timeTable);
  const { sendStatus } = useSelector((state) => state.connectQueries);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [admin, setAdmin] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Fetch timetable on mount
  useEffect(() => {
    dispatch(fetchTimetable());
  }, [dispatch]);

  // Clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const weekday = now.toLocaleDateString([], { weekday: 'long' });
      const date = now.toLocaleDateString([], { month: 'long', day: 'numeric' });
      setCurrentTime(`${time}, ${weekday}, ${date}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Extract unique teachers and their subjects
  const teacherList = useMemo(() => {
    const teachersMap = new Map();
    const timetableData = timetable?.classTimetable?.timetable;

    if (timetableData && typeof timetableData === 'object') {
      Object.values(timetableData).forEach((periods) => {
        periods?.forEach((period) => {
          const name =
            period?.teacher?.profile?.fullname ||
            period?.teacher?.fullname ||
            period?.teacher?.name ||
            null;
          const subject = period?.subject;

          if (name && subject) {
            if (teachersMap.has(name)) {
              const subjects = teachersMap.get(name);
              if (!subjects.includes(subject)) {
                teachersMap.set(name, [...subjects, subject]);
              }
            } else {
              teachersMap.set(name, [subject]);
            }
          }
        });
      });
    }

    return Array.from(teachersMap.entries()); // [ [name, [subject1, subject2]], ... ]
  }, [timetable]);

  // Handle teacher checkbox toggle
  const handleTeacherCheck = (name) => {
    setSelectedTeachers((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  // Close teacher dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.teacher-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Format date to yyyy-mm-dd
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Format time to hh:mm AM/PM
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  // Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();

  const attendants = [...(admin ? ['Admin'] : []), ...selectedTeachers];

  const payload = {
    title,
    attendants,
    startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
    endDate: endDate.toISOString().split('T')[0],     // YYYY-MM-DD
    startTime: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // HH:mm
    endTime: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })      // HH:mm
  };

  try {
    await dispatch(createMeeting(payload)).unwrap();
    toast.success('🎉 Meeting scheduled successfully!');
    dispatch(fetchConnects()); // Fetch updated meetings list
  } catch (err) {
    toast.error('❌ Failed to schedule meeting.');
  }
};


  return (
    <div className="h-screen w-full bg-white relative font-sans">
      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

     {/* Top bar */}
<div className="w-full bg-white text-black flex justify-between items-center px-4 py-2 text-sm absolute top-0 left-0 shadow">
  <span
    onClick={() => navigate(-1)} // Go back to previous page
    className="font-medium cursor-pointer hover:underline"
  >
    &larr; Meet
  </span>
  <span>{currentTime}</span>
</div>


      {/* Form content */}
      <div className="flex justify-center items-center h-full pt-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white border border-blue-400 p-6 rounded-md shadow-md mt-10"
        >
          <h2 className="text-blue-700 font-semibold text-lg mb-4">Schedule a Meeting</h2>

          {/* Title input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-[#1461921A]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Time selection */}
          <h3 className="text-blue-700 font-semibold mb-2">Add your time</h3>
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium">Start time of meeting</label>
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="border rounded px-3 py-1 bg-[#1461921A]"
                  dateFormat="d MMM, yyyy"
                />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="border rounded px-3 py-1 bg-[#1461921A]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">End time of meeting</label>
              <div className="flex gap-2">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="border rounded px-3 py-1 bg-[#1461921A]"
                  dateFormat="d MMM, yyyy"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="border rounded px-3 py-1 bg-[#1461921A]"
                />
              </div>
            </div>
          </div>

          {/* Members selection */}
          <h3 className="text-blue-700 font-semibold mb-2">Members</h3>
          <div className="flex gap-6 mb-6 items-start sm:items-center">
            {/* Admin Checkbox */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="adminCheckbox"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="adminCheckbox" className="text-sm font-medium">
                Admin
              </label>
            </div>

            {/* Teacher Dropdown */}
            <div className="relative teacher-dropdown w-[200px] text-sm font-medium">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-full border rounded px-2 py-1 bg-white flex justify-between items-center"
              >
                {selectedTeachers.length === 0
                  ? 'Select Teachers'
                  : `${selectedTeachers.length} selected`}
                <span className="ml-2">&#9662;</span>
              </button>

              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-40 overflow-y-auto">
                  {teacherList.map(([name, subjects], idx) => (
                    <label
                      key={idx}
                      className="block px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(name)}
                        onChange={() => handleTeacherCheck(name)}
                        className="mr-2"
                      />
                      {name} —{' '}
                      <span className="text-gray-500">{subjects.join(', ')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={sendStatus === 'loading'}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {sendStatus === 'loading' ? 'Scheduling...' : 'Generate Meet Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulePage;
