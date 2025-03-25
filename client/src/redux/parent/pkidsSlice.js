import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch dashboard data (parent and students)
export const fetchDashboardData = createAsyncThunk(
  'pkids/fetchDashboardData',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get('https://sikshamitra.onrender.com/api/parent/dashboard', config);
    return response.data; // Assuming the structure is { parentData: {}, students: [] }
  }
);

const pkidsSlice = createSlice({
  name: 'pkids',
  initialState: {
    parentData: null, // Will hold the parent profile and related data
    students: [], // Array of student data
    selectedStudent: null, // Holds the selected student data
    status: 'idle', // loading states: idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle students data properly by accessing `student` key inside each student object
        const { parentData, students } = action.payload;
        state.parentData = parentData; // Store parent profile and related information
        state.students = students.map(student => student.student); // Access the 'student' key in each item
        // Optionally set the first student as the default selected student
        if (state.students.length > 0) {
          state.selectedStudent = state.students[0];
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { setSelectedStudent } = pkidsSlice.actions;
export default pkidsSlice.reducer;
