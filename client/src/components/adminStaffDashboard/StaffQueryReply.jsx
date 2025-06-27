import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../adminStaffDashboard/layout/Header';
import { SendHorizonal } from 'lucide-react';

const StaffQueryReply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state || {};
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending reply:', message);
      setMessage('');
    }
  };

  return (
    <div className="bg-[#f3f9fb] min-h-screen pt-20">ba
      <Header />

      <div className="p-4 md:p-6 ">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mx-8 md:ml-64 pb-8">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Query Reply</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> &gt;{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Query Reply
              </span>
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden md:ml-64">
          {/* Title */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-[#01497c]">Contact Us for Any Query!</h2>
            <p className="text-sm text-gray-600">We are here for you! How can we help?</p>
          </div>

          {/* Chat Area */}
          <div className="bg-[#ffedb5] px-4 py-6 h-[300px] overflow-y-auto">
            <div className="flex justify-start mb-4">
              <div className="bg-white rounded p-3 shadow text-sm max-w-xs">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </div>
              <span className="text-xs text-gray-500 ml-2 self-end">5:01 pm</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t p-3 bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please type here"
              className="flex-grow px-3 py-2 text-sm border rounded-full focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-[#ffc04d] hover:bg-[#e6a800] text-white p-2 rounded-full"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="md:ml-64 mt-4">
          <button
            onClick={() => navigate('/staffquery')}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffQueryReply;
