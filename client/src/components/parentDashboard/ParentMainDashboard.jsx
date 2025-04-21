import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ParentSidebar from './layout/ParentSidebar';
import ParentDashboard from './ParentDashboard';
import Kids from './Kids';
import Results from './Results';
import Expenses from './Expenses';
import Curriculam from './Curriculam';
import Exams from './Exams';
import Fees from './Fees';
import Query from './Query';
import AnnualResult from './AnnualResult';
import SyllabusPage from './SyllabusPage';
import ClassPlanPage from './ClassPlanPage'; // ✅ Make sure this is the correct import

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();


  
  useEffect(() => {
    if (location.pathname === '/parent') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId); // ✅ This is enough — no navigation needed
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ParentDashboard />;
      case 'kids':
        return <Kids />;
      case 'results':
        return <Results />;
      case 'annualresult':
        return <AnnualResult />;
      case 'expenses':
        return <Expenses />;
      case 'curriculam':
        return <Curriculam setActiveTab={handleTabChange} />;
      case 'exams':
        return <Exams />;
      case 'fees':
        return <Fees />;
      case 'query':
        return <Query />;
      case 'syllabus':
        return <SyllabusPage />;
      case 'classplans':
        return <ClassPlanPage />;
      default:
        return <ParentDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <ParentSidebar setActiveSection={handleTabChange} activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto ">
        {renderContent()}
      </main>
    </div> 
  
  );
};

export default MainDashboard;
