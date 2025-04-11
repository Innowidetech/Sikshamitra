import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch syllabus aim/objective
export const fetchSyllabus = createAsyncThunk(
  'syllabus/fetchSyllabus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token not found in localStorage.");
        return rejectWithValue("Authorization token missing.");
      }

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/aimobjective',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch syllabus';
      console.error("Syllabus API Error:", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const syllabusSlice = createSlice({
  name: 'syllabus',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default syllabusSlice.reducer;
