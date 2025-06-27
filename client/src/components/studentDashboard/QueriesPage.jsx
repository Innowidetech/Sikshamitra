import React, { useState } from 'react';
import Header from './layout/Header';
import contactImage from '../../assets/contact1.png';

const QueriesPage = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  return (
    <div className="p-6">
      <div className="p-4">
        {/* Top Header */}
        <div className="flex justify-between items-center mx-4 md:mx-8 flex-wrap gap-y-4">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xl">Home</span> {'>'}
              <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Connect & Queries</span>
            </h1>
          </div>
          <Header />
        </div>

        {/* Main Query Box */}
        <div className="bg-white rounded-lg shadow-lg mt-8 p-6 max-w-6xl mx-auto border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-700">Contact Us for Any Query!</h2>
              <p className="text-gray-600 text-sm">We are here for you! How can we help?</p>
            </div>

            {/* Tabs */}
            <div className="space-x-2">
              <button className="bg-[#1976D2] text-white px-4 py-1 rounded-md font-medium shadow">Queries</button>
              <button className="bg-white border border-[#1976D2] text-[#1976D2] px-4 py-1 rounded-md font-medium shadow">Connect</button>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block mb-1 text-sm">Parent Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1 text-sm">Parent Email id</label>
                <input type="email" className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1 text-sm">Query</label>
                <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" />
              </div>

              {/* Send To Section */}
              <div>
                <label className="block mb-1 text-sm">Send to</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!isTeacher}
                      onChange={() => setIsTeacher(false)}
                    />
                    Admin
                  </label>

                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={isTeacher}
                      onChange={() => setIsTeacher(true)}
                    />
                    Teacher
                  </label>

                  {isTeacher && (
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select Teacher</option>
                      <option value="teacher1">Mr. John Smith</option>
                      <option value="teacher2">Ms. Jane Doe</option>
                    </select>
                  )}
                </div>
              </div>

              <button className="bg-[#1976D2] text-white px-6 py-2 rounded-full mt-4 hover:bg-blue-800 transition">
                Send
              </button>
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
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;
