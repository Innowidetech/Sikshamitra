import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch timetable action with token
export const fetchTimetable = createAsyncThunk(
  'student/fetchTimetable',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/student/timetable', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch timetable');
    }
  }
);

const timetableSlice = createSlice({
  name: 'timetable',
  initialState: {
    timetable: null, // Store timetable data here
    loading: false,  // Loading state
    error: null,     // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch timetable actions
      .addCase(fetchTimetable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload; // Set timetable data when the fetch is successful
      })
      .addCase(fetchTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle error here
      });
  },
});

export default timetableSlice.reducer;
