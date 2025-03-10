import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './layout/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import Fees from './AdminFees';
import Teachers from './Teachers';
import Students from './Students';
import Parents from './Parents';
import Accounts from './Accounts';
import Inventory from './Inventory';
import Library from './Library';
import Admission from './Admission';
import Classes from './Classes';
import Employee from './Employee';
import Results from './Results';
import Curriculam from './Curriculam';
import Header from './layout/Header';
import AdminProfile from './AdminProfile';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/admin') {
            setActiveTab('dashboard');
        }
    }, [location.pathname]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (location.pathname === '/admin/profile') {
            navigate('/admin');
        }
    };

    const renderContent = () => {
        if (location.pathname === '/admin/profile') {
            return <AdminProfile />;
        }
        
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'fees':
                return <Fees />;
            case 'teachers':
                return <Teachers />;
            case 'students':
                return <Students />;
            case 'parents':
                return <Parents />;
            case 'accounts':
                return <Accounts />;
            case 'inventory':
                return <Inventory />;
            case 'library':
                return <Library />;
            case 'admission':
                return <Admission />;
            case 'classes':
                return <Classes />;
            case 'employee':
                return <Employee />;
            case 'results':
                return <Results />;
            case 'curriculum':
                return <Curriculam />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar 
                setActiveSection={handleTabChange} 
                activeTab={activeTab}
            />
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <Header  />
                <div className="mt-20 md:mt-16">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default MainDashboard;