import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // To manage dropdown visibility
  const navigate = useNavigate(); // Initialize the navigate function

  // Toggle the visibility of the dropdown
  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Navigate to the Profile page when the Profile button is clicked
  const handleProfileClick = () => {
    navigate('/profile'); // This will navigate to /profile
    setDropdownVisible(false); // Close the dropdown after clicking Profile
  };

  // Optionally, you could add a logout function here
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <div className="bg-white p-4 flex md:justify-between items-center py-16">
      <div className="md:flex items-center justify-between w-full">
        <div className="md:hidden -mx-6">
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility on mobile
            className="p-2 text-[#1982C4] text-xl"
          >
            <UserCircle />
          </button>
        </div>

        {/* For Desktop View */}
        <div className="hidden md:flex items-center z-50 md:h-24">
          <div className="relative p-2 cursor-pointer" onClick={handleDropdownToggle}>
            <div className="relative inline-flex items-center justify-center bg-[#1982C4]/10 rounded-full p-2 xl:p-4">
              <UserCircle className="text-[#1982C4]" />
            </div>
            {/* Dropdown menu */}
            {dropdownVisible && (
              <div className="absolute top-18 right-0 w-40 bg-white shadow-md rounded-lg border border-[#1982C4]/20">
                <button
                  onClick={handleProfileClick} // Navigate to profile
                  className="w-full py-2 text-left px-4 text-[#303972] rounded-t-lg hover:bg-[#f0f0f0]"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout} // Logout function
                  className="w-full py-2 text-left px-4 text-[#E40046] hover:bg-[#f0f0f0] rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional Mobile Dropdown */}
      {dropdownVisible && (
        <div className="md:hidden absolute top-28 right-0 w-[200px] bg-white shadow-md rounded-lg border border-[#1982C4]/20">
          <div className="flex flex-col">
            <button
              onClick={handleProfileClick} // Navigate to profile
              className="w-full py-2 text-left px-4 text-[#303972] hover:bg-[#f0f0f0]"
            >
              Profile
            </button>
            <button
              onClick={handleLogout} // Logout function
              className="w-full py-2 text-left px-4 text-[#E40046] hover:bg-[#f0f0f0]"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
