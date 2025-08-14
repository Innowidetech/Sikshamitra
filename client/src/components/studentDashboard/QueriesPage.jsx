import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendNewQuery,
  resetSendStatus,
} from '../../redux/student/connectQueriesSlice';
import { fetchTimetable } from '../../redux/student/timeTableSlice';
import contactImage from '../../assets/contact1.png';
import Header from './layout/Header';
import { useNavigate } from 'react-router-dom';

const QueriesPage = () => {
  const dispatch = useDispatch();
  const { sendStatus, error } = useSelector((state) => state.connectQueries);
  const navigate = useNavigate();
  const { timetable } = useSelector((state) => state.timeTable);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    message: '',
    sendTo: [],
  });

  const [sendToAdmin, setSendToAdmin] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchTimetable());
  }, [dispatch]);

  const teacherList = useMemo(() => {
    const teachers = new Map();
    const timetableData = timetable?.classTimetable?.timetable;

    if (timetableData && typeof timetableData === 'object') {
      Object.values(timetableData).forEach((periods) => {
        periods?.forEach((period) => {
          const name = period?.teacher?.profile?.fullname;
          const subject = period?.subject;

          if (name && subject) {
            if (teachers.has(name)) {
              const subjects = teachers.get(name);
              if (!subjects.includes(subject)) {
                teachers.set(name, [...subjects, subject]);
              }
            } else {
              teachers.set(name, [subject]);
            }
          }
        });
      });
    }

    return Array.from(teachers.entries()); // [[name, ['Math']], ...]
  }, [timetable]);

  useEffect(() => {
    const recipients = [...(sendToAdmin ? ['Admin'] : []), ...selectedTeachers];
    setFormData((prev) => ({ ...prev, sendTo: recipients }));
  }, [sendToAdmin, selectedTeachers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeacherCheck = (name) => {
    setSelectedTeachers((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message || formData.sendTo.length === 0) {
      alert('Please enter a message and select at least one recipient.');
      return;
    }

    dispatch(sendNewQuery(formData)).then(() => {
      setFormData({
        name: '',
        contact: '',
        email: '',
        message: '',
        sendTo: [],
      });
      setSendToAdmin(false);
      setSelectedTeachers([]);
      setShowDropdown(false);
      setTimeout(() => dispatch(resetSendStatus()), 3000);
    });
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

  return (
    <div className="p-4 sm:p-6">
      <div className="p-2 sm:p-4">
        {/* Header (hidden on mobile) */}
        <div className="hidden md:flex justify-between items-start md:items-center -mt-20">
          <div>
            <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Connect & Queries</h1>
            <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
            <h1 className="mt-1 text-sm sm:text-base">
              <span>Home</span> {'>'}{' '}
              <span className="font-medium text-[#146192]">Connect & Queries</span>
            </h1>
          </div>
        </div>

        {/* Form Wrapper */}
        <div className="bg-white mt-4 md:mt-20 mx-2 sm:mx-4 md:mx-8 p-4 sm:p-6 rounded-xl shadow-md">
          {/* Heading & Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#146192]">Contact Us for Any Query!</h2>
              <p className="text-gray-600 text-sm">We are here for you! How can we help?</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="bg-[#1982C4] text-white px-4 py-2 rounded-md text-sm">Queries</button>
              <button
                className="border border-[#1982C4] text-[#1982C4] px-4 py-2 rounded-md text-sm"
                onClick={() => navigate('/connect')}
              >
                Connect
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-start">
              {/* Left Form Side */}
              <div className="flex-1 w-full space-y-4">
                {['name', 'contact', 'email'].map((field) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm capitalize">{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block mb-1 text-sm">Query</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Send to</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={sendToAdmin}
                        onChange={(e) => setSendToAdmin(e.target.checked)}
                      />
                      Admin
                    </label>

                    <div className="relative teacher-dropdown w-full sm:w-[200px] text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="w-full border border-gray-300 rounded px-2 py-1 bg-white flex justify-between items-center"
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
                              <span className="text-gray-500">
                                {subjects.join(', ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={sendStatus === 'loading'}
                    className="bg-[#146192] text-white px-6 py-2 rounded-md hover:bg-blue-700 mt-4 text-sm"
                  >
                    {sendStatus === 'loading' ? 'Sending...' : 'Send'}
                  </button>
                </div>

                {sendStatus === 'success' && (
                  <p className="text-green-600 text-sm mt-2 text-center">Query sent successfully!</p>
                )}
                {sendStatus === 'error' && (
                  <p className="text-red-600 text-sm mt-2 text-center">Error: {error}</p>
                )}
              </div>

              {/* Image Right */}
              <div className="flex justify-center w-full lg:w-auto lg:block mt-6 lg:mt-0">
                <img
                  src={contactImage}
                  alt="Contact Illustration"
                  className="w-[160px] sm:w-[200px] lg:w-full max-w-xs"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;
