import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./layout/SuperAdminSidebar";
import SuperAdminDashboard from "../superAdminDashboard/SuperAdminDashbord";
import SuperAdminSchoolDetails from "../superAdminDashboard/SuperAdminSchoolDetails";
import SuperAdminSchoolRegister from "../superAdminDashboard/SuperAdminSchoolRegister";
import SuperAdminAccounts from "../superAdminDashboard/SuperAdminAccounts";
import SuperAdminAccountsAddInc from "../superAdminDashboard/SuperAdminAccountsAddInc";
import SuperAdminAccountsAddExp from "../superAdminDashboard/SuperAdminAccountsAddExp";
import SuperAdminAccountsEditInc from "../superAdminDashboard/SuperAdminAccountsEditInc";
import SuperAdminStaff from "./Staff/SuperAdminStaff";
import SuperAdminAccountsEditExp from "../superAdminDashboard/SuperAdminAccountsEditExp";
import SuperAdminTask from "./Task/SuperAdminTask";
import SuperAdminAddStaff from "./Staff/SuperAdminAddStaff";
import SuperAdminEditStaff from "./Staff/SuperAdminEditStaff";
import SuperAdminCompletedTask from "./Task/SuperAdminCompletedTask";
import SuperAdminAssign from "./Task/SuperAdminAssign";
import SuperAdminBlog from "./Blog/SuperAdminBlog";
import SuperAdminCreateBlog from "./Blog/SuperAdminCreateBlog";
import SuperAdminConnect from "./Connect/SuperAdminConnect";
import SuperAdminQuery from "./Connect/SuperAdminQuery";

const SuperAdminMainDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/school-details")) setActiveTab("school-details");
    else if (path.includes("/account")) setActiveTab("account");
    else if (path.includes("/employee")) setActiveTab("employee");
    else if (path.includes("/task")) setActiveTab("task");
    else if (path.includes("/blog")) setActiveTab("blog");
    else if (path.includes("/connect-queries"))
      setActiveTab("connect & queries");
    else setActiveTab("dashboard");
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    switch (tabId) {
      case "dashboard":
        navigate("/superadmin/maindashboard");
        break;
      case "school-details":
        navigate("/superadmin/school-details");
        break;
      case "account":
        navigate("/superadmin/account");
        break;
      case "employee":
        navigate("/superadmin/employee");
        break;
      case "task":
        navigate("/superadmin/task");
        break;
      case "blog":
        navigate("/superadmin/blog");
        break;
      case "connect & queries":
        navigate("/superadmin/connect-queries");
        break;
      default:
        navigate("/superadmin/maindashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar setActiveSection={handleTabChange} activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 md:ml-64">
        <Routes>
          <Route path="maindashboard" element={<SuperAdminDashboard />} />
          <Route path="school-details" element={<SuperAdminSchoolDetails />} />
          <Route
            path="school-details/register"
            element={<SuperAdminSchoolRegister />}
          />
          <Route path="account" element={<SuperAdminAccounts />} />
          <Route
            path="account/add-income"
            element={<SuperAdminAccountsAddInc />}
          />
          <Route
            path="account/edit-expense/:id"
            element={<SuperAdminAccountsEditExp />}
          />
          <Route
            path="account/edit-expense/:id"
            element={<SuperAdminAccountsEditExp />}
          />
          <Route
            path="account/add-expense"
            element={<SuperAdminAccountsAddExp />}
          />
          <Route
            path="account/edit-income/:id"
            element={<SuperAdminAccountsEditInc />}
          />
          <Route path="employee" element={<SuperAdminStaff />} />
          <Route path="staff/add-staff" element={<SuperAdminAddStaff />} />
          <Route
            path="staff/edit-staff/:id"
            element={<SuperAdminEditStaff />}
          />
          <Route path="task" element={<SuperAdminTask />} />
          <Route path="task/completed" element={<SuperAdminCompletedTask />} />
          <Route path="task/assign" element={<SuperAdminAssign />} />
          <Route path="blog" element={<SuperAdminBlog />} />
          <Route path="blog/create-blog" element={<SuperAdminCreateBlog />} />

          <Route path="connect-queries" element={<SuperAdminConnect />} />
          <Route path="connect-queries/Queries" element={<SuperAdminQuery />} />
          <Route
            path="*"
            element={
              <div className="text-xl font-semibold">
                Welcome to Super Admin Panel
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default SuperAdminMainDashboard;
