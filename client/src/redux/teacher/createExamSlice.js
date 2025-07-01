import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch exams
export const fetchTeacherExams = createAsyncThunk(
  'createExam/fetchTeacherExams',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/exams', {
        headers: {
          Authorization: `Bearer ${token}`,
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

// Create exam
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
            Authorization: `Bearer ${token}`,
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

// Edit exam
export const editTeacherExam = createAsyncThunk(
  'createExam/editTeacherExam',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/teacher/exam/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // Do NOT return response.data unless it's the full updated document
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit teacher exam');
    }
  }
);

// Delete exam
export const deleteTeacherExam = createAsyncThunk(
  'createExam/deleteTeacherExam',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://sikshamitra.onrender.com/api/teacher/exam/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teacher exam');
    }
  }
);

// Slice
const createExamSlice = createSlice({
  name: 'createExam',
  initialState: {
    examList: [],
    loading: false,
    error: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
  },
  reducers: {
    clearTeacherExams: (state) => {
      state.examList = [];
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = null;
    },
    resetEditStatus: (state) => {
      state.editStatus = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = null;
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
      })

      // Edit exam — mark success, do NOT mutate state directly
      .addCase(editTeacherExam.pending, (state) => {
        state.editStatus = 'pending';
        state.error = null;
      })
      .addCase(editTeacherExam.fulfilled, (state) => {
        state.editStatus = 'success';
      })
      .addCase(editTeacherExam.rejected, (state, action) => {
        state.editStatus = 'failed';
        state.error = action.payload;
      })

      // Delete exam
      .addCase(deleteTeacherExam.pending, (state) => {
        state.deleteStatus = 'pending';
        state.error = null;
      })
      .addCase(deleteTeacherExam.fulfilled, (state, action) => {
        state.deleteStatus = 'success';
        state.examList = state.examList.filter((exam) => exam._id !== action.payload);
      })
      .addCase(deleteTeacherExam.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  clearTeacherExams,
  resetCreateStatus,
  resetEditStatus,
  resetDeleteStatus,
} = createExamSlice.actions;

export default createExamSlice.reducer;
