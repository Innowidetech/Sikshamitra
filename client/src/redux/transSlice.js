import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTransportationDetails = createAsyncThunk(
  'transportation/fetchTransportationDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/vehicles',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data?.data || {}; // full object with vehicles + counts
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Error fetching transportation data'
      );
    }
  }
);

const initialState = {
  transDetails: {
    vehicles: [],
    autos: 0,
    autoDrivers: 0,
    buses: 0,
    busDrivers: 0,
    vans: 0,
    vanDrivers: 0,
    boys: 0,
    girls: 0,
  },
  loading: false,
  error: null,
};

const transSlice = createSlice({
  name: 'transportation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default transSlice.reducer;
