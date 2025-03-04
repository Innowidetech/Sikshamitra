import React, { useState } from 'react';
import TeacherSidebar from './layout/TeacherSidebar';
import TeacherDashboard from './TeacherDashboard';
import MyStudents from './MyStudents';
import Assignment from './Assignments';
import Results from './Results';
import Attendence from './Attendence';
import Lectures from './Lectures';
import Curriculum from './Curriculum';
import StudyMaterial from './StudeyMaterial';
import CreateExams from './CreateExams';
import About from './About';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

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
                return <Curriculum />;
            case 'studymaterial':
                return <StudyMaterial />;
            case 'createexam':
                return <CreateExams />;
            case 'about':
                return <About />;
            default:
                return <TeacherDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <TeacherSidebar setActiveSection={setActiveTab} activeTab={activeTab} />
            <main className="flex-1">
                {renderContent()}
            </main>
        </div>
    );
};

export default MainDashboard;
