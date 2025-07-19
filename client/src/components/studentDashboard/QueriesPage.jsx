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
    const recipients = [
      ...(sendToAdmin ? ['Admin'] : []),
      ...selectedTeachers,
    ];
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
   <div className="p-6">
  <div className="p-4">
    {/* Desktop & Tablet Header */}
    <div className="hidden md:flex justify-between items-start md:items-center -mt-20" >
      {/* Title + Breadcrumb */}
      <div>
        <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Connect & Queries</h1>
        <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
        <h1 className="mt-1 text-sm sm:text-base">
          <span>Home</span> {'>'}{' '}
          <span className="font-medium text-[#146192]">Connect & Queries</span>
        </h1>
      </div>

      {/* Right Side (Add Header or Any Element Here) */}
      <div>
        {/* <Header /> */}
      </div>
    </div>


        {/* Query Form */}
    <div className="bg-white mt-4 md:mt-20 mx-4 md:mx-8 p-6 rounded-xl shadow-md">
      {/* Heading & Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#146192]">Contact Us for Any Query!</h2>
          <p className="text-gray-600 text-sm">We are here for you! How can we help?</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#1982C4] text-white px-4 py-2 rounded-md">Queries</button>
          <button className="border border-[#1982C4] text-[#1982C4] px-4 py-2 rounded-md" onClick={() => navigate('/connect')}>Connect</button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col-reverse lg:flex-row gap-8 items-center">
          {/* Form Fields */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Query</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px]"
                required
              />
            </div>

            {/* Send To */}
            <div>
              <label className="block mb-1 text-sm">Send to</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sendToAdmin}
                    onChange={(e) => setSendToAdmin(e.target.checked)}
                  />
                  Admin
                </label>

                <div className="relative teacher-dropdown w-[200px] text-sm font-medium">
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

            {/* Submit Button */}
            <div className="text-center ">
              <button
                type="submit"
                disabled={sendStatus === 'loading'}
                className="bg-[#146192] text-white px-6 py-2 rounded-md hover:bg-blue-700 mt-4"
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

          {/* Image */}
          <div className="flex justify-center lg:block mb-6 lg:mb-0 mt-6 md:mt-2">
            <img
              src={contactImage}
              alt="Contact Illustration"
              className="w-[180px] sm:w-[200px] lg:w-full max-w-xs"
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
