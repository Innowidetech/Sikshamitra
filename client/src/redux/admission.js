import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch NEW admissions
export const fetchNewAdmissions = createAsyncThunk(
  'admissions/fetchNewAdmissions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found.');

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/newAdmission', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Server Error');
    }
  }
);

// Fetch ALL admissions
export const fetchAdmissions = createAsyncThunk(
  'admissions/fetchAdmissions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found.');

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/admission', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Server Error');
    }
  }
);

// Create student + parent account
export const createStudentAndParent = createAsyncThunk(
  'admissions/createStudentAndParent',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found.');

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/registersp',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Server Error');
    }
  }
);

export const fetchExistingStudents = createAsyncThunk(
  "students/fetchExistingStudents",
  async ({ class: selectedClass, section: selectedSection }) => {
    const res = await fetch(
      `https://sikshamitra.onrender.com/api/your-endpoint?class=${selectedClass}&section=${selectedSection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // if needed
        },
      }
    );
    const data = await res.json();
    return data.students; // or data if it's just the array
  }
);

export const createStudentForExistingParent = createAsyncThunk(
  'admissions/createStudentForExistingParent',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found.');

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/addStudent',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Server Error');
    }
  }
);


const admissionsSlice = createSlice({
  name: 'admissions',
  initialState: {
    admissions: [],
    newAdmissions: [],
    newAdmissionsCounts: {
      total: 0,
      male: 0,
      female: 0,
    },
      existingStudents: [],
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addAdmission: (state, action) => {
      state.admissions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewAdmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewAdmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.newAdmissions = action.payload.studentsWithParents || [];
        state.newAdmissionsCounts.total = action.payload.total || 0;
        state.newAdmissionsCounts.male = action.payload.male || 0;
        state.newAdmissionsCounts.female = action.payload.female || 0;
      })
      .addCase(fetchNewAdmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions = action.payload;
      })
      .addCase(fetchAdmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStudentAndParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentAndParent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.student && action.payload.parent) {
          state.newAdmissions.push({
            student: action.payload.student,
            parents: [action.payload.parent],
          });
        }
      })
      .addCase(createStudentAndParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExistingStudents.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchExistingStudents.fulfilled, (state, action) => {
  state.loading = false;
    state.existingStudents = action.payload.students;
})

.addCase(fetchExistingStudents.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(createStudentForExistingParent.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(createStudentForExistingParent.fulfilled, (state, action) => {
  state.loading = false;
  state.admissions.push(action.payload.student); // or newAdmissions if needed
})
.addCase(createStudentForExistingParent.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});


  },
});

export const { setSearchQuery, addAdmission } = admissionsSlice.actions;
export default admissionsSlice.reducer;
