import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/maindashboard" replace />;
      case "teacher":
        return <Navigate to="/teacher/maindashboard" replace />;
      case "student":
        return <Navigate to="/student/maindashboard" replace />;
      case "parent":
        return <Navigate to="/parents/maindashboard" replace />;
      case "adminStaff":
        return <Navigate to="/staff/maindashboard" replace />;
      case "superadmin":
        return <Navigate to="/superadmin/maindashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
