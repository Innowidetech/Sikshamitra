import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAdmissions = createAsyncThunk(
  'admissions/fetchAdmissions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/newAdmission', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const admissionsSlice = createSlice({
  name: 'admissions',
  initialState: {
    admissions: [],  
    loading: false,
    error: null,
    searchQuery: '',  
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addAdmission: (state, action) => {
      state.admissions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions = action.payload;  
      })
      .addCase(fetchAdmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, addAdmission } = admissionsSlice.actions;

export default admissionsSlice.reducer;
