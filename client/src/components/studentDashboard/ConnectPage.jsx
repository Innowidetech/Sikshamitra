import React, { useState, useEffect } from 'react';
import { FaVideo } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const ConnectPage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const updateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const weekday = now.toLocaleDateString([], { weekday: 'long' });
    const date = now.toLocaleDateString([], {
      month: 'long',
      day: 'numeric',
    });

    setCurrentTime(`${time}, ${weekday}, ${date}`);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#f7931e] relative font-sans">
      {/* Top bar */}
      <div className="w-full bg-white text-black flex justify-between items-center px-4 py-2 text-sm absolute top-0 left-0 shadow">
<span
  className="font-medium cursor-pointer"
  onClick={() => navigate('/connectqueries')} // <-- Replace with actual route
>
  &larr; Connect
</span>


        <span>{currentTime}</span>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <div className="flex flex-col md:flex-row items-center gap-6 mt-[-40px]">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-white text-[#f7931e] p-4 rounded-lg">
              <FaVideo size={64} />
            </div>
          </div>

          {/* Text */}
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Experience seamless video calls and <br /> Meetings
            </h1>
            <p className="text-white mt-2 text-base">
              -now accessible to everyone, anytime, anywhere
            </p>
          </div>
        </div>

        {/* Create Meeting Button */}
        <div className="relative mt-6">
          <button
            className="bg-white text-[#f7931e] font-medium py-2 px-5 rounded shadow hover:bg-gray-100 flex items-center gap-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <FaVideo className="text-[#f7931e]" />
            {/* <FiSettings className="text-[#f7931e]" /> */}
            Create meeting
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded shadow text-gray-700 text-left divide-y">
               <button
      className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-center"
      onClick={() => navigate('/schedulepage')}
    >
      Schedule a Meeting
    </button>
              <button className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-center" 
               onClick={() => navigate('/instantmeeting')}>
                Start instant Meeting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
