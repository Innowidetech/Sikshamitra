// redux/resultSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllResults = createAsyncThunk(
  'student/fetchAllResults',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/results',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        banner: response.data.banner,
        results: response.data.result,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchResultById = createAsyncThunk(
  'student/fetchResultById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/student/result/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const resultSlice = createSlice({
  name: 'results',
  initialState: {
    allResults: [],
    selectedResult: null,
    banner: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResults.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload.banner;
        state.allResults = action.payload.results;
      })
      .addCase(fetchAllResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedResult = action.payload;
      })
      .addCase(fetchResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resultSlice.reducer;
