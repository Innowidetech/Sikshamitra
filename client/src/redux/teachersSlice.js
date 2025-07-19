
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all teachers
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/teachers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!Array.isArray(response.data.teachers)) {
        return rejectWithValue('Invalid data format');
      }

      return response.data.teachers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addTeacherAsync = createAsyncThunk(
  'teachers/addTeacher',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authorization token is missing');
      }

      const formDataToSend = new FormData();

      // Top-level fields
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('employeeType', formData.employeeType);

      // Profile fields using bracket notation
      Object.entries(formData.profile).forEach(([key, value]) => {
        if (key === 'subjects') {
          value.forEach((subject, index) => {
            formDataToSend.append(`profile[subjects][${index}]`, subject);
          });
        } else if (key === 'photo' && value) {
          formDataToSend.append('photo', value);
        } else {
          formDataToSend.append(`profile[${key}]`, value);
        }
      });

      // Education fields (only one entry assumed)
      const education = formData.education[0];
      Object.entries(education).forEach(([key, value]) => {
        formDataToSend.append(`education[0][${key}]`, value);
      });

      // 🔍 Debug: Log keys and values
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/register',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    }catch (error) {
  console.error("❌ Server response error:", error.response?.data); // Add this line
  return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Updated updateTeacherAsync
export const updateTeacherAsync = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ teacherId, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authorization token is missing');
      }

      const payload = {
        isActive: updateData.isActive,
        fullname: updateData.profile.fullname,
        phoneNumber: updateData.profile.phoneNumber,
        gender: updateData.profile.gender,
        employeeId: updateData.profile.employeeId,
        class: updateData.profile.class,
        section: updateData.profile.section,
        subjects: updateData.profile.subjects,
        salary: updateData.profile.salary
      };

      const response = await axios.post(
        `https://sikshamitra.onrender.com/api/admin/teacher/${teacherId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.updatedTeacher) {
        throw new Error('No updated teacher data received');
      }

      // ✅ Ensure `userId.isActive` is retained for frontend UI
      return {
        ...response.data.updatedTeacher,
        userId: {
          ...response.data.updatedTeacher.userId,
          isActive: updateData.isActive,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const teachersSlice = createSlice({
  name: 'teachers',
  initialState: {
    teachers: [],
    filteredTeachers: [],
    loading: false,
    error: null,
    searchQuery: ''
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredTeachers = state.teachers.filter(teacher => {
        const nameMatch = teacher.profile.firstName?.toLowerCase().includes(state.searchQuery.toLowerCase());
        const emailMatch = teacher.userId.email?.toLowerCase().includes(state.searchQuery.toLowerCase());
        return nameMatch || emailMatch;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
        state.filteredTeachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTeacherAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeacherAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers.push(action.payload);
        state.filteredTeachers = state.teachers;
      })
      .addCase(addTeacherAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTeacherAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teachers.findIndex(teacher => teacher._id === action.payload._id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
          state.filteredTeachers = [...state.teachers];
        }
      })
      .addCase(updateTeacherAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = teachersSlice.actions;
export default teachersSlice.reducer;
