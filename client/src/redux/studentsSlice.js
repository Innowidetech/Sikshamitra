import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk: Fetch all students
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

// ✅ Thunk: Fetch Updated Student Data
export const fetchUpdatedStudents = createAsyncThunk(
  'students/fetchUpdatedStudents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/updatedStudentData', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Correct key in API response
      return response.data.studentDataUpdates || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk: Update student
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

      await dispatch(fetchStudents());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk: Fetch single student details
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

export const fetchUpdatedStudentHistory = createAsyncThunk(
  'students/fetchUpdatedStudentHistory',
  async (studentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/admin/updatedStudentData/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Always return array (even if empty) to avoid triggering errors
      return {
        studentId,
        dataHistory: response.data?.dataHistory || [],
      };
    } catch (error) {
      // ⚠️ IF error is 404, treat as no history, not failure
      if (error.response?.status === 404) {
        return {
          studentId,
          dataHistory: [],
        };
      }

      // Other errors (like 500, 401) = real failure
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



// Slice
const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    filteredStudents: [],
    selectedStudent: null,
     studentUpdateHistory: {},

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
      // fetchStudents
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

      // fetchStudentDetails
      .addCase(fetchStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateStudentAsync
      .addCase(updateStudentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStudentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ fetchUpdatedStudents
      .addCase(fetchUpdatedStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdatedStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedStudentHistory = action.payload; // ✅ Correct key for StudentHistory.jsx
      })
      .addCase(fetchUpdatedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUpdatedStudentHistory
.addCase(fetchUpdatedStudentHistory.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchUpdatedStudentHistory.fulfilled, (state, action) => {
  const { studentId, dataHistory } = action.payload;
  state.studentUpdateHistory[studentId] = dataHistory;
  state.loading = false;
})


.addCase(fetchUpdatedStudentHistory.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});

  },
});

export const { setSearchQuery, setSelectedStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
