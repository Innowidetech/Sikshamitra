import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch attendance with optional filters
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ month, year, date }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = {};

      if (month) params.month = month;
      if (year) params.year = year;
      if (date) params.date = date;

      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/attendance', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params,
      });

      return response.data.attendance;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendance: (state) => {
      state.attendanceData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
