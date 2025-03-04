import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://sikshamitra.onrender.com/api/admin';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const initialState = {
  activeStudents: {
    activeCount: 0,
    inactiveCount: 0,
    activeRatio: "0.00",
    inactiveRatio: "0.00"
  },
  studentsByGender: {
    totalStudents: 0,
    male: 0,
    female: 0,
    maleRatio: "0.00",
    femaleRatio: "0.00",
    primaryStudents: 0,
    primaryMale: 0,
    primaryFemale: 0,
    primaryMaleRatio: "0.00",
    primaryFemaleRatio: "0.00",
    secondaryStudents: 0,
    secondaryMale: 0,
    secondaryFemale: 0,
    secondaryMaleRatio: "0.00",
    secondaryFemaleRatio: "0.00"
  },
  notices: [],
  counts: {
    students: 0,
    teachers: 0,
    parents: 0,
    earnings: 0
  },
  accounts: [],
  calendar: [],
  loading: {
    counts: false,
    activeStudents: false,
    studentsByGender: false,
    notices: false,
    accounts: false,
    calendar: false
  },
  error: null
}

export const createCalendarEvent = createAsyncThunk(
  'dashboard/createCalendarEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/calendar`, eventData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create calendar event');
    }
  }
);

export const fetchCalendar = createAsyncThunk(
  'dashboard/fetchCalendar',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/calendar`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar events');
    }
  }
);

export const fetchAccounts = createAsyncThunk(
  'dashboard/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/accounts`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts');
    }
  }
);

export const createNotice = createAsyncThunk(
  'dashboard/createNotice',
  async (noticeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/notice`, noticeData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create notice');
    }
  }
);

export const fetchCounts = createAsyncThunk(
  'dashboard/fetchCounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/count`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch counts');
    }
  }
);

export const fetchActiveStudents = createAsyncThunk(
  'dashboard/fetchActiveStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/students/ratio`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active students');
    }
  }
);

export const fetchStudentsByGender = createAsyncThunk(
  'dashboard/fetchStudentsByGender',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/students/ratio`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students by gender');
    }
  }
);

export const fetchNotices = createAsyncThunk(
  'dashboard/fetchNotices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/notice`, getAuthHeader());
      return response.data.Notices || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notices');
    }
  }
);

export const deleteNotice = createAsyncThunk(
  'dashboard/deleteNotice',
  async (noticeId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/notice/${noticeId}`, getAuthHeader());
      return noticeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notice');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Calendar Events
      .addCase(fetchCalendar.pending, (state) => {
        state.loading.calendar = true;
        state.error = null;
      })
      .addCase(fetchCalendar.fulfilled, (state, action) => {
        if (Array.isArray(action.payload.calendars)) {
          state.calendar = action.payload.calendars;
        } else {
          state.calendar = [];
        }
        state.loading.calendar = false;
      })
      .addCase(fetchCalendar.rejected, (state, action) => {
        state.loading.calendar = false;
        state.error = action.payload;
      })
      .addCase(createCalendarEvent.pending, (state) => {
        state.loading.calendar = true;
        state.error = null;
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        if (action.payload && action.payload.calendar) {
          state.calendar.push(action.payload.calendar);
        }
        state.loading.calendar = false;
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        state.loading.calendar = false;
        state.error = action.payload;
      })
      // Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading.accounts = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.loading.accounts = false;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading.accounts = false;
        state.error = action.payload;
      })
      // Create Notice
      .addCase(createNotice.pending, (state) => {
        state.loading.notices = true;
        state.error = null;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.notices.push(action.payload);
        state.loading.notices = false;
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading.notices = false;
        state.error = action.payload;
      })
      // Counts
      .addCase(fetchCounts.pending, (state) => {
        state.loading.counts = true;
        state.error = null;
      })
      .addCase(fetchCounts.fulfilled, (state, action) => {
        state.counts = action.payload;
        state.loading.counts = false;
      })
      .addCase(fetchCounts.rejected, (state, action) => {
        state.loading.counts = false;
        state.error = action.payload;
      })
      // Active Students
      .addCase(fetchActiveStudents.pending, (state) => {
        state.loading.activeStudents = true;
        state.error = null;
      })
      .addCase(fetchActiveStudents.fulfilled, (state, action) => {
        state.activeStudents = action.payload;
        state.loading.activeStudents = false;
      })
      .addCase(fetchActiveStudents.rejected, (state, action) => {
        state.loading.activeStudents = false;
        state.error = action.payload;
      })
      // Students by Gender
      .addCase(fetchStudentsByGender.pending, (state) => {
        state.loading.studentsByGender = true;
        state.error = null;
      })
      .addCase(fetchStudentsByGender.fulfilled, (state, action) => {
        state.studentsByGender = action.payload;
        state.loading.studentsByGender = false;
      })
      .addCase(fetchStudentsByGender.rejected, (state, action) => {
        state.loading.studentsByGender = false;
        state.error = action.payload;
      })
      // Notices
      .addCase(fetchNotices.pending, (state) => {
        state.loading.notices = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.notices = action.payload;
        state.loading.notices = false;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading.notices = false;
        state.error = action.payload;
      })
      // Delete Notice
      .addCase(deleteNotice.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(notice => notice._id !== action.payload);
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;