import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching teacher exams
export const fetchTeacherExams = createAsyncThunk(
  'createExam/fetchTeacherExams',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/exams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      });

      return response.data.exams;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Please login to view teacher exams');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher exams');
    }
  }
);

// Async thunk for creating an exam (POST)
export const createTeacherExam = createAsyncThunk(
  'createExam/createTeacherExam',
  async (examData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/exams',
        examData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create teacher exam');
    }
  }
);

const createExamSlice = createSlice({
  name: 'createExam',
  initialState: {
    examList: [],
    loading: false,
    error: null,
    createStatus: null,
  },
  reducers: {
    clearTeacherExams: (state) => {
      state.examList = [];
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch exams
      .addCase(fetchTeacherExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherExams.fulfilled, (state, action) => {
        state.loading = false;
        state.examList = action.payload;
      })
      .addCase(fetchTeacherExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create exam
      .addCase(createTeacherExam.pending, (state) => {
        state.createStatus = 'pending';
        state.error = null;
      })
      .addCase(createTeacherExam.fulfilled, (state) => {
        state.createStatus = 'success';
      })
      .addCase(createTeacherExam.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearTeacherExams, resetCreateStatus } = createExamSlice.actions;
export default createExamSlice.reducer;
