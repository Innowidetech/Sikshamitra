// MainDashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './layout/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import Fees from './AdminFees';
import Teachers from './Teachers';
import Students from './Students';
import Parents from './Parents';
import Accounts from './Accounts';
import Inventory from './Inventory';
import Library from './Library';
import Admission from './Admission';
import Classes from './Classes';
import Employee from './Employee';
import Results from './Results';
import Curriculam from './Curriculam';
import Header from './layout/Header';
import AdminProfile from './AdminProfile';
import StudentHistory from './StudentHistory';
import AccountHistory from './AccountHistory';

// 🆕 Import the new pages
import SyllabusPage from './SyllabusPage';
import ExamPage from './ExamPage'; // Optional

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentsSubTab, setStudentsSubTab] = useState('default');
  const [accountSubTab, setAccountSubTab] = useState('default');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Sync activeTab based on current path
    if (location.pathname === '/admin') {
      setActiveTab('dashboard');
    } else if (location.pathname.startsWith('/admin/curriculum')) {
      setActiveTab('curriculum');
    } else if (location.pathname === '/admin/profile') {
      setActiveTab('profile');
    } else if (location.pathname.startsWith('/admin/fees')) {
      setActiveTab('fees');
    } else if (location.pathname.startsWith('/admin/teachers')) {
      setActiveTab('teachers');
    } else if (location.pathname.startsWith('/admin/students')) {
      setActiveTab('students');
    } else if (location.pathname.startsWith('/admin/parents')) {
      setActiveTab('parents');
    } else if (location.pathname.startsWith('/admin/accounts')) {
      setActiveTab('accounts');
    } else if (location.pathname.startsWith('/admin/inventory')) {
      setActiveTab('inventory');
    } else if (location.pathname.startsWith('/admin/library')) {
      setActiveTab('library');
    } else if (location.pathname.startsWith('/admin/admission')) {
      setActiveTab('admission');
    } else if (location.pathname.startsWith('/admin/classes')) {
      setActiveTab('classes');
    } else if (location.pathname.startsWith('/admin/employee')) {
      setActiveTab('employee');
    } else if (location.pathname.startsWith('/admin/results')) {
      setActiveTab('results');
    }
    // Add more routes as needed
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setStudentsSubTab('default');
    setAccountSubTab('default');

    // Navigate to the base route of the tab
    switch (tabId) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'curriculum':
        navigate('/admin/curriculum');
        break;
      case 'fees':
        navigate('/admin/fees');
        break;
      case 'teachers':
        navigate('/admin/teachers');
        break;
      case 'students':
        navigate('/admin/students');
        break;
      case 'parents':
        navigate('/admin/parents');
        break;
      case 'accounts':
        navigate('/admin/accounts');
        break;
      case 'inventory':
        navigate('/admin/inventory');
        break;
      case 'library':
        navigate('/admin/library');
        break;
      case 'admission':
        navigate('/admin/admission');
        break;
      case 'classes':
        navigate('/admin/classes');
        break;
      case 'employee':
        navigate('/admin/employee');
        break;
      case 'results':
        navigate('/admin/results');
        break;
      default:
        navigate('/admin');
    }
  };

  const renderContent = () => {
    // Handle custom pages by exact pathname first
    if (location.pathname === '/admin/profile') {
      return <AdminProfile />;
    }
    if (location.pathname === '/admin/curriculum/syllabus') {
      return <SyllabusPage />;
    }
    if (location.pathname === '/admin/curriculum/exams') {
      return <ExamPage />;
    }

    // Default tab-based rendering
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'fees':
        return <Fees />;
      case 'teachers':
        return <Teachers />;
      case 'students':
        return studentsSubTab === 'history'
          ? <StudentHistory goBack={() => setStudentsSubTab('default')} />
          : <Students openHistory={() => setStudentsSubTab('history')} />;
      case 'parents':
        return <Parents />;
      case 'accounts':
        return accountSubTab === 'history'
          ? <AccountHistory goBack={() => setAccountSubTab('default')} />
          : <Accounts openHistory={() => setAccountSubTab('history')} />;
      case 'inventory':
        return <Inventory />;
      case 'library':
        return <Library />;
      case 'admission':
        return <Admission />;
      case 'classes':
        return <Classes />;
      case 'employee':
        return <Employee />;
      case 'results':
        return <Results />;
      case 'curriculum':
        return <Curriculam />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        setActiveSection={handleTabChange}
        activeTab={activeTab}
      />
      <main className="flex-1 md:ml-64 overflow-y-auto">
        <Header />
        <div className="mt-20 md:mt-16">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
