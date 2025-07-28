// redux/parent/ptransportationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPTransportationDetails = createAsyncThunk(
  'ptransportation/fetchPTransportationDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // ✅ Move this inside the thunk

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/parent/transportation',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Something went wrong');
    }
  }
);

const ptransportationSlice = createSlice({
  name: 'ptransportation',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPTransportationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPTransportationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPTransportationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ptransportationSlice.reducer;
