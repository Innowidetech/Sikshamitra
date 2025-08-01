import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { logoutUser } from './redux/authSlice';

import Home from './Home';
import About from './About';
import Navbar from './Navbar';
import Footer from './Footer';
import Blog from './blog/Blog';
import Admission from './Admission';
import Contact from './Contact';
import StudentOnlinePortal from './studentdashboard/StudentOnlinePortal';
import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import EntranceExam from './studentdashboard/EntranceExam';

// Dashboards
import MainDashboard from './components/adminDashboard/MainDashboard';
import ParentMainDashboard from './components/parentDashboard/ParentMainDashboard';
import TeacherMainDashboard from './components/teacherDashboard/TeacherMaindashboard';
import StudentMainDashboard from './components/studentDashboard/StudentMainDashboard';
import AdminStaffDashboard from './components/adminStaffDashboard/StaffMainDashboard';
import SuperAdminStaffDashboard from "./components/superAdminStaffDashboard/SuperAdminStaffMainDashboard";
import SuperAdminMainDashboard from "./components/superAdminDashboard/SuperAdminMainDashbord";
import SuperAdminMetting from "./components/superAdminDashboard/SuperAdminMetting";
import SuperAdminScheduleMeeting from "./components/superAdminDashboard/Connect/SuperAdminScheduleMetting";
import DriverDashboard from './components/driverDashboard/driverMainDashboard';

// Parent Meeting
import Meeting from './components/parentDashboard/Meeting';
import Host from './components/parentDashboard/Host';
import Test from './components/parentDashboard/Test';

// Student Meeting
import ConnectPage from './components/studentDashboard/ConnectPage';
import SchedulePage from './components/studentDashboard/SchedulePage';
import InstantMeetingPage from './components/studentDashboard/InstantMeetingPage';

// Admin Meeting
import AdminConnectPage from './components/adminDashboard/AdminConnectPage';
import AdminSchedulePage from './components/adminDashboard/AdminSchedulePage';
import AdminInstantPage from './components/adminDashboard/AdminInstantPage';

// Teacher Meeting
import ScheduleMeeting from './components/parentDashboard/ScheduleMeeting';
import TeacherMeeting from './components/teacherDashboard/TeacherMeeting';
import CreateMeeting from './components/teacherDashboard/CreateMeeting';

// Auth Guard
import PrivateRoute from './components/PrivateRoute';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const employeeType = localStorage.getItem('employeeType')?.toLowerCase();

  // Handle logout on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("employeeType");
      dispatch(logoutUser());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dispatch]);

  // Prevent back navigation
  useEffect(() => {
    if (token) {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [token]);

  if (token && location.pathname === "/login") {
    if (userRole === "teacher" && employeeType === "groupd") {
      return <Navigate to="/adminstaff/maindashboard" replace />;
    }
    if (userRole === "staff") {
      return <Navigate to="/superadminstaff/maindashboard" replace />;
    }
    if (userRole === "superadmin") {
      return <Navigate to="/superadmin/maindashboard" replace />;
    }

    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/maindashboard" replace />;
      case "teacher":
        return <Navigate to="/teacher/maindashboard" replace />;
      case "student":
        return <Navigate to="/student/maindashboard" replace />;
      case "parent":
        return <Navigate to="/parents/maindashboard" replace />;
      case "staff":
        return <Navigate to="/superadminstaff/maindashboard" replace />;
      case "superadmin":
        return <Navigate to="/superadmin/maindashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const noNavbarFooterPaths = [
    "/login",
    "/applyonline",
    "/admin",
    "/parents",
    "/teacher",
    "/student",
    "/adminstaff",
    "/meeting",
    "/superadminstaff",
    "/superadmin",
    "/connect",
    "/schedulepage",
    "/instantmeeting",
    "/adminconnectpage",
    "/adminschedulepage",
    "/admininstantpage",
    "/scheduled-meeting",
    "/teacher-meeting",
    "/create-meeting",
    "/superadminmeeting",
    "/driver",
    "/host",
    "/test",
    "/forgot-password"
  ];

  const isNoNavbarFooter = noNavbarFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!isNoNavbarFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/applyonline" element={<StudentOnlinePortal />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/entranceexam" element={<EntranceExam />} />

        {/* Parent Meeting */}
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/superadminmeeting" element={<SuperAdminMetting />} />
        <Route path="/host/:meetingLink" element={<Host />} />
        <Route path="/test/:meetingLink" element={<Test />} />
        <Route path="/scheduled-meeting" element={<ScheduleMeeting />} />

        {/* Teacher Meeting */}
        <Route path="/teacher-meeting" element={<TeacherMeeting />} />
        <Route path="/create-meeting" element={<CreateMeeting />} />

        {/* Student Meeting */}
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/schedulepage" element={<SchedulePage />} />
        <Route path="/instantmeeting" element={<InstantMeetingPage />} />

        {/* Admin Meeting */}
        <Route path="/adminconnectpage" element={<AdminConnectPage />} />
        <Route path="/adminschedulepage" element={<AdminSchedulePage />} />
        <Route path="/admininstantpage" element={<AdminInstantPage />} />

        {/* Protected Dashboards */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRole="admin">
              <MainDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/parents/*"
          element={
            <PrivateRoute requiredRole="parent">
              <ParentMainDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <PrivateRoute requiredRole="teacher">
              <TeacherMainDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <PrivateRoute requiredRole="student">
              <StudentMainDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminstaff/*"
          element={
            <PrivateRoute requiredRole="teacher">
              <AdminStaffDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/superadminstaff/*"
          element={
            <PrivateRoute requiredRole="staff">
              <SuperAdminStaffDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/superadmin/*"
          element={
            <PrivateRoute requiredRole="superadmin">
              <SuperAdminMainDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/superadmin/meeting"
          element={
            <PrivateRoute requiredRole="superadmin">
              <SuperAdminMetting />
            </PrivateRoute>
          }
        />
        <Route
          path="/superadmin/shedulemeeting"
          element={
            <PrivateRoute requiredRole="superadmin">
              <SuperAdminScheduleMeeting />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver/*"
          element={
            <PrivateRoute requiredRole="teacher">
              <DriverDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isNoNavbarFooter && <Footer />}
    </>
  );
}

export default App;
