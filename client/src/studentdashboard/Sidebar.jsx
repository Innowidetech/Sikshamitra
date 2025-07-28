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




// import React, { useState } from 'react';
// import {
//   UserCircle, GraduationCap, Users,
//   CreditCard, Download, FileText, Menu, X
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const Sidebar = ({ activeTab, setActiveTab }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeTabState, setActiveTabState] = useState(activeTab || 'student');

//   const menuItems = [
//     { id: 'student', icon: UserCircle, label: 'Student Details' },
//     { id: 'education', icon: GraduationCap, label: 'Education Details' },
//     { id: 'parent', icon: Users, label: 'Parent Details' },
//     { id: 'payment', icon: CreditCard, label: 'Payment' },
//     { id: 'entranceexam', icon: FileText, label: 'Apply For Entrance Exam' },
//     { id: 'download', icon: Download, label: 'Download' },
//   ];

//   const handleTabChange = (id) => {
//     setActiveTab(id);
//     setActiveTabState(id);
//     setIsOpen(false); // Close sidebar on mobile
//   };

//   return (
//     <>
//       {/* Mobile toggle button */}
//       <div className="md:hidden fixed top-0 left-0 p-4 z-50">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="text-gray-800 hover:text-[#FF9F1C] transition-colors duration-200"
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`bg-[#FF9F1C] text-white w-64 h-screen fixed left-0 top-0 flex flex-col transition-transform duration-300 ease-in-out transform
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 z-40`}
//       >
//         {/* Logo */}
//         <div
//           className="text-2xl lg:text-3xl font-bold p-4 lg:py-10 flex justify-center cursor-pointer"
//           style={{ fontFamily: 'Poppins' }}
//           onClick={() => {
//             navigate('/');
//             handleTabChange('student');
//           }}
//         >
//           LOGO
//         </div>

//         {/* Menu Items */}
//         <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleTabChange(item.id)}
//                 className={`flex items-center space-x-4 w-full p-3 rounded-lg mb-2 transition-all duration-200 ${
//                   activeTabState === item.id
//                     ? 'bg-white text-[#FF9F1C] shadow-md'
//                     : 'hover:bg-white/10'
//                 }`}
//               >
//                 <Icon size={20} className="min-w-[20px]" />
//                 <span className="text-[15px] md:text-[16px]" style={{ fontFamily: 'Poppins' }}>
//                   {item.label}
//                 </span>
//               </button>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Overlay when sidebar is open on mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;
