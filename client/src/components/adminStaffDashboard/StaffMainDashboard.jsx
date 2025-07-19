import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import StaffSidebar from '../adminStaffDashboard/layout/staffSidebar';
import StaffDashboard from '../adminStaffDashboard/StaffDashboard';
import StaffTask from '../adminStaffDashboard/StaffTask';
import StaffQuery from '../adminStaffDashboard/StaffQuery';
import StaffSendQuery from '../adminStaffDashboard/StaffSendQuery';
import StaffQueryReply from '../adminStaffDashboard/StaffQueryReply';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('staffDashboard');
  const [replyQueryData, setReplyQueryData] = useState(null);
  const location = useLocation();

  // Set default tab on path match
  useEffect(() => {
    if (
      location.pathname === '/adminstaff' ||
      location.pathname === '/adminstaff/maindashboard'
    ) {
      setActiveTab('staffDashboard');
    }
  }, [location.pathname]);

  // Tab change handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Triggered when "Send Query" is clicked
  const handleSendQueryClick = () => {
    setActiveTab('sendQueryPage');
  };

  // Triggered when "Reply" is clicked on a query
  const handleReplyView = (query) => {
    setReplyQueryData(query); // Contains _id and message details
    setActiveTab('queryReplyPage');
  };

  // Called from StaffQueryReply when "Back" is clicked
  const handleBackToQueryList = () => {
    setReplyQueryData(null);
    setActiveTab('staffQuery');
  };

  // Render tabs
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
        return (
          <StaffQueryReply
            data={replyQueryData}
            onBack={handleBackToQueryList}
          />
        );
      default:
        return <StaffDashboard onSendQuery={handleSendQueryClick} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <StaffSidebar setActiveSection={handleTabChange} activeTab={activeTab} />

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default MainDashboard;
