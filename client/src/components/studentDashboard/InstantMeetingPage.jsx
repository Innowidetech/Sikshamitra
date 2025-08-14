import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTimetable } from '../../redux/student/timeTableSlice';
import {
  createMeeting,
  fetchConnects,
  resetSendStatus,
} from '../../redux/student/connectQueriesSlice';

const InstantMeetingPage = () => {
  const dispatch = useDispatch();
  const { timetable } = useSelector((state) => state.timeTable);
  const { sendStatus, error } = useSelector((state) => state.connectQueries);

  const [title, setTitle] = useState('');
  const [admin, setAdmin] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    dispatch(fetchTimetable());
  }, [dispatch]);

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
    return Array.from(teachersMap.entries());
  }, [timetable]);

  const handleTeacherCheck = (name) => {
    setSelectedTeachers((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.teacher-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleStatus = async () => {
      if (sendStatus === 'success') {
        toast.success('✅ Meeting link generated!');
        await dispatch(fetchConnects());
        setTitle('');
        setAdmin(false);
        setSelectedTeachers([]);
        dispatch(resetSendStatus());
      } else if (sendStatus === 'error') {
        toast.error(`❌ Failed to generate meeting link: ${error || ''}`);
        dispatch(resetSendStatus());
      }
    };
    handleStatus();
  }, [sendStatus, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warn('Please enter a meeting title.');
      return;
    }

    const attendants = [...(admin ? ['Admin'] : []), ...selectedTeachers];

    if (attendants.length === 0) {
      toast.warn('Please select at least one attendant.');
      return;
    }

    const payload = {
      title,
      attendants,
    };

    try {
      await dispatch(createMeeting(payload)).unwrap(); // 🔁 For instant meeting: no dates needed
    } catch (err) {
      toast.error('❌ Failed to create meeting.');
    }
  };

  return (
    <div className="h-screen w-full bg-white relative font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full bg-white text-black flex justify-between items-center px-4 py-2 text-sm absolute top-0 left-0 shadow">
        <span className="font-medium">&larr; Instant Meeting</span>
        <span>{currentTime}</span>
      </div>

      <div className="flex justify-center items-center h-full pt-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white border border-[#4C78FF] p-6 rounded-md shadow-md mt-10"
        >
          <h2 className="text-[#3E5FD7] font-semibold text-lg mb-4">Start Instant Meeting</h2>

          {/* Title input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-[#989898] rounded px-3 py-2 bg-[#1461921A]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Member Selection */}
          <h3 className="text-[#414141] font-semibold mb-2">Members</h3>
          <div className="flex gap-6 mb-6 items-start sm:items-center">
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

            <div className="relative teacher-dropdown w-[200px] text-sm font-medium">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-full border rounded px-2 py-1 bg-[#1461921A] flex justify-between items-center"
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
              className="bg-[#4C78FF] text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {sendStatus === 'loading' ? 'Generating...' : 'Generate Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstantMeetingPage;
