import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch children (students) of the logged-in parent
export const fetchChildren = createAsyncThunk(
  'parent/fetchChildren',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/parent/children', config);
      return response.data.children;  // Ensure we return just the children array
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch children';
    }
  }
);

// Fetch student results (with optional resultId)
export const fetchStudentResults = createAsyncThunk(
  'parent/fetchStudentResults',
  async ({ studentId, resultId }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let url = `https://sikshamitra.onrender.com/api/parent/results/${studentId}`;
      if (resultId) {
        url = `https://sikshamitra.onrender.com/api/parent/result/${studentId}/${resultId}`;
      }
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch results';
    }
  }
);

const initialState = {
  children: [],
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
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
        state.error = null;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
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

export const selectChildren = (state) => state.ParentResults.children;
export const selectResults = (state) => state.ParentResults.results;
export const selectResultsLoading = (state) => state.ParentResults.loading;
export const selectResultsError = (state) => state.ParentResults.error;

export default resultsSlice.reducer;
