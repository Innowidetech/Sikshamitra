// src/redux/teacher/assignmentsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch all teacher assignments
export const fetchTeacherAssignments = createAsyncThunk(
  'assignments/fetchTeacherAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/assignment',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.classAssignments) {
        return response.data.classAssignments;
      } else {
        throw new Error('No class assignments found');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Create a new teacher assignment
export const createTeacherAssignment = createAsyncThunk(
  'assignments/createTeacherAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('assignmentName', assignmentData.chapterName); // 👈 use chapterName for assignmentName
      formData.append('class', assignmentData.class); // ✅ using correct key
      formData.append('section', assignmentData.section);
      formData.append('subject', assignmentData.subject);
      formData.append('chapter', assignmentData.chapter);
      formData.append('startDate', assignmentData.startDate);
      formData.append('endDate', assignmentData.endDate);
      formData.append('photo', assignmentData.photo);

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/assignment',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data?.assignment) {
        return response.data.assignment;
      } else {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Fetch submitted student assignments by assignment ID
export const fetchSubmittedAssignments = createAsyncThunk(
  'assignments/fetchSubmittedAssignments',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/teacher/submittedAssignments/${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.teacherAssignments;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    submittedAssignments: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Assignments
      .addCase(fetchTeacherAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload || [];
      })
      .addCase(fetchTeacherAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Create Assignment
      .addCase(createTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
      })
      .addCase(createTeacherAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch Submitted Assignments
      .addCase(fetchSubmittedAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submittedAssignments = null;
      })
      .addCase(fetchSubmittedAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAssignments = action.payload;
      })
      .addCase(fetchSubmittedAssignments.rejected, (state, action) => {
        state.loading = false;
        state.submittedAssignments = null;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
