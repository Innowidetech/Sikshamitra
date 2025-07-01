import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch parent dashboard/profile data from your API
export const fetchParentDashboard = createAsyncThunk(
  'parentProfile/fetchParentDashboard',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/parent/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Updated Async thunk for editing parent profile with new API endpoint
export const editParentProfile = createAsyncThunk(
  'parentProfile/editParentProfile',
  async ({ token, profileData }, thunkAPI) => {
    try {
      const response = await axios.put('https://sikshamitra.onrender.com/api/parent/editProfile', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const parentProfileSlice = createSlice({
  name: 'parentProfile',
  initialState: {
    dashboard: null,
    dashboardLoading: false,
    dashboardError: null,
  },
  reducers: {
    resetDashboardState: (state) => {
      state.dashboard = null;
      state.dashboardLoading = false;
      state.dashboardError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchParentDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchParentDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      })
      .addCase(editParentProfile.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(editParentProfile.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(editParentProfile.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });
  },
});

export const { resetDashboardState } = parentProfileSlice.actions;
export default parentProfileSlice.reducer;
