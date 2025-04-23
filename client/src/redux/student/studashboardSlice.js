import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  attendance: null,
  notices: [],
  calendar: [],
  calendarByDate: null,
  loading: false,
  error: null,
};

// Fetch student profile
export const fetchProfile = createAsyncThunk(
  'studentDashboard/fetchProfile',
  async (_, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch('https://sikshamitra.onrender.com/api/student/getProfile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  }
);

// Fetch attendance
export const fetchAttendance = createAsyncThunk(
  'studentDashboard/fetchAttendance',
  async ({ month, year } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      let url = 'https://sikshamitra.onrender.com/api/student/attendance';
      if (month && year) {
        url += `/${month}/${year}`;
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data || !data.monthlySummary || Object.keys(data.monthlySummary).length === 0) {
        return {
          monthlySummary: {
            totalDays: 0,
            present: 0,
            absent: 0,
            holiday: 0,
            presentPercentage: '0%',
          },
          todayAttendance: 'No Record',
          todayDate: new Date().toISOString(),
        };
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch attendance');
    }
  }
);

// Fetch all notices
export const fetchNotices = createAsyncThunk(
  'studentDashboard/fetchNotices',
  async (_, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch('https://sikshamitra.onrender.com/api/student/notice', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch notices');
    const data = await response.json();
    return data;
  }
);

// Fetch academic calendar
export const fetchCalendar = createAsyncThunk(
  'studentDashboard/fetchCalendar',
  async (_, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch('https://sikshamitra.onrender.com/api/student/calendar', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch calendar');
    return await response.json();
  }
);

// Fetch calendar by date
export const fetchCalendarByDate = createAsyncThunk(
  'studentDashboard/fetchCalendarByDate',
  async (calendarDate, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`https://sikshamitra.onrender.com/api/student/calendar/${calendarDate}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch calendar by date');
    return await response.json();
  }
);

// Slice creation
const studentDashboardSlice = createSlice({
  name: 'studentDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Notices
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.Notices || [];
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Calendar
      .addCase(fetchCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendar = action.payload.calendars || []; // 🔥 Correct key here
      })
      .addCase(fetchCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Calendar by date
      .addCase(fetchCalendarByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.calendarByDate = action.payload.calendars || null; // Adjusted key too
      })
      .addCase(fetchCalendarByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentDashboardSlice.reducer;
