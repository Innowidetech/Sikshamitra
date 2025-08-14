import React, { useState } from 'react';
import {
  LayoutDashboard, Library, X, Menu
} from 'lucide-react';
import { GiBodySwapping } from "react-icons/gi";
import { FaClipboardList } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FiFileText } from "react-icons/fi";
import { SiGooglebigquery } from "react-icons/si";
import { IoBookSharp } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { TbMessageQuestion } from "react-icons/tb";
import logo from '../../../assets/logo1.png';

// Menu items
const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'mystudents', icon: GiBodySwapping, label: 'My Students' },
  { id: 'assignments', icon: FaClipboardList, label: 'Assignments' },
  { id: 'results', icon: GoChecklist, label: 'Results' },
  { id: 'attendence', icon: Library, label: 'Attendence' },
  { id: 'lectures', icon: HiMiniUserGroup, label: 'Lectures' },
  { id: 'curriculam', icon: FiFileText, label: 'Curriculam' },
  { id: 'studymaterial', icon: IoBookSharp, label: 'Study Material' },
  { id: 'createexam', icon: IoIosCreate, label: 'Create Exam' },
  { id: 'about', icon: TbMessageQuestion, label: 'About' },
 { id: 'teacherquery', icon: SiGooglebigquery, label: 'Connect&Query' },
];

const TeacherSidebar = ({ setActiveSection, activeTab }) => {
  const [activeTabState, setActiveTabState] = useState(activeTab || 'dashboard');
  const [isOpen, setIsOpen] = useState(false);

  const handleTabChange = (id) => {
    setActiveTabState(id);
    setActiveSection(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 p-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#FF9F1C] hover:text-[#1982C4] focus:outline-none transition-colors duration-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#FF9F1C] text-white w-64 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 z-40 shadow-lg`}
      >
        {/* Logo */}
        <div 
                 className="flex justify-center items-center p-6 cursor-pointer"
                 onClick={() => handleTabChange('dashboard')}
               >
                 <img 
                   src={logo} 
                   alt="Logo"
                   className="h-20 w-auto object-contain rounded-full"
                 />
               </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center w-full space-x-4 p-3 rounded-lg mb-2 transition-all duration-200
                  ${activeTabState === item.id
                    ? 'bg-white text-[#1982C4] shadow-md'
                    : 'hover:bg-white/10'
                  }`}
              >
                <Icon size={20} className="min-w-[20px]" />
                <span className="text-lg" style={{ fontFamily: 'Poppins' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default TeacherSidebar;
