// redux/teacher/teaAttendanceSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTeaAttendance = createAsyncThunk(
  'teaAttendance/fetchTeaAttendance',
  async ({ date, month, year, studentName } = {}, thunkAPI) => {
    try {
      const params = {};
      if (date) params.date = date;
      if (month) params.month = month;
      if (year) params.year = year;
      if (studentName) params.studentName = studentName;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/attendance', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const teaAttendanceSlice = createSlice({
  name: 'teaAttendance',
  initialState: {
    attendance: [],
    summary: {
      total: 0,
      present: 0,
      absent: 0,
      holiday: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeaAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeaAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.attendance || [];
        state.summary = action.payload.summary || {
          total: 0,
          present: 0,
          absent: 0,
          holiday: 0,
        };
      })
      .addCase(fetchTeaAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default teaAttendanceSlice.reducer;
