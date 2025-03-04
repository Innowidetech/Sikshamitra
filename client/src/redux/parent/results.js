import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStudentResults = createAsyncThunk(
  'parent/fetchStudentResults',
  async ({ classParam, section, examType, studentName }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // URL parameters reordered to match class/section/examtype/studentname
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/parent/results/${classParam}/${section}/${examType}/${encodeURIComponent(studentName)}`,
        config
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch results';
    }
  }
);

const initialState = {
  results: {
    theory: [],
    labs: [],
    totalMarks: 0,
    percentage: 0
  },
  loading: false,
  error: null
};

const resultsSlice = createSlice({
  name: 'parentResults',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = initialState.results;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearResults } = resultsSlice.actions;

export const selectResults = (state) => state.ParentResults.results;
export const selectResultsLoading = (state) => state.ParentResults.loading;
export const selectResultsError = (state) => state.ParentResults.error;

export default resultsSlice.reducer;