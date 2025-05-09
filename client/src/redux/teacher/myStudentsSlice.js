import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch students using the teacher's API
export const fetchMyStudents = createAsyncThunk(
  'students/fetchMyStudents',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Get token from state
      console.log("Using token:", token);  // Debugging token usage

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/getStudents',
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      console.log("Students data fetched:", response.data);  // Log response to verify structure
      return response.data;  // Return the fetched data
    } catch (err) {
      console.error("Error fetching students:", err);  // Log errors
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch students'  // Return error message if any
      );
    }
  }
);

// Redux slice to manage student data
const myStudentsSlice = createSlice({
  name: 'students',
  initialState: {
    data: { parents: [] }, // Set initial data structure to match API response
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
        state.data = action.payload;  // Update state with fetched data
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Handle errors
      });
  },
});

export default myStudentsSlice.reducer;