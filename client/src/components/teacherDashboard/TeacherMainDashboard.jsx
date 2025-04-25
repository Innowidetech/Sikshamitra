import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import AssignmentDetails from './AssignmentDetails';
import Tsyllabus from './Tsyllabus';
import TclassPlans from './Tclassplans';
import AddStudentResult from './AddStudentResult'; // 👈 Import the new page

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/teacher') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Updated to accept optional data
  const handleTabChange = (tabId, data = null) => {
    setActiveTab(tabId);
    if (tabId === 'assignmentdetails') {
      setSelectedAssignment(data);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard />;
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
      case 'addstudentresult': // 👈 Add this case
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
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar setActiveSection={handleTabChange} activeTab={activeTab} />
      <main className="flex-1">{renderContent()}</main>
    </div>
  );
};

export default MainDashboard;
