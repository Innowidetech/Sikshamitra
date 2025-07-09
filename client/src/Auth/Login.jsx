import React, { useState, useEffect } from 'react';
import { UserCircle, GraduationCap, Users2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, token, userId, userRole, employeeType, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    useremail: '',
    password: '',
    selectedRole: ''
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('userRole');
    const storedEmpType = localStorage.getItem('employeeType');

    if (storedToken && storedRole && storedUserId) {
      redirectToDashboard(storedRole, storedEmpType);
    }
  }, []);

  useEffect(() => {
    if (token && userRole) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', userRole);

      if (employeeType) {
        localStorage.setItem('employeeType', employeeType);
      } else {
        localStorage.removeItem('employeeType');
      }

      // ✅ Store full user info if admin or superadmin (required for meeting host check)
      if ((userRole === 'admin' || userRole === 'superadmin') && user) {
        localStorage.setItem('admin', JSON.stringify(user));
      }

      toast.success('Login successful!');
      redirectToDashboard(userRole, employeeType);
    }
  }, [token, userId, userRole, employeeType, user]);

  const redirectToDashboard = (role, empType = '') => {
    empType = empType?.toLowerCase();

    if (role === 'superadmin') {
      if (empType === 'groupd') {
        navigate('/adminstaff/maindashboard');
      } else if (empType) {
        navigate('/superadminstaff/maindashboard');
      } else {
        navigate('/superadmin/maindashboard');
      }
    } else if (role === 'teacher') {
      if (empType === 'groupd') {
        navigate('/adminstaff/maindashboard');
      } else {
        navigate('/teacher/maindashboard');
      }
    } else if (role === 'admin') {
      navigate('/admin/maindashboard');
    } else if (role === 'parent') {
      navigate('/parents/maindashboard');
    } else if (role === 'student') {
      navigate('/student/maindashboard');
    }
  };

  const userTypes = [
    { id: 'admin', icon: UserCircle, label: 'Admin' },
    { id: 'teacher', icon: GraduationCap, label: 'Teacher' },
    { id: 'student', icon: Users, label: 'Student' },
    { id: 'parent', icon: Users2, label: 'Parent' },
    { id: 'superadmin', icon: UserCircle, label: 'Super Admin' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) dispatch(clearError());
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedRole: roleId
    }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { useremail, password, selectedRole } = formData;

    const loginPayload = {
      email: useremail,
      password,
      role: selectedRole || 'teacher' || ''
    };

    try {
      await dispatch(loginUser(loginPayload)).unwrap();
    } catch (err) {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-5xl mx-4 py-16 md:mx-0 md:py-0">
          <div className="grid md:grid-cols-2">
            {/* Left - Login Form */}
            <div className="bg-[#1982C4E0] p-8 md:p-12 rounded-3xl md:translate-x-10 z-70 relative">
              <div className="max-w-lg mx-auto">
                <div className="flex justify-center">
                  <div className="bg-white text-[#1982C4E0] w-16 h-16 flex items-center justify-center rounded-full">
                    <UserCircle size={32} />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-white text-sm mb-2">Email / Mobile Number</label>
                    <input
                      type="text"
                      name="useremail"
                      value={formData.useremail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#5AA7D7] text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter email or mobile number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#5AA7D7] text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-[#1982C4] py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Logging in...' : 'LOGIN'}
                  </button>
                </form>

                <div className="flex items-center justify-end">
                  <label className="ml-2 mt-4 text-sm md:text-lg text-white hover:underline cursor-pointer">
                    Forgot password?
                  </label>
                </div>
              </div>
            </div>

            {/* Right - Role Selection */}
            <div className="flex flex-col items-center justify-center md:border-t md:border-b md:border-r border-[#1982C4] p-8 md:p-12 rounded-3xl space-y-6 bg-[#1982C417]">
              <h1 className="text-2xl font-medium mb-6">LOG-IN</h1>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {userTypes.map((userType) => (
                  <div
                    key={userType.id}
                    onClick={() => handleRoleSelect(userType.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg space-y-2 cursor-pointer transition-colors
                      ${formData.selectedRole === userType.id
                        ? 'bg-[#1982C4] text-white'
                        : 'hover:bg-[#1982C4] hover:text-white'}`}
                  >
                    <userType.icon className="w-14 h-14 border rounded-full p-2 bg-[#1982C46E]" />
                    <span className="text-lg">{userType.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
