import React,{useEffect} from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Navbar from './Navbar';
import Footer from './Footer';
import Blog from './blog/Blog';
import Admission from './Admission';
import Contact from './Contact';
import StudentOnlinePortal from './studentdashboard/StudentOnlinePortal';
import Login from './Auth/Login';
import MainDashboard from './components/adminDashboard/MainDashboard';
import ParentMainDashboard from './components/parentDashboard/ParentMainDashboard';
import TeacherMainDashboard from './components/teacherDashboard/TeacherMaindashboard';
import StudentMainDashboard from './components/studentDashboard/StudentMainDashboard';
import PrivateRoute from './components/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';


function App() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      dispatch(logout());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [token]);



  // Check if user is logged in and tries to access login page
  if (token && location.pathname === '/login') {
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/maindashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher/maindashboard" replace />;
      case 'student':
        return <Navigate to="/student/maindashboard" replace />;
      case 'parent':
        return <Navigate to="/parents/maindashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const noNavbarFooterPaths = [
    '/login',
    '/applyonline',
    '/admin',
    '/parents',
    '/teacher',
    '/student'
  ];
  
  // Check if current path starts with any of the noNavbarFooterPaths
  const isNoNavbarFooter = noNavbarFooterPaths.some(path => 
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
        
        

        {/* Protected Routes */}
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

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
      
      {!isNoNavbarFooter && <Footer />}
    </>
  );
}

export default App;