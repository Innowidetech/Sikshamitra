import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import ClassPlanPage from './ClassPlanPage';
import ParentProfile from './ParentProfile';
import ReplyPage from './ReplyPage';
import QueryForm from './QueryForm'; // ✅ Imported
import Ptransportation from './Ptransportation';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/parents') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (tabId, id = null) => {
    setActiveTab(tabId);
    if (id) setSelectedQueryId(id);
    if (location.pathname === '/parents/profile') {
      navigate('/parents');
    }
  };

  const renderContent = () => {
    if (location.pathname === '/parents/profile') {
      return <ParentProfile />;
    }

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
        return <Query setActiveTab={handleTabChange} />; // ✅ Passing setActiveTab
      case 'replypage':
        return <ReplyPage id={selectedQueryId} goBack={() => handleTabChange('query')} />;
      case 'syllabus':
        return <SyllabusPage />;
      case 'classplans':
        return <ClassPlanPage />;
      case 'ptransportation':
        return <Ptransportation/>;  
      case 'queryform':
        return <QueryForm goBack={() => handleTabChange('query')} />; // ✅ New case
      default:
        return <ParentDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <ParentSidebar setActiveSection={handleTabChange} activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default MainDashboard;
