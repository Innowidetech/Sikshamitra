import React from 'react';
import { UserCircle, GraduationCap, Users, CreditCard, Download,FileText } from 'lucide-react';
import {useNavigate} from 'react-router-dom';


const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'student', icon: UserCircle, label: 'Student Details' },
    { id: 'education', icon: GraduationCap, label: 'Education Details' },
    { id: 'parent', icon: Users, label: 'Parent Details' },
    { id: 'payment', icon: CreditCard, label: 'Payment' },
    { id: 'entranceexam', icon: FileText, label: 'Apply For entrance exam' },
    { id: 'download', icon: Download, label: 'Download' },
  ];

  return (
    <div className="bg-[#FF9F1C] text-white w-64 min-h-screen p-4 overflow-hidden" style={{ fontFamily: 'Poppins' }}>
      <div className="text-xl lg:text-3xl font-semibold mb-8 xl:text-[48px] lg:py-10 cursor-pointer" onClick={()=>navigate('/')}>LOGO</div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-4 xl:py-6 w-full md:px-6 p-3 rounded-l-3xl mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-white text-[#1982C4]'  
                  : 'hover:bg-white/50'
              }`}
            >
              <Icon size={20} />
              <span className="hidden sm:inline xl:text-md">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
