import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all teacher results
export const fetchTeacherResults = createAsyncThunk(
  'teacherResults/fetchTeacherResults',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No token found');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/results',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        return rejectWithValue('Results data is not in the expected format');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch teacher results'
      );
    }
  }
);

// Submit a teacher result
export const submitTeacherResult = createAsyncThunk(
  'teacherResults/submitTeacherResult',
  async (resultData, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No token found');
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/results',
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(fetchTeacherResults());
      return response.data.message || 'Result submitted successfully';
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit teacher result'
      );
    }
  }
);

// Fetch subjects and exams
export const fetchSubjectsAndExams = createAsyncThunk(
  'teacherResults/fetchSubjectsAndExams',
  async ({ classs, section }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No authentication token found. Please login.');
    }
    if (!classs || !section) {
      return rejectWithValue('Class and section are required.');
    }
    try {
      const params = new URLSearchParams();
      params.append('classs', classs);
      params.append('section', section);
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/getSandE',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subjects and exams'
      );
    }
  }
);

// Edit teacher result using PATCH method
export const editTeacherResult = createAsyncThunk(
  'teacherResults/editTeacherResult',
  async ({ id, classs, section, exam, student, result }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No authentication token found. Please login.');
      }

      // Sanitize the result array
      const cleanedResult = result.map((entry) => ({
        subject: entry.subject,
        marksObtained: Number(entry.marksObtained),
        totalMarks: Number(entry.totalMarks),
        grade: entry.grade,
      }));

      const payload = {
        classs,
        section,
        exam,
        student,
        result: cleanedResult,
      };

      console.log('PATCH payload:', payload); // For debugging

      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/teacher/results/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(fetchTeacherResults());
      return response.data.message || 'Result updated successfully';
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to edit teacher result'
      );
    }
  }
);

// Slice definition
const teacherResultSlice = createSlice({
  name: 'teacherResults',
  initialState: {
    results: [],
    loading: false,
    error: null,
    submitSuccessMessage: null,
    subjectsAndExams: {
      classes: [],
      exams: [],
    },
    subjectsAndExamsError: null,
  },
  reducers: {
    clearSubmitMessage(state) {
      state.submitSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teacher results
      .addCase(fetchTeacherResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchTeacherResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit teacher result
      .addCase(submitTeacherResult.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccessMessage = null;
      })
      .addCase(submitTeacherResult.fulfilled, (state, action) => {
        state.loading = false;
        state.submitSuccessMessage = action.payload;
      })
      .addCase(submitTeacherResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch subjects and exams
      .addCase(fetchSubjectsAndExams.pending, (state) => {
        state.loading = true;
        state.subjectsAndExamsError = null;
      })
      .addCase(fetchSubjectsAndExams.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectsAndExams = action.payload;
      })
      .addCase(fetchSubjectsAndExams.rejected, (state, action) => {
        state.loading = false;
        state.subjectsAndExamsError = action.payload;
      })

      // Edit teacher result
      .addCase(editTeacherResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTeacherResult.fulfilled, (state, action) => {
        state.loading = false;
        state.submitSuccessMessage = action.payload;
      })
      .addCase(editTeacherResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubmitMessage } = teacherResultSlice.actions;
export default teacherResultSlice.reducer;
