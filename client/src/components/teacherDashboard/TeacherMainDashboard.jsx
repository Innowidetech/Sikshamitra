import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TeacherSidebar from './layout/TeacherSidebar';
import TeacherDashboard from './TeacherDashboard';
import MyStudents from './MyStudents';
import Assignment from './Assignments';
import Results from './Results';
import Attendence from './Attendence';
import Lectures from './Lectures';
import Curriculum from './Curriculum';
import StudyMaterial from './StudyMaterial';
import CreateExams from './CreateExams';
import Exams from './Exams'; // ✅ import
import About from './About';
import MaterialPage from './MaterialPage';
import Tsyllabus from './Tsyllabus';
import TclassPlans from './Tclassplans';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();
    

    // Sync tab with URL path
    useEffect(() => {
       if (location.pathname === '/teacher') {
         setActiveTab('dashboard');
       }
     }, [location.pathname]);
   
     const handleTabChange = (tabId) => {
       setActiveTab(tabId); // ✅ This is enough — no navigation needed
     };
   

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TeacherDashboard />;
            case 'mystudents':
                return <MyStudents />;
            case 'assignments':
                return <Assignment />;
            case 'results':
                return <Results />;
            case 'attendence':
                return <Attendence />;
            case 'lectures':
                return <Lectures />;
            case 'curriculam':
                return <Curriculum setActiveTab={handleTabChange} />;
            case 'studymaterial':
                return <StudyMaterial />;
            case 'tsyllabus':
                return <Tsyllabus />;
             case 'tclassplans':
                return <TclassPlans />;
             case 'materialPage':
                    return <MaterialPage />;
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
            <main className="flex-1">
                {renderContent()}
            </main>
        </div>
    );
};

export default MainDashboard;
