// features/entrance/entranceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://sikshamitra.onrender.com/api/user';

// === GET Schools ===
export const fetchSchools = createAsyncThunk(
  'entrance/fetchSchools',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/schools`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// === POST Entrance Exam Application using FormData ===
export const applyForEntranceExam = createAsyncThunk(
  'entrance/applyForEntranceExam',
  async (formDataPayload, thunkAPI) => {
    try {
      const formData = new FormData();

      // Basic Info
      formData.append('academicYear', formDataPayload.academicYear);
      formData.append('classApplying', formDataPayload.classApplying);
      formData.append('school', formDataPayload.school); // Must be name, not ID

      // Student Details
      const student = formDataPayload.studentDetails || {};
      formData.append('studentDetails[firstName]', student.firstName || '');
      formData.append('studentDetails[lastName]', student.lastName || '');
      formData.append('studentDetails[dob]', student.dob || '');
      formData.append('studentDetails[aadharNo]', student.aadharNo || '');
      formData.append('studentDetails[email]', student.email || '');
      formData.append('studentDetails[phoneNumber]', student.phoneNumber || '');
      formData.append('studentDetails[gender]', student.gender || '');

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

      const response = await axios.post(`${BASE_URL}/entranceExam`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to apply for entrance exam'
      );
    }
  }
);

// === SLICE ===
const entranceSlice = createSlice({
  name: 'entrance',
  initialState: {
    schools: [],
    isLoadingSchools: false,
    schoolError: null,

    applicationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    applicationError: null,
    applicationResponse: null,
  },
  reducers: {},
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
        state.applicationStatus = 'loading';
        state.applicationError = null;
        state.applicationResponse = null;
      })
      .addCase(applyForEntranceExam.fulfilled, (state, action) => {
        state.applicationStatus = 'succeeded';
        state.applicationResponse = action.payload;
      })
      .addCase(applyForEntranceExam.rejected, (state, action) => {
        state.applicationStatus = 'failed';
        state.applicationError = action.payload;
      });
  },
});

export default entranceSlice.reducer;
