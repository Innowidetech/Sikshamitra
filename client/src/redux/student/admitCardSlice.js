import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch admit card data
export const fetchAdmitCard = createAsyncThunk(
  'admitCard/fetchAdmitCard',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get('https://sikshamitra.onrender.com/api/student/admitCard', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Return the admit card data if found
      return response.data.admitCard; // Adjust based on your API structure
    } catch (error) {
      // If error occurs, handle it gracefully
      if (error.response?.status === 401) {
        return rejectWithValue('Please login to view admit card details');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admit card details');
    }
  }
);

// Admit card slice
const admitCardSlice = createSlice({
  name: 'admitCard',
  initialState: {
    admitCard: null, // Store fetched admit card here
    loading: false, // Loading state for fetching
    error: null, // Error message
  },
  reducers: {
    clearAdmitCard: (state) => {
      state.admitCard = null; // Reset the admit card
      state.error = null; // Clear any errors
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmitCard.pending, (state) => {
        state.loading = true; // Set loading to true when fetch starts
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAdmitCard.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when fetch completes
        state.admitCard = action.payload; // Store the fetched admit card in state
      })
      .addCase(fetchAdmitCard.rejected, (state, action) => {
        state.loading = false; // Set loading to false when fetch fails
        state.error = action.payload; // Store the error message
      });
  },
});

export const { clearAdmitCard } = admitCardSlice.actions;
export default admitCardSlice.reducer;
