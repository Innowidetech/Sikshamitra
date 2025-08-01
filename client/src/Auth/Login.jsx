 import React, { useState, useEffect } from "react";
import { UserCircle, GraduationCap, Users2, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, token, userId, userRole, employeeType, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    useremail: "",
    password: "",
    selectedRole: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    const storedEmpType = localStorage.getItem("employeeType");

    if (storedToken && storedRole && storedUserId) {
      redirectToDashboard(storedRole, storedEmpType);
    }
  }, []);

  useEffect(() => {
    if (token && userRole) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", userRole);

      if (employeeType) {
        localStorage.setItem("employeeType", employeeType);
      } else {
        localStorage.removeItem("employeeType");
      }

      if ((userRole === "admin" || userRole === "superadmin") && user) {
        localStorage.setItem("admin", JSON.stringify(user));
      }

      toast.success("Login successful!");
      redirectToDashboard(userRole, employeeType);
    }
  }, [token, userId, userRole, employeeType, user]);

  const redirectToDashboard = (role, empType = "") => {
    empType = empType?.toLowerCase();

    if (role === "superadmin") {
      navigate("/superadmin/maindashboard");
    } else if (role === "staff") {
      navigate("/superadminstaff/maindashboard");
    } else if (role === "teacher") {
      if (empType === "groupd") {
        navigate("/adminstaff/maindashboard");
      } else if (empType === "driver") {
        navigate("/driver/maindashboard");
      } else {
        navigate("/teacher/maindashboard");
      }
    } else if (role === "admin") {
      navigate("/admin/maindashboard");
    } else if (role === "parent") {
      navigate("/parents/maindashboard");
    } else if (role === "student") {
      navigate("/student/maindashboard");
    }
  };

  const userTypes = [
    { id: "admin", icon: UserCircle, label: "Admin" },
    { id: "teacher", icon: GraduationCap, label: "Employee" },
    { id: "student", icon: Users, label: "Student" },
    { id: "parent", icon: Users2, label: "Parent" },
    { id: "superadmin", icon: UserCircle, label: "Super Admin" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) dispatch(clearError());
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedRole: roleId,
    }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { useremail, password, selectedRole } = formData;

    const loginPayload = {
      email: useremail,
      password,
    };

    if (selectedRole) {
      loginPayload.role = selectedRole;
    }

    try {
      await dispatch(loginUser(loginPayload)).unwrap();
    } catch (err) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FF9F1C] flex items-center justify-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
          <h2 className="text-center text-[#146192] font-bold text-2xl mb-6">LOGIN</h2>

          {/* Role Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-4 mb-6 place-items-center">
            {userTypes.map((userType) => (
              <div
                key={userType.id}
                onClick={() => handleRoleSelect(userType.id)}
                className={`flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all duration-200 ${
                  formData.selectedRole === userType.id ? "text-[#146192]" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    formData.selectedRole === userType.id
                      ? "bg-[#FF9F1C] text-white border-transparent"
                      : "border-[#FF9F1C]"
                  }`}
                >
                  <userType.icon size={20} />
                </div>
                <span className="text-xs font-medium text-center">{userType.label}</span>
              </div>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-[#146192]">E-mail / Mobile Number</label>
              <input
                type="text"
                name="useremail"
                value={formData.useremail}
                onChange={handleChange}
                placeholder="Enter your email or mobile"
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#146192]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-gray-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF9F1C] text-white py-2 font-bold text-lg rounded hover:bg-orange-600 transition"
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
