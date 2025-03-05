import React, { useState } from 'react';
import { Bell, Settings, UserCircle } from 'lucide-react';
import { FaBars } from 'react-icons/fa'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false); 
  const [userDropdownVisible, setUserDropdownVisible] = useState(false); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found for logout.");
        return;
      }

      await axios.post('https://sikshamitra.onrender.com/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <div className="bg-white p-4 flex md:justify-between items-center">
      <div className="md:flex items-center justify-between w-full">
        <div className="md:hidden -mx-6">
          <button
            onClick={() => setMobileMenuVisible(!mobileMenuVisible)} 
            className="p-2 text-[#1982C4] text-xl">
            <FaBars />
          </button>
        </div>

        {/* For Desktop View */}
        <div className="hidden md:flex items-center md:h-24 md:mb-4">
          <div className="p-2 cursor-pointer">
            {/* <div className="relative inline-flex items-center justify-center bg-[#1982C4]/10 rounded-full p-2 xl:p-4">
              <Bell className="text-[#1982C4] text-xl" />
            </div> */}
          </div>
          <div className="p-2 cursor-pointer">
            <div className="relative inline-flex items-center justify-center bg-[#1982C4]/10 rounded-full p-2 xl:p-4">
              <Settings className="text-[#1982C4]" />
            </div>
          </div>
          <div className="relative p-2 cursor-pointer" onClick={() => setDropdownVisible(!dropdownVisible)}>
            <div className="relative inline-flex items-center justify-center bg-[#1982C4]/10 rounded-full p-2 xl:p-4">
              <UserCircle className="text-[#1982C4]" />
            </div>
            {dropdownVisible && (
              <div className="absolute top-18 right-0 w-40 bg-white shadow-md rounded-lg border border-[#1982C4]/20">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-2 text-left px-4 text-[#303972] rounded-t-lg hover:bg-[#f0f0f0]"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-left px-4 text-[#E40046] hover:bg-[#f0f0f0] rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuVisible && (
      <div className="md:hidden absolute top-28 right-0 w-[200px] bg-white shadow-md rounded-lg border border-[#1982C4]/20">
          <div className="flex flex-col">
            <button
              onClick={() => alert('Notifications clicked')}
              className="w-full py-2 text-left px-4 text-[#303972] hover:bg-[#f0f0f0]"
            >
              <Bell className="mr-2 inline" /> Notifications
            </button>
            <button
              onClick={() => alert('Settings clicked')}
              className="w-full py-2 text-left px-4 text-[#303972] hover:bg-[#f0f0f0]"
            >
              <Settings className="mr-2 inline" /> Settings
            </button>
            <button
              onClick={() => setUserDropdownVisible(!userDropdownVisible)} 
              className="w-full py-2 text-left px-4 text-[#303972] hover:bg-[#f0f0f0]"
            >
              <UserCircle className="mr-2 inline" /> User
            </button>

            {/* User Dropdown Menu when clicked */}
            {userDropdownVisible && (
              <div className="ml-8 mt-2 bg-white shadow-md rounded-lg border border-[#1982C4]/20">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-2 text-left px-4 text-[#303972] rounded-t-lg hover:bg-[#f0f0f0]"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-left px-4 text-[#E40046] hover:bg-[#f0f0f0] rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
