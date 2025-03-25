// import React, { useState } from 'react';
// import { LayoutDashboard, Library } from 'lucide-react';
// import { FaClipboardList } from "react-icons/fa";
// import { GoChecklist } from "react-icons/go";
// import { FiFileText } from "react-icons/fi";
// import { IoBookSharp } from "react-icons/io5";
// import { MdAssignmentAdd } from "react-icons/md";
// import { MdOutlineAssignmentReturned } from "react-icons/md";
// import { AiOutlineMenu } from "react-icons/ai"; // Toggle button icon

// const menuItems = [
//   { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { id: 'results', icon: GoChecklist, label: 'Results' },
//   { id: 'timetable', icon: FaClipboardList, label: 'Time Table' },
//   { id: 'assignment', icon: MdAssignmentAdd, label: 'Assignment' },
//   { id: 'studymaterial', icon: Library, label: 'Study Material' },
//   { id: 'syllabus', icon: IoBookSharp, label: 'Syllabus' },
//   { id: 'exams', icon: FiFileText, label: 'Exams' },
//   { id: 'admitcard', icon: MdOutlineAssignmentReturned, label: 'Admit Card' },
// ];

// const StudentSidebar = ({ setActiveSection, activeTab }) => {
//   const [activeTabState, setActiveTabState] = useState(activeTab || 'dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // State for controlling sidebar visibility

//   const handleTabChange = (id) => {
//     setActiveTabState(id);
//     setActiveSection(id);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`bg-[#FF9F1C] text-white w-64 h-screen fixed left-0 top-0 flex flex-col transform transition-all duration-300 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0`} 
//         style={{ fontFamily: 'Poppins' }}
//       >
//         {/* Fixed Logo Section */}
//         <div
//           className="text-xl lg:text-3xl font-semibold p-4 xl:text-[48px] lg:py-10 cursor-pointer flex-shrink-0 flex justify-center"
//           onClick={() => handleTabChange('dashboard')}
//         >
//           LOGO
//         </div>

//         {/* Scrollable Navigation */}
//         <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleTabChange(item.id)}
//                 className={`flex items-center space-x-4 xl:py-4 w-full md:px-6 p-3 rounded-l-3xl mb-2 transition-colors ${
//                   activeTabState === item.id
//                     ? 'bg-white text-[#1982C4]'
//                     : 'hover:bg-white/50'
//                 } ml-10`} 
//               >
//                 <Icon size={20} />
//                 <span
//                   className={`hidden sm:inline xl:text-lg ${item.id === 'dashboard' ? 'text-xl' : ''}`}  // Increased text size for "Dashboard"
//                   style={{ fontFamily: 'Poppins' }}
//                 >
//                   {item.label}
//                 </span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Toggle Button for Small Screens */}
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden fixed top-4 left-4 p-3 text-[#FF9F1C] bg-white rounded-full"
//       >
//         <AiOutlineMenu size={30} />
//       </button>
//     </div>
//   );
// };

// export default StudentSidebar;



import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, 
  Users2, Calculator, Package, Library, FileSpreadsheet,
  UserCog, Award, BookCopy, Menu, X
} from 'lucide-react';
import { FaClipboardList } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { FiFileText } from "react-icons/fi";
import { IoBookSharp } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import { MdOutlineAssignmentReturned } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai"; // Toggle button icon

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'results', icon: GoChecklist, label: 'Results' },
  { id: 'timetable', icon: FaClipboardList, label: 'Time Table' },
  { id: 'assignment', icon: MdAssignmentAdd, label: 'Assignment' },
  { id: 'studymaterial', icon: Library, label: 'Study Material' },
  { id: 'syllabus', icon: IoBookSharp, label: 'Syllabus' },
  { id: 'exams', icon: FiFileText, label: 'Exams' },
  { id: 'admitcard', icon: MdOutlineAssignmentReturned, label: 'Admit Card' },
];

const StudentSidebar = ({ setActiveSection, activeTab }) => {
  const [activeTabState, setActiveTabState] = useState(activeTab || 'dashboard');
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const handleTabChange = (id) => {
    setActiveTabState(id);
    setActiveSection(id);
    setIsOpen(false); // Close sidebar on tab change
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
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
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

export default StudentSidebar;
