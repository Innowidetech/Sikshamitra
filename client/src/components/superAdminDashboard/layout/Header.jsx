import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Monitor,
  SunMedium,
  Check,
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
          <Settings className="w-5 h-5 text-[#00263c]" />
        </button>
        <button
          onClick={toggleDropdown}
          className="relative p-2 rounded-full hover:bg-gray-200 transition"
        >
          <Bell className="w-5 h-5 text-[#00263c]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00263c]">
            <User className="w-4 h-4 mr-2" />
            Profile
          </div>
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00263c]">
            <Moon className="w-4 h-4 mr-2" />
            Theme
          </div>
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00263c]">
            <Monitor className="w-4 h-4 mr-2" />
            Device
          </div>
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00263c]">
            <Check className="w-4 h-4 mr-2" />
            Light
          </div>
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00263c]">
            <SunMedium className="w-4 h-4 mr-2" />
            Dark
          </div>
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600 border-t">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
