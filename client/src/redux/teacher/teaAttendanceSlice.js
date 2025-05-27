import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTeaAttendance = createAsyncThunk(
  'teaAttendance/fetchTeaAttendance',
  async ({ date, month, year, studentName } = {}, thunkAPI) => {
    try {
      const params = {};
      if (date) params.date = date;
      if (month) params.month = month;
      if (year) params.year = year;
      if (studentName) params.studentName = studentName;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/attendance',
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const postTeaAttendance = createAsyncThunk(
  'teaAttendance/postTeaAttendance',
  async ({ date, attendance }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // DEBUG LOG - check payload being sent
      console.log('Posting attendance:', { date, attendance });

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/attendance',
       { date, attendanceRecords: attendance },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('POST attendance error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const teaAttendanceSlice = createSlice({
  name: 'teaAttendance',
  initialState: {
    attendance: [],
    summary: {
      total: 0,
      present: 0,
      absent: 0,
      holiday: 0,
    },
    loading: false,
    error: null,
    postLoading: false,
    postError: null,
    postSuccess: false,
  },
  reducers: {
    resetPostStatus(state) {
      state.postLoading = false;
      state.postError = null;
      state.postSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeaAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeaAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.attendance || [];
        state.summary = action.payload.summary || {
          total: 0,
          present: 0,
          absent: 0,
          holiday: 0,
        };
      })
      .addCase(fetchTeaAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(postTeaAttendance.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
        state.postSuccess = false;
      })
      .addCase(postTeaAttendance.fulfilled, (state) => {
        state.postLoading = false;
        state.postSuccess = true;
      })
      .addCase(postTeaAttendance.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.payload || 'Failed to post attendance';
      });
  },
});

export const { resetPostStatus } = teaAttendanceSlice.actions;
export default teaAttendanceSlice.reducer;
