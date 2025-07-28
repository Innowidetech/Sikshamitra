import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DriverSidebar from './layout/driverSidebar';
import DriverTransportation from '../driverDashboard/DriverTransportation';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('transportation');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split('/driver/')[1];
    const tab = path || 'transportation';
    setActiveTab(tab);
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/driver/${tabId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'transportation':
        return <DriverTransportation />;
      default:
        return <DriverTransportation />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <DriverSidebar
        setActiveSection={handleTabChange}
        activeTab={activeTab}
      />
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default MainDashboard;
