import React, { useState } from 'react';
import StudentSidebar from './layout/StudentSidebar';
import StudentDashboard from './StudentDashboard';
import Results from './Results';
import TimeTable from './TimeTable';
import Assignment from './Assignments';
import StudyMaterial from './StudyMaterial';
import Syllabus from './Syllabus';
import Exams from './Exams';
import AdmitCard from './AdmitCard';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
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
            default:
                return <StudentDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen">
        <StudentSidebar setActiveSection={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto ml-64">
            {renderContent()}
        </main>
    </div>
    );
};

export default MainDashboard;
