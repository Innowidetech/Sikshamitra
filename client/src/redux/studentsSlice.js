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
      return response.data.studentsWithTeachers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateStudentAsync = createAsyncThunk(
  'students/updateStudent',
  async ({ studentId, updateData }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.post(
        `https://sikshamitra.onrender.com/api/admin/student/${studentId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated students list after successful update
      await dispatch(fetchStudents());
      return response.data;
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

      const state = getState();
      const existingStudent = state.students.filteredStudents.find(student =>
        student._id === studentId ||
        student.parent?.parentOf?.some(child => child.student?._id === studentId)
      );

      if (existingStudent) {
        return existingStudent;
      }

      const response = await axios.get(`https://sikshamitra.onrender.com/api/admin/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.studentData;
    } catch (error) {
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
        const parent = student.parent?.parentProfile;
        const children = parent?.parentOf || [];

        return children.some(child => {
          const studentData = child?.student?.studentProfile;
          if (!studentData) return false;

          const searchTerm = action.payload.toLowerCase();
          return (
            studentData.fullname?.toLowerCase().includes(searchTerm) ||
            studentData.registrationNumber?.toLowerCase().includes(searchTerm) ||
            studentData.class?.toString().toLowerCase().includes(searchTerm) ||
            studentData.section?.toLowerCase().includes(searchTerm)
          );
        });
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
      })
      .addCase(updateStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedStudent } = studentsSlice.actions;
export default studentsSlice.reducer;