import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Layout and Pages
import TeacherSidebar from './layout/TeacherSidebar';
import TeacherDashboard from './TeacherDashboard';
import MyStudents from './MyStudents';
import Assignments from './Assignments';
import Results from './Results';
import Attendence from './Attendence';
import Lectures from './Lectures';
import Curriculum from './Curriculum';
import StudyMaterial from './StudyMaterial';
import CreateExams from './CreateExams';
import Exams from './Exams';
import About from './About';
import MaterialPage from './MaterialPage';
import UploadAssignment from './UploadAssignment';
import Tsyllabus from './Tsyllabus';
import TclassPlans from './Tclassplans';
import AssignmentDetails from './AssignmentDetails';
import AddStudentResult from './AddStudentResult';
import CreateDynamicCalendar from './CreateDynamicCalendar';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync tab with URL path
  useEffect(() => {
    const path = location.pathname.split('/teacher/')[1]; // Extract the tab name
    const tab = path || 'dashboard'; // Fallback
    setActiveTab(tab);
  }, [location.pathname]);

  // Handle tab change and optionally pass data (like for assignmentdetails)
  const handleTabChange = (tabId, data = null) => {
    setActiveTab(tabId);
    if (tabId === 'assignmentdetails') {
      setSelectedAssignment(data);
    }
    navigate(`/teacher/${tabId}`);
  };

  // Render tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard handleTabChange={handleTabChange} />;
      case 'mystudents':
        return <MyStudents />;
      case 'assignments':
        return <Assignments handleTabChange={handleTabChange} />;
      case 'uploadassignment':
        return <UploadAssignment />;
      case 'assignmentdetails':
        return <AssignmentDetails assignment={selectedAssignment} />;
      case 'results':
        return <Results handleTabChange={handleTabChange} />;
      case 'addstudentresult':
        return <AddStudentResult />;
      case 'attendence':
        return <Attendence />;
      case 'lectures':
        return <Lectures />;
      case 'curriculam':
        return <Curriculum setActiveTab={handleTabChange} />;
      case 'studymaterial':
        return <StudyMaterial />;
      case 'materialPage':
        return <MaterialPage />;
      case 'tsyllabus':
        return <Tsyllabus />;
      case 'tclassplans':
        return <TclassPlans />;
      case 'createexam':
        return <CreateExams />;
      case 'exams':
        return <Exams />;
      case 'about':
        return <About />;
      case 'createdynamiccalendar':
        return <CreateDynamicCalendar />;
      default:
        return <TeacherDashboard handleTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar setActiveSection={handleTabChange} activeTab={activeTab} />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default MainDashboard;
