import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Auth header utility
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET Teacher Profile
export const fetchTeacherProfile = createAsyncThunk(
  'about/fetchTeacherProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/getProfile',
        getAuthHeader()
      );
      return response.data; // Full response needed to access Data.profile, Data.userId, etc.
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch teacher profile'
      );
    }
  }
);

// PUT Edit Teacher Profile
export const editTeacherProfile = createAsyncThunk(
  'about/editTeacherProfile',
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        'https://sikshamitra.onrender.com/api/teacher/editProfile',
        updatedData,
        getAuthHeader()
      );
      return response.data; // Return full data structure after update
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update teacher profile'
      );
    }
  }
);

// Slice
const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    teacherProfile: null,
    loading: false,
    error: null,
    profileUpdateSuccess: false,
  },
  reducers: {
    resetProfileUpdateSuccess: (state) => {
      state.profileUpdateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherProfile = action.payload; // Contains Data.profile, Data.userId, Data.education
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editTeacherProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdateSuccess = false;
      })
      .addCase(editTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherProfile = action.payload;
        state.profileUpdateSuccess = true;
      })
      .addCase(editTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileUpdateSuccess = false;
      });
  },
});

export const { resetProfileUpdateSuccess } = aboutSlice.actions;
export default aboutSlice.reducer;

