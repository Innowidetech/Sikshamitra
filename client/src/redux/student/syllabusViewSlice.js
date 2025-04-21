// src/redux/student/syllabusViewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSyllabusView = createAsyncThunk(
  'syllabusView/fetchSyllabusView',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue("Authorization token missing.");

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/syllabus',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Syllabus data fetched:", response.data); // Log the API response

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch syllabus view'
      );
    }
  }
);

const syllabusViewSlice = createSlice({
  name: 'syllabusView',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSyllabusView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSyllabusView.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSyllabusView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default syllabusViewSlice.reducer;
