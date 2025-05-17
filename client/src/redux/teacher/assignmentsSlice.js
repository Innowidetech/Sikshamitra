import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch all teacher assignments
export const fetchTeacherAssignments = createAsyncThunk(
  'assignments/fetchTeacherAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
<<<<<<< HEAD
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/assignment',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Teacher Assignments:', response);

=======
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/assignment', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Teacher Assignments:', response.data);
>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00
      if (response.data && response.data.classAssignments) {
        return response.data; // includes { message, classAssignments }
      } else {
        throw new Error('No class assignments found in response');
      }
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

<<<<<<< HEAD
// ✅ Create a new teacher assignment
=======
// ✅ Create new teacher assignment
>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00
export const createTeacherAssignment = createAsyncThunk(
  'assignments/createTeacherAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();

      // Log the assignment data to ensure correct fields
      console.log('Assignment Data:', assignmentData);

      // Append assignment data to formData
      formData.append('assignmentName', assignmentData.assignmentName);
<<<<<<< HEAD
      formData.append('classs', assignmentData.class); // ✅ Fix: match API requirement
=======
      formData.append('class', assignmentData.classs); // Make sure the key is 'class' as expected by the API
>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00
      formData.append('section', assignmentData.section);
      formData.append('subject', assignmentData.subject);
      formData.append('chapter', assignmentData.chapter);
      formData.append('startDate', assignmentData.startDate);
      formData.append('endDate', assignmentData.endDate);
<<<<<<< HEAD
      formData.append('photo', assignmentData.photo); // ✅ File input
=======
      formData.append('photo', assignmentData.photo); // Ensure 'photo' is used correctly for file uploads

      // Log the FormData to verify content
      console.log('FormData:', formData);
>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00

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

      // Log detailed error response for troubleshooting
      if (error.response) {
        console.error('Response error:', error.response);
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else {
        console.error('Error message:', error.message);
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

<<<<<<< HEAD
// ✅ Fetch submitted student assignments by assignment ID
=======
// ✅ Fetch submitted assignments for a specific assignment
>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00
export const fetchSubmittedAssignments = createAsyncThunk(
  'assignments/fetchSubmittedAssignments',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/teacher/submittedAssignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

<<<<<<< HEAD
      console.log('Submitted Assignments:', response);

=======
      console.log('Submitted Assignments:', response.data);
>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00
      if (response.data && response.data.submittedAssignments) {
        return response.data; // includes { message, submittedAssignments }
      } else {
        throw new Error('No submitted assignments found in response');
      }
    } catch (error) {
      console.error('Error fetching submitted assignments:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

<<<<<<< HEAD
=======
// ✅ Fetch student submitted assignments for a specific assignment
export const fetchStudentSubmittedAssignments = createAsyncThunk(
  'assignments/fetchStudentSubmittedAssignments',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/teacher/submittedAssignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Student Submitted Assignments:', response.data);
      if (response.data && response.data.submittedAssignments) {
        return response.data; // includes { message, submittedAssignments }
      } else {
        throw new Error('No student submitted assignments found in response');
      }
    } catch (error) {
      console.error('Error fetching student submitted assignments:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

>>>>>>> 87ba4038dfcfad1136ac0be88dec23d272a54d00
// ✅ Slice Definition
const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    submittedAssignments: [],
    studentSubmittedAssignments: [], // New state for student submissions
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Teacher Assignments
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

      // 🆕 Create Teacher Assignment
      .addCase(createTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload); // Add new assignment to list
      })
      .addCase(createTeacherAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 Fetch Submitted Assignments
      .addCase(fetchSubmittedAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submittedAssignments = []; // clear previous data during load
      })
      .addCase(fetchSubmittedAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedAssignments = action.payload.submittedAssignments || [];
      })
      .addCase(fetchSubmittedAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submittedAssignments = []; // reset to empty on failure
      })

      // 📥 Fetch Student Submitted Assignments
      .addCase(fetchStudentSubmittedAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.studentSubmittedAssignments = []; // clear previous data during load
      })
      .addCase(fetchStudentSubmittedAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.studentSubmittedAssignments = action.payload.submittedAssignments || [];
      })
      .addCase(fetchStudentSubmittedAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.studentSubmittedAssignments = []; // reset to empty on failure
      });
  },
});

export default assignmentsSlice.reducer;
