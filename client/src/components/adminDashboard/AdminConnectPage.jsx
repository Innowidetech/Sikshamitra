import React, { useEffect, useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminConnectPage = () => {
  const [timeString, setTimeString] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Update live time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const day = now.toLocaleDateString([], { weekday: 'long' });
      const date = now.toLocaleDateString([], { month: 'long', day: 'numeric' });
      setTimeString(`${time}, ${day}, ${date}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7931e] flex flex-col">
      {/* Header */}
      <div className="w-full bg-white flex justify-between items-center px-4 py-2 shadow text-sm font-medium">
        <button onClick={() => navigate(-1)}>&larr; Meet</button>
        <span>{timeString}</span>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center">
        <div className="text-center text-white">
          {/* Icon */}
          <div className="bg-white text-[#f7931e] inline-block p-4 rounded-lg mb-6">
            <FaVideo size={64} />
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
            Experience seamless video calls and <br /> Meetings
          </h1>
          <p className="mt-2 mb-6 text-white">
            -now accessible to everyone, anytime, anywhere
          </p>

          {/* Create Meeting Button */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-white text-[#f7931e] py-2 px-4 rounded shadow font-medium flex items-center gap-2"
            >
              <FaVideo /> Create meeting
            </button>

            {showDropdown && (
              <div className="absolute w-full mt-2 bg-white text-gray-700 rounded shadow divide-y">
                <button
                  onClick={() => navigate('/adminschedulepage')}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-center"
                >
                  Schedule a Meeting
                </button>
                <button
                  onClick={() => navigate('/admininstantpage')}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-center"
                >
                  Start instant Meeting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConnectPage;
