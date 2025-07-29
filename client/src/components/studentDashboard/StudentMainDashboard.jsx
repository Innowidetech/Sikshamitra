import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import StudentSidebar from './layout/StudentSidebar';
import StudentDashboard from './StudentDashboard';
import Results from './Results';
import TimeTable from './TimeTable';
import Assignment from './Assignments';
import StudyMaterial from './StudyMaterial';
import Syllabus from './Syllabus';
import Exams from './Exams';
import AdmitCard from './AdmitCard';
import StudentHeader from './layout/Header';
import StudentProfile from './StudentProfile';
import SyllabusView from './SyllabusView';
import ClassPlanView from './ClassPlanView';
import BookRequest from './BookRequest';
import BorrowingHistory from './BorrowingHistory';
import ConnectQueries from './ConnectQueries';
import QueryChatPage from './QueryChatPage';
import QueriesPage from './QueriesPage'; // ✅ New Component
import StudentTrans from './StudentTrans';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  const [showQueryChatPage, setShowQueryChatPage] = useState(false);
  const [queryChatData, setQueryChatData] = useState({ queryId: null, mode: 'view' });

  const [showQueriesPage, setShowQueriesPage] = useState(false); // ✅ New state
 


  useEffect(() => {
    if (location.pathname === '/student') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowQueryChatPage(false);
    setShowQueriesPage(false); // ✅ close queries page if navigating elsewhere
    if (
      location.pathname === '/student/profile' ||
      location.pathname === '/student/syllabus-view' ||
      location.pathname === '/student/class-plan'
    ) {
      navigate('/student');
    }
  };

  const handleNavigateToBorrowingHistory = () => {
    setActiveTab('borrowingHistory');
    setShowQueryChatPage(false);
    setShowQueriesPage(false);
  };

  const renderContent = () => {
    if (showQueryChatPage && queryChatData.queryId) {
      return (
        <QueryChatPage
          id={queryChatData.queryId}
          mode={queryChatData.mode}
          onBack={() => setShowQueryChatPage(false)}
        />
      );
    }

    if (showQueriesPage) {
      return <QueriesPage onBack={() => setShowQueriesPage(false)} />; // ✅ Render queries page
    }




    if (location.pathname === '/student/profile') return <StudentProfile />;
    if (location.pathname === '/student/syllabus-view') return <SyllabusView />;
    if (location.pathname === '/student/class-plan') return <ClassPlanView />;

    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'results':
        return <Results />;
      case 'timetable':
        return <TimeTable />;
      case 'assignment':
        return <Assignment />;
      case 'studymaterial':
        return <StudyMaterial />;
      case 'syllabus':
        return <Syllabus />;
      case 'exams':
        return <Exams />;
      case 'admitcard':
        return <AdmitCard />;
      case 'bookrequest':
        return (
          <BookRequest onNavigateBorrowingHistory={handleNavigateToBorrowingHistory} />
        );
      case 'borrowingHistory':
        return <BorrowingHistory />;
         case 'transportation':
        return <StudentTrans/>;
      case 'connectqueries':
        return (
          <ConnectQueries
            onOpenQueryChat={(id, mode) => {
              setQueryChatData({ queryId: id, mode });
              setShowQueryChatPage(true);
            }}
            onOpenQueriesPage={() => setShowQueriesPage(true)} // ✅ New prop
          
          />
        );
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar setActiveSection={handleTabChange} activeTab={activeTab} />
      <main className="flex-1 md:ml-64 overflow-y-auto">
        <StudentHeader />
        <div className="mt-20 md:mt-16">{renderContent()}</div>
      </main>
    </div>
  );
};

export default MainDashboard;
