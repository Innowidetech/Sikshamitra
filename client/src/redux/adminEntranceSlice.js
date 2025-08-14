import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper to get token with error fallback
const getToken = () => localStorage.getItem('token');

// ────────────────────────────────────────────────
// 1. Fetch Entrance Applications
export const fetchAdminEntranceApplications = createAsyncThunk(
  'adminEntrance/fetchAdminEntranceApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Authorization token is missing');

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/applicants',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch applications'
      );
    }
  }
);

// 2. Fetch Entrance Exam Question Paper by ID
export const fetchQuestionPaperById = createAsyncThunk(
  'adminEntrance/fetchQuestionPaperById',
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Authorization token is missing');

      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/admin/questionPaper/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch question paper'
      );
    }
  }
);

// 3. Create Entrance Exam Question Paper
export const createQuestionPaper = createAsyncThunk(
  'adminEntrance/createQuestionPaper',
  async ({ className, questions, question2 }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Authorization token is missing');

      const formData = new FormData();
      formData.append('className', className);
      formData.append('questions', JSON.stringify(questions));
      if (question2) {
        formData.append('question2', question2);
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/questionPaper',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create question paper'
      );
    }
  }
);

// 4. Send Exam Details to Applicants
export const sendExamDetails = createAsyncThunk(
  'adminEntrance/sendExamDetails',
  async (examDetails, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Authorization token is missing');

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/sendExamDetails',
        examDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send exam details'
      );
    }
  }
);

// 5. Fetch Applicant Exam Results
export const fetchApplicantResults = createAsyncThunk(
  'adminEntrance/fetchApplicantResults',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Authorization token is missing');

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/eeresults',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch applicant results'
      );
    }
  }
);

// 6. ✅ Submit Selected Applicant Results (Corrected!)
export const submitSelectedResults = createAsyncThunk(
  'adminEntrance/submitSelectedResults',
  async ({ resultIds }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Authorization token is missing');

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/eeresults',
        { resultIds }, // ✅ MATCHES BACKEND
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit results'
      );
    }
  }
);

// ────────────────────────────────────────────────
// Slice Definition
const adminEntranceSlice = createSlice({
  name: 'adminEntrance',
  initialState: {
    applications: [],
    questionPaper: null,
    applicantResults: [],
    loading: false,
    error: null,
    createStatus: null,
    sendStatus: null,
    submitResultStatus: null,
  },
  reducers: {
    clearQuestionPaper: (state) => {
      state.questionPaper = null;
      state.error = null;
      state.loading = false;
    },
    clearCreateStatus: (state) => {
      state.createStatus = null;
    },
    clearSendStatus: (state) => {
      state.sendStatus = null;
    },
    clearSubmitResultStatus: (state) => {
      state.submitResultStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchAdminEntranceApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminEntranceApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchAdminEntranceApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Question Paper
      .addCase(fetchQuestionPaperById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.questionPaper = null;
      })
      .addCase(fetchQuestionPaperById.fulfilled, (state, action) => {
        state.loading = false;
        state.questionPaper = action.payload;
      })
      .addCase(fetchQuestionPaperById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Question Paper
      .addCase(createQuestionPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createStatus = null;
      })
      .addCase(createQuestionPaper.fulfilled, (state) => {
        state.loading = false;
        state.createStatus = 'success';
      })
      .addCase(createQuestionPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createStatus = 'failed';
      })

      // Send Exam Details
      .addCase(sendExamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sendStatus = null;
      })
      .addCase(sendExamDetails.fulfilled, (state) => {
        state.loading = false;
        state.sendStatus = 'success';
      })
      .addCase(sendExamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sendStatus = 'failed';
      })

      // Fetch Applicant Results
      .addCase(fetchApplicantResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicantResults.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantResults = action.payload;
      })
      .addCase(fetchApplicantResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Selected Results
      .addCase(submitSelectedResults.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitResultStatus = null;
      })
      .addCase(submitSelectedResults.fulfilled, (state) => {
        state.loading = false;
        state.submitResultStatus = 'success';
      })
      .addCase(submitSelectedResults.rejected, (state, action) => {
        state.loading = false;
        state.submitResultStatus = 'failed';
        state.error = action.payload;
      });
  },
});

// ────────────────────────────────────────────────
// Exports
export const {
  clearQuestionPaper,
  clearCreateStatus,
  clearSendStatus,
  clearSubmitResultStatus,
} = adminEntranceSlice.actions;

export default adminEntranceSlice.reducer;
