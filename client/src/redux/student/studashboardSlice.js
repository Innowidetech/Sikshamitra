// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Initial state
// const initialState = {
//   attendance: [], // Will store attendance data per month
//   notices: [],
//   loading: false,
//   error: null,
// };

// // Async action to fetch attendance data for a specific month and year
// export const fetchAttendance = createAsyncThunk(
//   'studentDashboard/fetchAttendance',
//   async ({ month, year }) => {
//     try {
//       const response = await axios.get('https://sikshamitra.onrender.com/api/student/attendance', {
//         params: {
//           month: month, // Pass month to API
//           year: year,   // Pass year to API
//         },
//       });
      
//       // Assuming API response structure
//       return response.data.attendance; // Make sure 'attendance' exists in the response body
//     } catch (error) {
//       throw new Error('Error fetching attendance data');
//     }
//   }
// );

// // Async action to fetch notices
// export const fetchNotices = createAsyncThunk(
//   'studentDashboard/fetchNotices',
//   async () => {
//     try {
//       const response = await axios.get('https://sikshamitra.onrender.com/api/student/notices');
//       return response.data;
//     } catch (error) {
//       throw new Error('Error fetching notices');
//     }
//   }
// );

// const studentDashboardSlice = createSlice({
//   name: 'studentDashboard',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.attendance = action.payload; // Store the attendance data
//       })
//       .addCase(fetchAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     builder
//       .addCase(fetchNotices.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotices.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notices = action.payload;
//       })
//       .addCase(fetchNotices.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default studentDashboardSlice.reducer;


// src/redux/student/studentDashboardSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state for the student dashboard
const initialState = {
  profile: null,
  attendance: [],
  notices: [],
  loading: false,
  error: null,
};

// Fetch student profile
export const fetchProfile = createAsyncThunk(
  'studentDashboard/fetchProfile',
  async (_, { getState }) => {
    // Get token from Redux state or localStorage
    const token = getState().auth.token || localStorage.getItem('token');
    
    // Make sure token exists
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('https://sikshamitra.onrender.com/api/student/getProfile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }
);

// Fetch student attendance (optional month and year)
export const fetchAttendance = createAsyncThunk(
  'studentDashboard/fetchAttendance',
  async ({ month = '', year = '' }, { getState }) => {
    // Get token from Redux state or localStorage
    const token = getState().auth.token || localStorage.getItem('token');
    
    // Make sure token exists
    if (!token) {
      throw new Error('No token found');
    }

    const url = `https://sikshamitra.onrender.com/api/student/attendance?month=${month}&year=${year}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  }
);

// Fetch notices
export const fetchNotices = createAsyncThunk(
  'studentDashboard/fetchNotices',
  async (_, { getState }) => {
    // Get token from Redux state or localStorage
    const token = getState().auth.token || localStorage.getItem('token');
    
    // Make sure token exists
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('https://sikshamitra.onrender.com/api/student/notice', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) throw new Error('Failed to fetch notices');
    return response.json();
  }
);

const studentDashboardSlice = createSlice({
  name: 'studentDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Attendance
    builder.addCase(fetchAttendance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAttendance.fulfilled, (state, action) => {
      state.loading = false;
      state.attendance = action.payload;
    });
    builder.addCase(fetchAttendance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Notices
    builder.addCase(fetchNotices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotices.fulfilled, (state, action) => {
      state.loading = false;
      state.notices = action.payload;
    });
    builder.addCase(fetchNotices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default studentDashboardSlice.reducer;
