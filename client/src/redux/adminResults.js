import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Async thunk for fetching results
export const fetchResults = createAsyncThunk(
  'adminResults/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/results', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch results');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminResultsSlice = createSlice({
  name: 'adminResults',
  initialState: {
    results: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminResultsSlice.actions;
export default adminResultsSlice.reducer;