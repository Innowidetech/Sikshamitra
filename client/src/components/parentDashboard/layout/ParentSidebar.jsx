import React, { useState } from 'react';
import { LayoutDashboard, Library } from 'lucide-react';
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
  { id: 'annualresult', icon: FaClipboardList, label: 'Annual Result' },
  { id: 'expenses', icon: GoChecklist, label: 'Expenses' },
  { id: 'curriculam', icon: Library, label: 'Curriculam' },
  { id: 'exams', icon: HiMiniUserGroup, label: 'Exams'},
  { id: 'fees', icon: FiFileText, label: 'Fees'},
  { id: 'query', icon: SiGooglebigquery, label: 'Query'},
];

const ParentSidebar = ({ setActiveSection, activeTab }) => {
  const [activeTabState, setActiveTabState] = useState(activeTab || 'dashboard'); 
  const handleTabChange = (id) => {
    setActiveTabState(id); 
    setActiveSection(id);  
  };

  return (
    <div className="bg-[#FF9F1C] text-white w-64 h-screen fixed left-0 top-0 flex flex-col" style={{ fontFamily: 'Poppins' }}>
      <div 
        className="text-xl lg:text-3xl font-semibold p-4 xl:text-[48px] lg:py-10 cursor-pointer flex-shrink-0 flex justify-center" 
        onClick={() => handleTabChange('dashboard')} 
      >
        LOGO
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)} 
              className={`flex items-center space-x-4 xl:py-4 w-full md:px-6 p-3 rounded-l-3xl mb-2 transition-colors ${
                activeTabState === item.id
                  ? 'bg-white text-[#1982C4]'  
                  : 'hover:bg-white/50'        
              }`}
            >
              <Icon size={20} />
              <span className="hidden sm:inline xl:text-md" style={{fontFamily:'Poppins'}}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ParentSidebar;