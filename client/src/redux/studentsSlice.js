import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data.studentsWithTeachers)
      return response.data.studentsWithTeachers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchStudentDetails = createAsyncThunk(
  'students/fetchStudentDetails',
  async (studentId, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      // First try to find the student in the existing state
      const state = getState();
      const existingStudent = state.students.filteredStudents.find(student => 
        student._id === studentId || 
        student.parent?.parentOf?.some(child => child.student?._id === studentId)
      );

      if (existingStudent) {
        // If found in state, use that data
        return existingStudent;
      }

      // If not found in state, fetch from API
      const response = await axios.get(`https://sikshamitra.onrender.com/api/admin/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log( response.data.studentData)
      return response.data.studentData;
    } catch (error) {
      // If API fails, try to find student in existing state as fallback
      const state = getState();
      const existingStudent = state.students.filteredStudents.find(student => 
        student._id === studentId || 
        student.parent?.parentOf?.some(child => child.student?._id === studentId)
      );

      if (existingStudent) {
        return existingStudent;
      }

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    filteredStudents: [],
    selectedStudent: null,
    loading: false,
    error: null,
    searchQuery: ''
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredStudents = state.students.filter(student => {
        const firstName = student.studentProfile?.firstName?.toLowerCase() || '';
        const lastName = student.studentProfile?.lastName?.toLowerCase() || '';
        const searchTerm = action.payload.toLowerCase();
        console.log('Filtered Students:', state.firstName);
        return firstName.includes(searchTerm) || lastName.includes(searchTerm);
      });
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        state.filteredStudents = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedStudent } = studentsSlice.actions;
export default studentsSlice.reducer;