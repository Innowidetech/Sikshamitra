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
import SyllabusView from './SyllabusView'; // ✅ import
import ClassPlanView from './ClassPlanView'; // ✅ import
import BookRequest from './BookRequest';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/student') {
            setActiveTab('dashboard');
        }
    }, [location.pathname]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (
            location.pathname === '/student/profile' ||
            location.pathname === '/student/syllabus-view' ||
            location.pathname === '/student/class-plan'
        ) {
            navigate('/student');
        }
    };

    const renderContent = () => {
        if (location.pathname === '/student/profile') {
            return <StudentProfile />;
        }

        if (location.pathname === '/student/syllabus-view') {
            return <SyllabusView />;
        }

        if (location.pathname === '/student/class-plan') {
            return <ClassPlanView />;
        }

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
                return <BookRequest />;
            default:
                return <StudentDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <StudentSidebar
                setActiveSection={handleTabChange}
                activeTab={activeTab}
            />
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <StudentHeader />
                <div className="mt-20 md:mt-16">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default MainDashboard;