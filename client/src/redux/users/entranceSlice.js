// src/redux/users/entranceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// === GET Schools List ===
export const fetchSchools = createAsyncThunk(
  'entrance/fetchSchools',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/user/schools'
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch schools'
      );
    }
  }
);

// === POST Entrance Exam Application ===
export const applyForEntranceExam = createAsyncThunk(
  'entrance/applyForEntranceExam',
  async (formDataPayload, thunkAPI) => {
    try {
      const formData = new FormData();

      // Basic Info
      formData.append('academicYear', formDataPayload.academicYear || '');
      formData.append('classApplying', formDataPayload.classApplying || '');
      formData.append('school', formDataPayload.school || '');

      // Student Details
      const student = formDataPayload.studentDetails || {};
      formData.append('studentDetails[firstName]', student.firstName || '');
      formData.append('studentDetails[lastName]', student.lastName || '');
      formData.append('studentDetails[dob]', student.dob || '');
      formData.append('studentDetails[aadharNo]', student.aadharNo || '');
      formData.append('studentDetails[email]', student.email || '');
      formData.append('studentDetails[phoneNumber]', student.phoneNumber || '');
      formData.append('studentDetails[gender]', student.gender || '');

      // ✅ Photo is required and must be a File
      if (student.photo instanceof File) {
        formData.append('photo', student.photo);
      } else {
        return thunkAPI.rejectWithValue('Invalid or missing photo file');
      }

      // Previous School Details
      const prev = formDataPayload.previousSchoolDetails || {};
      formData.append('previousSchoolDetails[schoolName]', prev.schoolName || '');
      formData.append('previousSchoolDetails[lastClassAttended]', prev.lastClassAttended || '');
      formData.append('previousSchoolDetails[board]', prev.board || '');
      formData.append('previousSchoolDetails[schoolBoard]', prev.schoolBoard || '');
      formData.append('previousSchoolDetails[percentage]', prev.percentage || '');
      formData.append('previousSchoolDetails[schoolAddress]', prev.schoolAddress || '');
      formData.append('previousSchoolDetails[startDate]', prev.startDate || '');
      formData.append('previousSchoolDetails[endDate]', prev.endDate || '');

      // ✅ Multiple documents upload
      if (Array.isArray(prev.documents)) {
        prev.documents.forEach((file) => {
          if (file instanceof File) {
            formData.append('previousSchoolDetails[documents]', file);
          }
        });
      }

      // Send request
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/user/entranceExam',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to apply for entrance exam'
      );
    }
  }
);

const entranceSlice = createSlice({
  name: 'entrance',
  initialState: {
    schools: [],
    isLoadingSchools: false,
    schoolError: null,
    applicationStatus: null,
    applicationError: null,
    isSubmitting: false,
  },
  reducers: {
    resetApplicationStatus: (state) => {
      state.applicationStatus = null;
      state.applicationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Schools
      .addCase(fetchSchools.pending, (state) => {
        state.isLoadingSchools = true;
        state.schoolError = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.isLoadingSchools = false;
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.isLoadingSchools = false;
        state.schoolError = action.payload;
      })

      // Apply for Entrance Exam
      .addCase(applyForEntranceExam.pending, (state) => {
        state.isSubmitting = true;
        state.applicationError = null;
      })
      .addCase(applyForEntranceExam.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.applicationStatus = action.payload;
      })
      .addCase(applyForEntranceExam.rejected, (state, action) => {
        state.isSubmitting = false;
        state.applicationError = action.payload;
      });
  },
});

export const { resetApplicationStatus } = entranceSlice.actions;
export default entranceSlice.reducer;
