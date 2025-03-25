import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch profile action with token
export const fetchProfile = createAsyncThunk(
  'student/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/student/getProfile', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch profile');
    }
  }
);

// Edit profile action with token
export const editProfile = createAsyncThunk(
  'student/editProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(
        'https://sikshamitra.onrender.com/api/student/editProfile',
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to edit profile');
    }
  }
);

const studentProfileSlice = createSlice({
  name: 'studentProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle error here
      })
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle error here
      });
  },
});

export default studentProfileSlice.reducer;
