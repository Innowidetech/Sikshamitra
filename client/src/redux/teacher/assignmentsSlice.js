import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch teacher assignments
export const fetchTeacherAssignments = createAsyncThunk(
  'assignments/fetchTeacherAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/assignment', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Debug API response
      return response.data; // Expecting { message, classAssignments }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to create a new assignment
export const createTeacherAssignment = createAsyncThunk(
  'assignments/createTeacherAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('assignmentName', assignmentData.assignmentName);
      formData.append('class', assignmentData.class);
      formData.append('section', assignmentData.section);
      formData.append('subject', assignmentData.subject);
      formData.append('chapter', assignmentData.chapter);
      formData.append('startDate', assignmentData.startDate);
      formData.append('endDate', assignmentData.endDate);
      formData.append('photo', assignmentData.photo); // File field

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
      console.log(response.data); // Debug API response
      return response.data; // Expecting new assignment object
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch assignments
      .addCase(fetchTeacherAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.classAssignments || []; // ✅ use only the array
      })
      .addCase(fetchTeacherAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create assignment
      .addCase(createTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload); // Add new assignment to the list
      })
      .addCase(createTeacherAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
