import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendOtp,
  resetPassword,
  resetForgotPasswordState,
} from '../redux/forgotPasswordSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { loading, successMessage, error } = useSelector((state) => state.forgotPassword);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    dispatch(sendOtp({ email }));
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Move to password reset step
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(resetPassword({ email, otp, newPassword }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      if (step === 1) setStep(2); // After OTP sent
      else if (step === 3) {
        // After password reset
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }

      dispatch(resetForgotPasswordState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetForgotPasswordState());
    }
  }, [successMessage, error, step, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF9F1C]">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-center text-[#146192] mb-2">Forgot Password</h2>
            <p className="text-center text-gray-700 text-sm mb-4">
              Enter your email ID. We will send a 6 digit OTP to your email.
            </p>
            <form onSubmit={handleEmailSubmit}>
              <label className="text-[#146192] text-sm">E-mail</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded mt-1 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FF9F1C] text-white font-semibold py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-center text-[#146192] mb-2">Verify OTP</h2>
            <p className="text-center text-gray-700 text-sm mb-4">
              Enter the 6-digit OTP sent to your email.
            </p>
            <form onSubmit={handleOtpSubmit}>
              <label className="text-[#146192] text-sm">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 border border-gray-300 rounded mt-1 mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FF9F1C] text-white font-semibold py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold text-center text-[#146192] mb-4">Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
              <label className="text-[#146192] text-sm">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-3 border border-gray-300 rounded mt-1 mb-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label className="text-[#146192] text-sm">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-3 border border-gray-300 rounded mt-1 mb-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FF9F1C] text-white font-semibold py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <div
          className="mt-4 text-sm text-[#146192] underline text-center cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          Back to Login
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
