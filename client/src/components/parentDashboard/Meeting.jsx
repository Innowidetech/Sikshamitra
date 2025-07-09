import React, { useEffect, useState } from 'react';
import { FaVideo } from 'react-icons/fa';

const Meeting = () => {
  const [currentTime, setCurrentTime] = useState('');

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
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#FF9F1C] flex flex-col text-white relative font-sans">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-6 py-4">
        <div className="text-md font-semibold">Meet</div>
        <div className="text-sm">{currentTime}</div>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <FaVideo className="text-6xl mb-4" />
        <h1 className="text-xl font-semibold mb-2">Experience seamless video calls and Meetings</h1>
        <p className="text-sm mb-6">- now accessible to everyone, anytime, anywhere</p>

        <button className="bg-white text-orange-500 font-semibold py-2 px-4 rounded shadow flex items-center gap-2 hover:bg-orange-100 transition">
          <FaVideo />
          Create meeting
        </button>
      </div>
    </div>
  );
};

export default Meeting;
