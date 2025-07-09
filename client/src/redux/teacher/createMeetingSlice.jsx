// src/redux/teacher/createMeetingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    throw new Error('No token found in localStorage');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// 🧑‍🏫 Teacher Meeting API
const MEETING_API = 'https://sikshamitra.onrender.com/api/teacher/connect';

// POST - Create Meeting
export const createMeeting = createAsyncThunk(
  'meeting/createMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(MEETING_API, meetingData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Create Meeting Error:', error.response || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create meeting'
      );
    }
  }
);

// Initial State
const initialState = {
  loading: false,
  successMessage: '',
  errorMessage: '',
};

// Slice
const createMeetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload?.message || 'Meeting created successfully';
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = createMeetingSlice.actions;
export default createMeetingSlice.reducer;
