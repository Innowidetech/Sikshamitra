// redux/student/stransportationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch student transportation details
export const fetchSTransportationDetails = createAsyncThunk(
  'stransportation/fetchSTransportationDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/transportation',
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

const stransportationSlice = createSlice({
  name: 'stransportation',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSTransportationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSTransportationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSTransportationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stransportationSlice.reducer;
