import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Get token from local storage
const getToken = () => localStorage.getItem('token');

// ✅ Async thunk to fetch transportation data
export const fetchTransportationDetails = createAsyncThunk(
  'transportation/fetchTransportationDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/staff/transportation',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transportation details'
      );
    }
  }
);

// ✅ PATCH: Update vehicle live location
export const updateVehicleLocation = createAsyncThunk(
  'transportation/updateVehicleLocation',
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        'https://sikshamitra.onrender.com/api/staff/vehicle-location',
        { lat, lng },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update vehicle location'
      );
    }
  }
);

// ✅ PATCH: Update student check-in, check-out, or absent
export const updateStudentAction = createAsyncThunk(
  'transportation/updateStudentAction',
  async ({ studentId, action }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/staff/transportation/${studentId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return { id: studentId, data: response.data }; // return id for local state update if needed
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update student action'
      );
    }
  }
);

// ✅ Slice
const transportationSlice = createSlice({
  name: 'transportation',
  initialState: {
    data: null,
    loading: false,
    error: null,
    updateStatus: null,
    studentUpdateStatus: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchTransportationDetails
      .addCase(fetchTransportationDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTransportationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateVehicleLocation
      .addCase(updateVehicleLocation.pending, state => {
        state.updateStatus = 'loading';
      })
      .addCase(updateVehicleLocation.fulfilled, (state, action) => {
        state.updateStatus = 'success';
      })
      .addCase(updateVehicleLocation.rejected, (state, action) => {
        state.updateStatus = 'error';
        state.error = action.payload;
      })

      // updateStudentAction
      .addCase(updateStudentAction.pending, state => {
        state.studentUpdateStatus = 'loading';
      })
      .addCase(updateStudentAction.fulfilled, (state, action) => {
        state.studentUpdateStatus = 'success';
        // Optionally update local student data here
        // const updated = action.payload;
      })
      .addCase(updateStudentAction.rejected, (state, action) => {
        state.studentUpdateStatus = 'error';
        state.error = action.payload;
      });
  },
});

export default transportationSlice.reducer;
