import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all teacher results
export const fetchTeacherResults = createAsyncThunk(
  'teacherResults/fetchTeacherResults',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Extract the token from the state
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
      const token = getState().auth.token; // Extract the token from the state
      console.log('Submitting result data:', resultData); // Debugging log to check data

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

      // After submitting, fetch the updated results
      dispatch(fetchTeacherResults()); // Fetch the updated results

      return response.data.message || 'Result submitted successfully';
    } catch (error) {
      console.error('Error submitting result:', error); // Log error for debugging
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
      console.error('Error fetching subjects and exams:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subjects and exams'
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
      });
  },
});

export const { clearSubmitMessage } = teacherResultSlice.actions;
export default teacherResultSlice.reducer;
