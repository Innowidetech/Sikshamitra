import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch students
export const fetchMyStudents = createAsyncThunk(
  'students/fetchMyStudents',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Assuming token is stored in auth slice

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/getStudents',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch students';
      return rejectWithValue(message);
    }
  }
);

// Slice definition
const myStudentsSlice = createSlice({
  name: 'students',
  initialState: {
    data: {}, // Expected format: { parents: [...] }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default myStudentsSlice.reducer;
