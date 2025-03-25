import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch exam data
export const fetchExams = createAsyncThunk(
  'exams/fetchExams',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get('https://sikshamitra.onrender.com/api/student/exams', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Return the exams array if found
      return response.data.exams; // Adjust based on your API structure
    } catch (error) {
      // If error occurs, handle it gracefully
      if (error.response?.status === 401) {
        return rejectWithValue('Please login to view exam details');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam details');
    }
  }
);

// Exam slice
const examSlice = createSlice({
  name: 'exams',
  initialState: {
    examList: [], // Store fetched exams here
    loading: false, // Loading state for fetching
    error: null, // Error message
  },
  reducers: {
    clearExams: (state) => {
      state.examList = []; // Reset the exams list
      state.error = null; // Clear errors
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true; // Set loading to true when fetch starts
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when fetch completes
        state.examList = action.payload; // Store the fetched exams in state
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false; // Set loading to false when fetch fails
        state.error = action.payload; // Store the error message
      });
  },
});

export const { clearExams } = examSlice.actions;
export default examSlice.reducer;
