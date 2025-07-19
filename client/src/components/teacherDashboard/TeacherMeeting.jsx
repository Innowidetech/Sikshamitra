import React, { useEffect, useState } from 'react';
import { FaVideo, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Meeting = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      setCurrentTime(`${time}, ${date}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleScheduleMeeting = () => {
    navigate('/create-meeting');
  };

  return (
    <div className="h-screen w-full bg-[#FF9F1C] flex flex-col text-white relative font-sans">
      <div className="w-full flex justify-between items-center px-6 py-4">
        <div className="text-md font-semibold">Meet</div>
        <div className="text-sm">{currentTime}</div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 relative">
        <FaVideo className="text-6xl mb-4" />
        <h1 className="text-xl font-semibold mb-2">Experience seamless video calls and Meetings</h1>
        <p className="text-sm mb-6">- now accessible to everyone, anytime, anywhere</p>

        <div className="relative">
          <button onClick={() => setShowOptions(!showOptions)} className="bg-white text-orange-500 font-semibold py-2 px-4 rounded shadow flex items-center gap-2 hover:bg-orange-100 transition">
            <FaVideo />
            Create meeting
            <FaChevronDown className="text-xs" />
          </button>

          {showOptions && (
            <div className="absolute top-full mt-2 w-48 bg-white text-orange-500 shadow rounded overflow-hidden z-10">
              <button onClick={handleScheduleMeeting} className="w-full text-left px-4 py-2 hover:bg-orange-100 transition">Schedule meeting</button>
              <button onClick={handleScheduleMeeting} className="w-full text-left px-4 py-2 hover:bg-orange-100 transition">Instant meeting</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meeting;
