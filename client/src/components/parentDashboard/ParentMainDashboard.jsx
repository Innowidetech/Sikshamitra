import React, { useState } from 'react';
import ParentSidebar from './layout/ParentSidebar';
import ParentDashboard from './ParentDashboard';
import Kids from './Kids';
import Results from './Results';
import Expenses from './Expenses';
import Curriculam from './Curriculam';
import Exams from './Exams';
import Fees from './Fees';
import Query from './Query';
import AnnualResult from './AnnualResult';

const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ParentDashboard />;
            case 'kids':
                return <Kids />;
            case 'results':
                return <Results />;
            case 'annualresult':
                return <AnnualResult />;
            case 'expenses':
                return <Expenses />;
            case 'curriculam':
                return <Curriculam />;
            case 'exams':
                return <Exams />;
            case 'fees':
                return <Fees />;
            case 'query':
                return <Query />;
            default:
                return <ParentDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <ParentSidebar setActiveSection={setActiveTab} activeTab={activeTab} />
            <main className="flex-1 overflow-y-auto ml-64">
                {renderContent()}
            </main>
        </div>
    );
};

export default MainDashboard;