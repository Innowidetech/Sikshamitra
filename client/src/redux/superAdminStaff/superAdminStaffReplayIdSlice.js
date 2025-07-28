import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to fetch a specific query by ID
export const fetchQueryById = createAsyncThunk(
  'superadminstaff/fetchQueryById',
  async (id, { rejectWithValue }) => {

    try {
      const token = localStorage.getItem('token');
     const response = await fetch(
        `https://sikshamitra.onrender.com/api/staff/saquery/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Pass token here
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const superAdminQueryReplayIdSlice = createSlice({
  name: 'superadminstaffQuery',
  initialState: {
    queries: [],
    selectedQuery: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // For fetching a specific query
      .addCase(fetchQueryById.pending, state => {
        state.loading = true;
        state.error = null;
        state.selectedQuery = null;
      })
      .addCase(fetchQueryById.fulfilled, (state, action) => {
        state.loading = false;
       state.selectedQuery = action.payload.query;
      })
      .addCase(fetchQueryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default superAdminQueryReplayIdSlice.reducer;
