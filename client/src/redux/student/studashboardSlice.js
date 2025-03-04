import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchAttendance = createAsyncThunk(
  'studentDashboard/fetchAttendance',
  async () => {
    const token = localStorage.getItem('token'); 
    const response = await fetch('https://sikshamitra.onrender.com/api/student/attendance', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch attendance data');
    }
    
    const data = await response.json();
    return data;
  }
);

export const fetchNotices = createAsyncThunk(
  'studentDashboard/fetchNotices',
  async () => {
    const token = localStorage.getItem('token'); 
    const response = await fetch('https://sikshamitra.onrender.com/api/student/notice', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notices');
    }

    const data = await response.json();
    return data;
  }
);

const initialState = {
  attendance: {
    overall: 0,
    monthly: [],
    loading: false,
    error: null
  },
  notices: {
    data: [],
    loading: false,
    error: null
  }
};

const studentDashboardSlice = createSlice({
  name: 'studentDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Attendance cases
      .addCase(fetchAttendance.pending, (state) => {
        state.attendance.loading = true;
        state.attendance.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.attendance.loading = false;
        state.attendance.overall = action.payload.overall;
        state.attendance.monthly = action.payload.monthly;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = action.error.message;
      })
      // Notice cases
      .addCase(fetchNotices.pending, (state) => {
        state.notices.loading = true;
        state.notices.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.notices.loading = false;
        state.notices.data = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.notices.loading = false;
        state.notices.error = action.error.message;
      });
  },
});

export default studentDashboardSlice.reducer;