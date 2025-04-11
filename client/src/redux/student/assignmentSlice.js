import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// GET: Fetch assignments
export const fetchAssignments = createAsyncThunk(
  'student/fetchAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/assignment',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// POST: Submit assignment with file
export const submitAssignment = createAsyncThunk(
  'student/submitAssignment',
  async ({ assignmentId, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('photo', file); // required field name: 'photo'

      const response = await axios.post(
        `https://sikshamitra.onrender.com/api/student/assignment/${assignmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState: {
    assignments: {
      classAssignments: [],
      teacherAssignments: [],
      message: '',
    },
    loading: false,
    error: null,
    uploadStatus: null,
  },
  reducers: {
    clearUploadStatus: (state) => {
      state.uploadStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = {
          classAssignments: action.payload.classAssignments || [],
          teacherAssignments: action.payload.teacherAssignments || [],
          message: action.payload.message || '',
        };
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitAssignment.pending, (state) => {
        state.uploadStatus = 'loading';
        state.error = null;
      })
      .addCase(submitAssignment.fulfilled, (state) => {
        state.uploadStatus = 'success';
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.uploadStatus = 'error';
        state.error = action.payload;
      });
  },
});

export const { clearUploadStatus } = assignmentSlice.actions;
export default assignmentSlice.reducer;
