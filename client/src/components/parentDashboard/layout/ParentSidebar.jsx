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

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'kids', icon: GiBodySwapping, label: 'Kids' },
  { id: 'results', icon: FaClipboardList, label: 'Results' },
  { id: 'expenses', icon: GoChecklist, label: 'Expenses' },
  { id: 'curriculam', icon: Library, label: 'Curriculam' },
  { id: 'exams', icon: HiMiniUserGroup, label: 'Exams' },
  { id: 'fees', icon: FiFileText, label: 'Fees' },
  { id: 'query', icon: SiGooglebigquery, label: 'Connect&Queries' },
  
];

const ParentSidebar = ({ setActiveSection, activeTab }) => {
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
          className="text-gray-800 hover:text-[#FF9F1C] focus:outline-none transition-colors duration-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-[#FF9F1C] text-white w-64 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 z-40 shadow-lg`}
      >
        {/* Logo Section */}
        <div 
          className="text-xl lg:text-3xl font-semibold p-4 xl:text-[48px] lg:py-10 cursor-pointer flex-shrink-0 flex justify-center" 
          style={{ fontFamily: 'Poppins' }}
          onClick={() => handleTabChange('dashboard')}
        >
          LOGO
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center w-full space-x-4 p-3 rounded-lg mb-2 transition-all duration-200
                  ${activeTabState === item.id
                    ? 'bg-white text-[#FF9F1C] shadow-md'
                    : 'hover:bg-white/10'
                  }`}
              >
                <Icon size={20} className="min-w-[20px]" />
                <span className="text-lg" style={{ fontFamily: 'Poppins' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
    </>
  );
};

export default ParentSidebar;
