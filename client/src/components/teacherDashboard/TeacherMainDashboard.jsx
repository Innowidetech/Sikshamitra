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
import MarkAttendance from './MarkAttendance';
import EditLectureTimetable from './EditLectureTimetable';
import ScheduledLec from './ScheduledLec';
import TeacherQuery from './TeacherQuery';
import ReplyTeacherQuery from './ReplyTeacherQyery';
import TeacherQueryForm from './TeacherQueryForm'; // ✅ Import added

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedQueryId, setSelectedQueryId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split('/teacher/')[1];
    const tab = path || 'dashboard';
    setActiveTab(tab);
  }, [location.pathname]);

  const handleTabChange = (tabId, data = null) => {
    setActiveTab(tabId);

    if (tabId === 'assignmentdetails') {
      setSelectedAssignment(data);
    }

    if (tabId === 'replyteacherquery') {
      setSelectedQueryId(data);
    }

    navigate(`/teacher/${tabId}`);
  };

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
        return <Attendence handleTabChange={handleTabChange} />;
      case 'markattendance':
        return <MarkAttendance />;
      case 'lectures':
        return <Lectures handleTabChange={handleTabChange} />;
      case 'editlectures':
        return <EditLectureTimetable />;
      case 'scheduledlec':
        return <ScheduledLec />;
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
      case 'teacherquery':
        return (
          <TeacherQuery
            setActiveTab={handleTabChange}
            setSelectedQueryId={setSelectedQueryId}
          />
        );
      case 'teacherqueryform': // ✅ New tab case added
        return (
          <TeacherQueryForm goBack={() => handleTabChange('teacherquery')} />
        );
      case 'replyteacherquery':
        return (
          <ReplyTeacherQuery
            id={selectedQueryId}
            goBack={() => handleTabChange('teacherquery')}
          />
        );
      case 'createdynamiccalendar':
        return <CreateDynamicCalendar />;
      default:
        return <TeacherDashboard handleTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar
        setActiveSection={handleTabChange}
        activeTab={activeTab}
      />
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default MainDashboard;
