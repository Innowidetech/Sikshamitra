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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Teacher Assignments:', response);

      if (response.data && response.data.classAssignments) {
        return response.data; // { message, classAssignments }
      } else {
        throw new Error('No class assignments found in response');
      }
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
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

      formData.append('assignmentName', assignmentData.assignmentName);
      formData.append('classs', assignmentData.class); // ✅ Fix: match API requirement
      formData.append('section', assignmentData.section);
      formData.append('subject', assignmentData.subject);
      formData.append('chapter', assignmentData.chapter);
      formData.append('startDate', assignmentData.startDate);
      formData.append('endDate', assignmentData.endDate);
      formData.append('photo', assignmentData.photo); // ✅ File input

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

      console.log('Created Assignment:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Submitted Assignments:', response);

      if (response.data && response.data.submittedAssignments) {
        return response.data; // { message, submittedAssignments }
      } else {
        throw new Error('No submitted assignments found in response');
      }
    } catch (error) {
      console.error('Error fetching submitted assignments:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Slice Definition
const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    submittedAssignments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch teacher assignments
      .addCase(fetchTeacherAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.classAssignments || [];
      })
      .addCase(fetchTeacherAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ Create new teacher assignment
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

      // 📥 Fetch submitted assignments by assignment ID
      .addCase(fetchSubmittedAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmittedAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAssignments = action.payload.submittedAssignments || [];
      })
      .addCase(fetchSubmittedAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
