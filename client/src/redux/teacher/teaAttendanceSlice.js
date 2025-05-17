import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to build query string from optional parameters
const buildQueryString = ({ date, month, year }) => {
  const query = new URLSearchParams();
  if (date) query.append('date', date);
  if (month) query.append('month', month);
  if (year) query.append('year', year);
  return query.toString();
};

// Async thunk for fetching teacher attendance
export const fetchTeaAttendance = createAsyncThunk(
  'teaAttendance/fetchTeaAttendance',
  async ({ month, year, date }, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString({ month, year, date });

      const response = await fetch(
        `https://sikshamitra.onrender.com/api/teacher/attendance?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch teacher attendance');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  error: null,
  data: {
    total: 0,
    present: 0,
    absent: 0,
    holidays: 0,
  },
};

// Slice for teacher attendance
const teaAttendanceSlice = createSlice({
  name: 'teaAttendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeaAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeaAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTeaAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teaAttendanceSlice.reducer;
