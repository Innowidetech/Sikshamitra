import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendNewQuery,
  resetSendStatus,
} from '../../redux/student/connectQueriesSlice';
import { fetchTimetable } from '../../redux/student/timetableSlice';
import contactImage from '../../assets/contact1.png';
import Header from './layout/Header';

const QueriesPage = () => {
  const dispatch = useDispatch();
  const { sendStatus, error } = useSelector((state) => state.connectQueries);
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
        {/* Top Header */}
        <div className="flex justify-between items-center mx-4 md:mx-8 flex-wrap gap-y-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xl">Home</span> {'>'}
              <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Connect & Queries</span>
            </h1>
          </div>

          
        </div>

        {/* Query Form */}
       <div className="bg-white rounded-lg shadow-lg mt-8 p-6 max-w-6xl mx-auto border border-blue-400">
  {/* Header + Top Buttons INSIDE box */}
  <div className="flex justify-between items-center mb-4">
    <div>
      <h2 className="text-xl font-semibold text-blue-700">Contact Us for Any Query!</h2>
      <p className="text-gray-600 text-sm">We are here for you! How can we help?</p>
    </div>
    <div className="flex gap-3">
      <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md">Queries</button>
      <button className="border border-[#1976D2] text-[#1976D2] px-4 py-2 rounded-md">Connect</button>
    </div>
  </div>
          

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block mb-1 text-sm">Parent Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Parent Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Parent Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Query</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 min-h-[120px]"
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

                <button
                  type="submit"
                  disabled={sendStatus === 'loading'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 mt-4"
                >
                  {sendStatus === 'loading' ? 'Sending...' : 'Send'}
                </button>

                {sendStatus === 'success' && (
                  <p className="text-green-600 text-sm mt-2">Query sent successfully!</p>
                )}
                {sendStatus === 'error' && (
                  <p className="text-red-600 text-sm mt-2">Error: {error}</p>
                )}
              </div>

              {/* Image */}
              <div className="hidden lg:block flex-1">
                <img
                  src={contactImage}
                  alt="Contact Illustration"
                  className="w-full max-w-xs mx-auto"
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
