import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching exam details
export const fetchExams = createAsyncThunk(
  'exams/fetchExams',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/parent/exams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Return only the `allExams` part of the API response
      return response.data.allExams;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Please login to view exam details');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam details');
    }
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState: {
    examList: [],    // Store fetched exams here
    loading: false,  // Loading state to track async fetch status
    error: null,     // Error state to store any error messages
  },
  reducers: {
    clearExams: (state) => {
      state.examList = [];  // Reset the exams list
      state.error = null;   // Clear any errors
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;    // Set loading to true when fetch starts
        state.error = null;      // Clear previous errors
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;        // Set loading to false when fetch completes
        state.examList = action.payload;  // Store the fetched exams in the state
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;      // Set loading to false when fetch fails
        state.error = action.payload; // Store the error message
      });
  },
});

export const { clearExams } = examSlice.actions;
export default examSlice.reducer;