import React, { useState } from 'react';
import Header from '../adminDashboard/layout/Header';
import { FaGraduationCap, FaClipboardList, FaEdit, FaTrash } from 'react-icons/fa';

function TeacherDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState({
    title: '',
    date: '',
    description: '',
  });

  const handleChange = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  const handleCreateNotice = () => {
    console.log('Notice created:', notice);
    setShowModal(false);
    setNotice({ title: '', date: '', description: '' });
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 md:ml-56 mt-10">
      <Header />

      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 pt-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">Dashboard</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-2 text-base sm:text-lg">
            <span>Home</span> {">"} <span className="font-medium text-[#146192]">Dashboard</span>
          </h1>
        </div>
      </div>

      {/* Stats and Content */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mx-4 md:mx-8 mt-8">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <FaGraduationCap className="text-yellow-500 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <h2 className="text-xl font-bold">250</h2>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <FaClipboardList className="text-green-600 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Total Exams</p>
                <h2 className="text-xl font-bold">250</h2>
              </div>
            </div>
          </div>

          {/* Notices */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#146192]">Notices</h3>
              <button
                className="bg-[#146192] text-white px-4 py-2 text-sm rounded hover:bg-[#0f4a6f]"
                onClick={() => setShowModal(true)}
              >
                Create Notice
              </button>
            </div>

            {/* Sample Notices */}
            {[{
              title: 'Annual Sports Day - 20th Jan 2025',
              description: 'The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.',
            }, {
              title: 'Inter-School Debate Competition - 22nd Jan 2025',
              description: 'The Inter-School Debate Competition on January 22, 2025, showcases students\' critical thinking and public speaking skills through engaging discussions on key topics.',
            }].map((item, idx) => (
              <div key={idx} className="mb-6">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-semibold bg-gray-100 px-2 py-1 rounded">
                    {idx + 1}. {item.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" />
                    <FaTrash className="text-red-500 cursor-pointer" />
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Calendar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">School Dynamic Calendar</h3>
            <div className="bg-white text-black rounded-lg p-4">
              <div className="grid grid-cols-7 text-sm text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-semibold">{day}</div>
                ))}
                {[...Array(35)].map((_, i) => {
                  const day = i - 1;
                  const date = day > 0 ? day : '';
                  const highlight = day === 20 || day === 22;
                  return (
                    <div
                      key={i}
                      className={`h-10 flex items-center justify-center rounded-lg ${highlight ? 'bg-yellow-300 font-bold' : ''}`}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <div className="bg-[#146192] text-white p-2 rounded-md text-xs">
                  <strong>20 Jan 2025</strong>: Inter School Debate Competition
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg">
            <div className="bg-[#146192] text-white text-lg font-semibold p-4 rounded-t-lg">
              Create Notice
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Notice Title</label>
                  <input
                    type="text"
                    name="title"
                    value={notice.title}
                    onChange={handleChange}
                    placeholder="Title name"
                    className="w-full border px-3 py-2 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={notice.date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded outline-none"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm mb-1">Notice Description</label>
                <textarea
                  name="description"
                  value={notice.description}
                  onChange={handleChange}
                  placeholder="Description..."
                  className="w-full border px-3 py-2 rounded outline-none"
                  rows="4"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCreateNotice}
                  className="bg-[#146192] text-white px-6 py-2 rounded hover:bg-[#0f4a6f]"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
