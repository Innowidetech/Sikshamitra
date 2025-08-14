import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginExam = () => {
  const [examId, setExamId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/user/examLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token in localStorage (if applicable)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Optionally save other user info
      localStorage.setItem('examId', examId);
      localStorage.setItem('email', email);

      // Navigate to OnlineExam page
      navigate('/online-exam');
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF9F1C]">
      <div className="bg-white p-10 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-center text-xl font-semibold text-[#004A78] mb-6">LOGIN</h2>

        {errorMsg && (
          <div className="text-red-500 text-sm text-center mb-4">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[#004A78] text-sm font-medium">Exam Id</label>
            <input
              type="text"
              placeholder="Enter your exam id"
              className="w-full mt-1 px-4 py-2 bg-gray-100 rounded outline-none"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[#004A78] text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email id"
              className="w-full mt-1 px-4 py-2 bg-gray-100 rounded outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF9F1C] text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginExam;
