// redux/forgotPasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/auth/forgotPassword',
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// Thunk to reset password using email + OTP + newPassword
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/auth/resetPassword',
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    loading: false,
    step: 1, // 1: Email, 2: OTP + Password
    successMessage: null,
    error: null,
  },
  reducers: {
    resetForgotPasswordState: (state) => {
      state.loading = false;
      state.step = 1;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || 'OTP sent successfully';
        state.step = 2;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send OTP';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || 'Password reset successful';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to reset password';
      });
  },
});

export const { resetForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
