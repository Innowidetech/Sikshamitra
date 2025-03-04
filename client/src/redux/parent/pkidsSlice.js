import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: null,
  selectedStudent: null,
  status: 'idle',
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'pkids/fetchDashboardData',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get('https://sikshamitra.onrender.com/api/parent/dashboard', config);
    return response.data;
  }
);

const pkidsSlice = createSlice({
  name: 'pkids',
  initialState,
  reducers: {
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        if (action.payload.students && action.payload.students.length > 0) {
          state.selectedStudent = action.payload.students[0];
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { setSelectedStudent } = pkidsSlice.actions;
export default pkidsSlice.reducer;