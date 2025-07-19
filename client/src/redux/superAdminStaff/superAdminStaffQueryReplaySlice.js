import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch super admin staff queries
export const fetchSuperAdminQueries = createAsyncThunk(
  'superAdminQueries/fetchSuperAdminQueries',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/staff/saquery',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // { queriesReceived: [...], queriesSent: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const superAdminQuerySlice = createSlice({
  name: 'superAdminQueries',
  initialState: {
    queriesReceived: [],
    queriesSent: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queriesReceived = action.payload.queriesReceived || [];
        state.queriesSent = action.payload.queriesSent || [];
      })
      .addCase(fetchSuperAdminQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default superAdminQuerySlice.reducer;
