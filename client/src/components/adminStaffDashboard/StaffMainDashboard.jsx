import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StaffSidebar from '../adminStaffDashboard/layout/staffSidebar';
import StaffDashboard from '../adminStaffDashboard/StaffDashboard';
import StaffTask from '../adminStaffDashboard/StaffTask';
import StaffQuery from '../adminStaffDashboard/StaffQuery';
import StaffSendQuery from '../adminStaffDashboard/StaffSendQuery';
import StaffQueryReply from '../adminStaffDashboard/StaffQueryReply'; // ✅ Import

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('staffDashboard');
  const [replyQueryData, setReplyQueryData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/adminstaff' ||
      location.pathname === '/adminstaff/maindashboard'
    ) {
      setActiveTab('staffDashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSendQueryClick = () => {
    setActiveTab('sendQueryPage');
  };

  const handleReplyView = (query) => {
    setReplyQueryData(query);
    setActiveTab('queryReplyPage');
  };

  const handleBackToQueryList = () => {
    setReplyQueryData(null);
    setActiveTab('staffQuery');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'staffDashboard':
        return <StaffDashboard onSendQuery={handleSendQueryClick} />;
      case 'staffTask':
        return <StaffTask />;
      case 'staffQuery':
        return (
          <StaffQuery
            onSendQuery={handleSendQueryClick}
            onReplyView={handleReplyView}
          />
        );
      case 'sendQueryPage':
        return <StaffSendQuery />;
      case 'queryReplyPage':
        return <StaffQueryReply data={replyQueryData} onBack={handleBackToQueryList} />;
      default:
        return <StaffDashboard onSendQuery={handleSendQueryClick} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <StaffSidebar setActiveSection={handleTabChange} activeTab={activeTab} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default MainDashboard;
