import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminStaffSidebar from "./layout/sidebar";
// import StaffDashboard from '../adminStaffDashboard/StaffDashboard';
// import StaffTask from '../adminStaffDashboard/StaffTask';
import SuperAdminStaffDashboard from "../superAdminStaffDashboard/SuperAdminStaffDashboard";
import SuperAdminStaffTask from "../superAdminStaffDashboard/SuperAdminStaffTask";
import SuperAdminQuery from "../superAdminStaffDashboard/SuperAdminQuery";
// import StaffQuery from '../adminStaffDashboard/StaffQuery';
import SuperAdminStaffSendQuery from "../superAdminStaffDashboard/SuperAdminStaffSendQuery";
// import StaffQueryReply from '../adminStaffDashboard/StaffQueryReply'; // ✅ Import''
import SuperAdminStaffQueryReply from "../superAdminStaffDashboard/SuperAdminQueryReplay";
import SuperAdminStaffCreateBlog from "../superAdminStaffDashboard/SuperAdminStaffCreateBlog";
import SuperAdminStaffBlog from "../superAdminStaffDashboard/SuperAdminStaffBlog";
import SuperAdminStaffEditBlog from "../superAdminStaffDashboard/SuperAdminStaffEditBlog";

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("staffDashboard");
  const [replyQueryData, setReplyQueryData] = useState(null);
  const location = useLocation();
  const [editBlogId, setEditBlogId] = useState(null);

  useEffect(() => {
    if (
      location.pathname === "/adminstaff" ||
      location.pathname === "/adminstaff/maindashboard"
    ) {
      setActiveTab("staffDashboard");
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSendQueryClick = () => {
    setActiveTab("sendQueryPage");
  };
  const handleEditBlog = (blogId) => {
    setEditBlogId(blogId);
    setActiveTab("editBlog");
  };

  const handleReplyView = (query) => {
    setReplyQueryData({ queryId: query._id, creatorIds: query.creatorIds });
    setActiveTab("queryReplyPage");
  };

  const handleBackToQueryList = () => {
    setReplyQueryData(null);
    setActiveTab("staffQuery");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "superAdminDashboard":
        return <SuperAdminStaffDashboard onSendQuery={handleSendQueryClick} />;
      case "superAdminStaffTask":
        return <SuperAdminStaffTask />;
      case "superAdminStaffQuery":
        return (
          <SuperAdminQuery
            onSendQuery={handleSendQueryClick}
            onReplyView={handleReplyView}
          />
        );
      case "sendQueryPage":
        return <SuperAdminStaffSendQuery />;
      case "createBlog":
        return <SuperAdminStaffCreateBlog />;
      case "editBlog":
        return (
          <SuperAdminStaffEditBlog
            blogId={editBlogId}
            onEditBlog={handleEditBlog}
          />
        );
      case "superAdminStaffBlog":
        return (
          <SuperAdminStaffBlog
            onEditBlog={handleEditBlog}
            onCreateBlog={() => setActiveTab("createBlog")}
          />
        );
      case "queryReplyPage":
        return (
          <SuperAdminStaffQueryReply
            id={replyQueryData?.queryId}
            goBack={handleBackToQueryList}
          />
        );
      default:
        return <SuperAdminStaffDashboard onSendQuery={handleSendQueryClick} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminStaffSidebar
        setActiveSection={handleTabChange}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default MainDashboard;
