import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  successMessage: '',
  errorMessage: '',
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found in localStorage');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

export const createMeeting = createAsyncThunk('meeting/createMeeting', async (meetingData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://sikshamitra.onrender.com/api/parent/connect', meetingData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

const meetingSlice = createSlice({
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
        state.successMessage = action.payload?.message || 'Meeting created successfully';
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = meetingSlice.actions;
export default meetingSlice.reducer;
