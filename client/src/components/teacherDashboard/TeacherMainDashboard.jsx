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
import UploadAssignment from './UploadAssignment';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();
    const navigate = useNavigate();

    // Sync tab with URL path
    useEffect(() => {
        const path = location.pathname.split('/')[2]; // e.g. 'exams'
        if (path) setActiveTab(path);
    }, [location.pathname]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        navigate(`/teacher/${tabId}`);
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
                return <Curriculum />;
            case 'studymaterial':
                return <StudyMaterial />;
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
