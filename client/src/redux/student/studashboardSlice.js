import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  attendance: [], // Will store attendance data per month
  notices: [],
  loading: false,
  error: null,
};

// Async action to fetch attendance data for a specific month and year
export const fetchAttendance = createAsyncThunk(
  'studentDashboard/fetchAttendance',
  async ({ month, year }) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/student/attendance', {
        params: {
          month: month, // Pass month to API
          year: year,   // Pass year to API
        },
      });
      
      // Assuming API response structure
      return response.data.attendance; // Make sure 'attendance' exists in the response body
    } catch (error) {
      throw new Error('Error fetching attendance data');
    }
  }
);

// Async action to fetch notices
export const fetchNotices = createAsyncThunk(
  'studentDashboard/fetchNotices',
  async () => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/student/notices');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching notices');
    }
  }
);

const studentDashboardSlice = createSlice({
  name: 'studentDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload; // Store the attendance data
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentDashboardSlice.reducer;
