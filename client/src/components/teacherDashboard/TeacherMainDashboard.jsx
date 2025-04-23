import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import Exams from './Exams'; // ✅ import
import About from './About';
import MaterialPage from './MaterialPage';
<<<<<<< HEAD
import UploadAssignment from './UploadAssignment';
=======
import Tsyllabus from './Tsyllabus';
import TclassPlans from './Tclassplans';
>>>>>>> f8a2267d0a703a300841997028d2fe806658056e

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
                return <Assignments handleTabChange={handleTabChange} />; // ✅ Pass prop
            case 'uploadassignment': // ✅ Add this
                return <UploadAssignment />;
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
<<<<<<< HEAD
            case 'materialPage':
                return <MaterialPage />;
=======
            case 'tsyllabus':
                return <Tsyllabus />;
             case 'tclassplans':
                return <TclassPlans />;
             case 'materialPage':
                    return <MaterialPage />;
>>>>>>> f8a2267d0a703a300841997028d2fe806658056e
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
