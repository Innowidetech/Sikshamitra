import React, { useState, useEffect } from 'react';
import { Bell, Settings, UserCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../redux/authSlice';

const StudentHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth); // Assuming token and user are in state.auth

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigate to student profile page
  const handleProfileClick = () => {
    navigate('/student/profile');
  };

  // Check if the token is present and redirect to login if not
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return (
    <header className="text-gray-800 p-4 flex justify-between items-center flex-wrap md:flex-nowrap fixed top-0 left-0 right-0 z-20 opacity-100 md:backdrop-blur-xl">
      {/* Mobile: Logo */}
      <div className="md:hidden flex items-center ml-8">
        <img
          src="/Assets/logo.png"
          alt="Logo"
          className="h-6"
          onClick={() => navigate('/student')}
        />
      </div>

      {/* Left Side for Desktop (Search Bar) */}
      <div className="hidden md:flex items-center bg-[#1982C4]/10 p-3 rounded-3xl w-1/3 mb-4 md:mb-0 ml-64">
        <Search className="text-[#1982C4] mr-2 h-5 w-5" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-gray-600 placeholder-gray-600 w-full"
        />
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Mobile: Search Icon */}
        <div className="md:hidden">
          <Search className="text-[#1982C4] h-5 w-5" />
        </div>

        {/* Profile Button - Both Mobile and Desktop */}
        <div className="relative group">
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-2 bg-[#1982C4]/10 px-4 py-2 rounded-full hover:bg-[#1982C4]/20 transition-colors"
          >
            <UserCircle className="text-[#1982C4] h-5 w-5" />
            <span className="text-[#1982C4] hidden md:inline">
              {user?.fullname || 'User'} {/* Show user name */}
            </span>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
