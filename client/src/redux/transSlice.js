// src/redux/transSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch All Vehicles
export const fetchTransportationDetails = createAsyncThunk(
  'transportation/fetchTransportationDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/vehicles',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching transportation data');
    }
  }
);

// ✅ Fetch Vehicle by ID
export const fetchVehicleDetailsById = createAsyncThunk(
  'transportation/fetchVehicleDetailsById',
  async (vehicleId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const url = `https://sikshamitra.onrender.com/api/admin/vehicle/${vehicleId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Vehicle fetch failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching vehicle data');
    }
  }
);

const transSlice = createSlice({
  name: 'transportation',
  initialState: {
    transDetails: {},
    selectedVehicleDetails: null,
    vehicleDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTransportationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.transDetails = action.payload;
      })
      .addCase(fetchTransportationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchVehicleDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleDetails = action.payload;
      })
      .addCase(fetchVehicleDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transSlice.reducer;
