import React, { useState, useEffect } from 'react';
import { UserCircle, GraduationCap, Users2, Users } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, token, userRole } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        useremail: '',
        password: '',
        selectedRole: ''
    });

    // Check if user is already logged in
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('userRole');
        
        if (storedToken && storedRole) {
            switch (storedRole) {
                case 'admin':
                    navigate('/admin/maindashboard');
                    break;
                case 'parent':
                    navigate('/parents/maindashboard');
                    break;
                case 'teacher':
                    navigate('/teacher/maindashboard');
                    break;
                case 'student':
                    navigate('/student/maindashboard');
                    break;
                default:
                    break;
            }
        }
    }, [navigate]);

    // Handle successful login
    useEffect(() => {
        if (token && userRole) {
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', userRole);
            
            toast.success('Login successful!');
            
            switch (userRole) {
                case 'admin':
                    navigate('/admin/maindashboard');
                    break;
                case 'parent':
                    navigate('/parents/maindashboard');
                    break;
                case 'teacher':
                    navigate('/teacher/maindashboard');
                    break;
                case 'student':
                    navigate('/student/maindashboard');
                    break;
                default:
                    break;
            }
        }
    }, [token, userRole, navigate]);

    const userTypes = [
        { id: 'admin', icon: UserCircle, label: 'Admin' },
        { id: 'teacher', icon: GraduationCap, label: 'Teacher' },
        { id: 'student', icon: Users, label: 'Student' },
        { id: 'parent', icon: Users2, label: 'Parent' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) dispatch(clearError());
    };

    const handleRoleSelect = (roleId) => {
        setFormData(prev => ({
            ...prev,
            selectedRole: roleId
        }));
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.selectedRole) {
            toast.error('Please select a role');
            return;
        }

        try {
            await dispatch(loginUser({
                email: formData.useremail,
                password: formData.password,
                role: formData.selectedRole
            })).unwrap();
        } catch (err) {
            toast.error(error || 'Login failed');
        }
    };

    // If already logged in, redirect based on role
    if (token) {
        switch (userRole) {
            case 'admin':
                return <Navigate to="/admin/maindashboard" replace />;
            case 'parent':
                return <Navigate to="/parents/maindashboard" replace />;
            case 'teacher':
                return <Navigate to="/teacher/maindashboard" replace />;
            case 'student':
                return <Navigate to="/student/maindashboard" replace />;
            default:
                break;
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-5xl mx-4 py-16 md:mx-0 md:py-0">
                    <div className="grid md:grid-cols-2">
                        {/* Left Side - Login Form */}
                        <div className="bg-[#1982C4E0] p-8 md:p-12 rounded-3xl md:translate-x-10 z-70 relative">
                            <div className="max-w-lg mx-auto">
                                <div className="flex justify-center">
                                    <div className="bg-white text-[#1982C4E0] w-16 h-16 flex items-center justify-center rounded-full">
                                        <UserCircle size={32} />
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <div>
                                        <label className="block text-white text-sm mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="useremail"
                                            value={formData.useremail}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-[#5AA7D7] text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            placeholder="Enter your email"
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

                        {/* Right side */}
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