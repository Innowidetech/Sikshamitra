import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch Parent Details and Student Data
export const fetchParentDetails = createAsyncThunk(
  'parent/fetchParentsDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/parent/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the entire data for easy access
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Notices (if needed separately)
export const fetchNotices = createAsyncThunk(
  'parent/fetchNotices',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/notices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.notices;  // Assuming the notices are inside response.data.notices
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Calendar Events (updated to return response.data.calendars)
export const fetchCalendar = createAsyncThunk(
  'parent/fetchCalendar',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/parent/calendar', getAuthHeader());
      console.log('Calendar API Response:', response.data); // Debugging line
      return response.data.calendars; // <-- Updated here to get the array inside 'calendars'
    } catch (error) {
      console.error('Calendar API Error:', error); // Debugging line
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar events');
    }
  }
);

const parentDashboard = createSlice({
  name: 'parent',
  initialState: {
    parent: [],
    students: [], // Array of student data
    totalStudents: 0,
    loading: false,
    error: null,
    calendar: [], // Array to store calendar events
  },
  reducers: {
    addparents: (state, action) => {
      state.parent.push(action.payload);
    },
    setTotalStudents: (state, action) => {
      state.totalStudents = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Parent Details
    builder
      .addCase(fetchParentDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.parent = action.payload; // Store the parent data
        state.students = action.payload.students || []; // Store the student data
        state.totalStudents = state.students.length; // Total number of students
      })
      .addCase(fetchParentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Notices
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload; // Store notices
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Calendar Events
    builder
      .addCase(fetchCalendar.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendar = action.payload; // Store calendar events array here
      })
      .addCase(fetchCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addparents, setTotalStudents } = parentDashboard.actions;

export default parentDashboard.reducer;
