import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch dynamic school names
export const fetchSchoolNames = createAsyncThunk(
  'superadminstaffSendQuery/fetchSchoolNames',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/user/schools',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return Array.isArray(response.data.schools) ? response.data.schools : [];
 // Ensure your backend returns an array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitQuery = createAsyncThunk(
  'superadminstaffSendQuery/submitQuery',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
       const payload = {
        ...formData,
        sendTo: formData.sendTo.map((school) => school.schoolName),
      };
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/staff/saquery',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  schoolNames: [],
  form: {
    name: '',
    contact: '',
    email: '',
    sendTo: [], // selected schools
    message: '',
  },
  loading: false,
  error: null,
  success: false,
};


// Create the slice
const superAdminStaffSendQuerySlice = createSlice({
  name: 'superadminstaffSendQuery',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
  toggleSchoolSelection: (state, action) => {
  const school = action.payload; // This should be an object like { schoolName, schoolCode, location }

  const isSelected = state.form.sendTo.find(s => s.schoolCode === school.schoolCode);
  
  if (isSelected) {
    state.form.sendTo = state.form.sendTo.filter(
      s => s.schoolCode !== school.schoolCode
    );
  } else {
    state.form.sendTo.push(school);
  }
},
    resetForm: (state) => {
      state.form = initialState.form;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolNames.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolNames = action.payload;
      }) .addCase(submitQuery.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    })  .addCase(submitQuery.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.form = initialState.form; // ✅ Reset form on success
    }) .addCase(submitQuery.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    })
      .addCase(fetchSchoolNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  updateFormField,
  toggleSchoolSelection,
  resetForm,
} = superAdminStaffSendQuerySlice.actions;

// Export reducer
export default superAdminStaffSendQuerySlice.reducer;
