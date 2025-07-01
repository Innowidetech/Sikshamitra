import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Replace this with actual token management logic
const getToken = () => localStorage.getItem('token');

// ✅ Async thunk to fetch timetable (GET)
export const fetchLectureTimetable = createAsyncThunk(
  'lecture/fetchLectureTimetable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/timetable',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch timetable'
      );
    }
  }
);

// ✅ Async thunk to create/update timetable (POST)
export const createOrUpdateLectureTimetable = createAsyncThunk(
  'lecture/createOrUpdateLectureTimetable',
  async (timetableData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/timetable',
        timetableData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create/update timetable'
      );
    }
  }
);

// ✅ Async thunk to create online lecture (POST)
export const createOnlineLecture = createAsyncThunk(
  'lecture/createOnlineLecture',
  async (lectureData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/onlineLectures',
        lectureData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create online lecture'
      );
    }
  }
);

// ✅ Async thunk to delete a timetable period (DELETE)
export const deleteLecturePeriod = createAsyncThunk(
  'lecture/deleteLecturePeriod',
  async (periodId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `https://sikshamitra.onrender.com/api/teacher/timetable/${periodId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return { periodId, message: response.data?.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete timetable period'
      );
    }
  }
);

// ✅ Initial State
const lectureSlice = createSlice({
  name: 'lecture',
  initialState: {
    loading: false,
    data: [], // assuming data is an array of periods
    error: null,
    onlineLectureStatus: {
      loading: false,
      success: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch timetable
      .addCase(fetchLectureTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLectureTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLectureTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create/update timetable
      .addCase(createOrUpdateLectureTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateLectureTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createOrUpdateLectureTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create online lecture
      .addCase(createOnlineLecture.pending, (state) => {
        state.onlineLectureStatus.loading = true;
        state.onlineLectureStatus.success = false;
        state.onlineLectureStatus.error = null;
      })
      .addCase(createOnlineLecture.fulfilled, (state) => {
        state.onlineLectureStatus.loading = false;
        state.onlineLectureStatus.success = true;
      })
      .addCase(createOnlineLecture.rejected, (state, action) => {
        state.onlineLectureStatus.loading = false;
        state.onlineLectureStatus.error = action.payload;
      })

      // ✅ Delete timetable period
      .addCase(deleteLecturePeriod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLecturePeriod.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.periodId;
        if (Array.isArray(state.data)) {
          state.data = state.data.filter(period => period._id !== deletedId);
        }
      })
      .addCase(deleteLecturePeriod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lectureSlice.reducer;
