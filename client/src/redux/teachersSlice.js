import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
      return rejectWithValue(error.message);
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

      // Add user credentials
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('employeeType', formData.employeeType);

      // Add profile information
      formDataToSend.append('profile[firstName]', formData.firstName);
      formDataToSend.append('profile[lastName]', formData.lastName);
      formDataToSend.append('profile[phoneNumber]', formData.phoneNumber);
      formDataToSend.append('profile[gender]', formData.gender);
      formDataToSend.append('profile[address]', formData.address);
      formDataToSend.append('profile[dob]', formData.dob);
      formDataToSend.append('profile[pob]', formData.pob);
      formDataToSend.append('profile[employeeId]', formData.employeeId);
      formDataToSend.append('profile[class]', formData.class);
      formDataToSend.append('profile[section]', formData.section);
      formDataToSend.append('profile[salary]', formData.salary);
      formDataToSend.append('profile[subjects]', formData.subjects);

      // Add education information
      formDataToSend.append('education[university]', formData.university);
      formDataToSend.append('education[degree]', formData.degree);
      formDataToSend.append('education[startDate]', formData.startDate);
      formDataToSend.append('education[endDate]', formData.endDate);
      formDataToSend.append('education[city]', formData.city);

      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/register',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        _id: response.data._id,
        userId: {
          email: formData.email
        },
        profile: {
          firstName: formData.firstName,
          photo: response.data.profile?.photo || '',
          subjects: formData.subjects,
          class: formData.class,
          gender: formData.gender,
          salary: formData.salary
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
        const nameMatch = teacher.profile.firstName.toLowerCase().includes(state.searchQuery.toLowerCase());
        const emailMatch = teacher.userId.email.toLowerCase().includes(state.searchQuery.toLowerCase());
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
      });
  },
});

export const { setSearchQuery } = teachersSlice.actions;

export default teachersSlice.reducer;