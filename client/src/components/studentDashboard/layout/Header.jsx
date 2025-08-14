import React, { useState, useEffect } from 'react';
import { Bell, Settings, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../redux/authSlice';
import logo from '../../../assets/logo1.png';

const StudentHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/student/profile');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return (
    <header className="text-gray-800 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20 ">
      {/* Logo */}
    <div className="flex items-center ml-6 cursor-pointer" onClick={() => navigate('/student')}>
  <img src={logo} alt="Logo" className="h-8 sm:h-10 object-contain mt-[-8px]" />
</div>


      {/* Right Actions */}
      <div className="flex items-center space-x-4 mr-4 relative">
       {/* Bell Icon */}
        <button className="hover:bg-gray-100 p-2 rounded-full bg-[#285A871A] shadow-md ">
          <Bell className="text-[#1982C4] h-5 w-5" />
        </button>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="hover:bg-gray-100 p-2 rounded-full bg-[#285A871A]"
          >
            <Settings className="text-[#1982C4] h-5 w-5" />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsSettingsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  // Add theme toggle logic if needed
                  setIsSettingsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Theme
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsSettingsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
            
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
