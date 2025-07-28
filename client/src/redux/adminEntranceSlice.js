import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Fetch Entrance Applications
export const fetchAdminEntranceApplications = createAsyncThunk(
  'adminEntrance/fetchAdminEntranceApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('Authorization token is missing');

      const formData = new FormData();
      formData.append('className', className);
      formData.append('questions', JSON.stringify(questions));
      if (question2) {
        formData.append('question2', question2); // file input
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

// ────────────────────────────────────────────────
// Slice Definition
const adminEntranceSlice = createSlice({
  name: 'adminEntrance',
  initialState: {
    applications: [],
    questionPaper: null,
    loading: false,
    error: null,
    createStatus: null,
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
  },
  extraReducers: (builder) => {
    builder
      // ── Applications ──
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

      // ── Fetch Question Paper ──
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

      // ── Create Question Paper ──
      .addCase(createQuestionPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createStatus = null;
      })
      .addCase(createQuestionPaper.fulfilled, (state, action) => {
        state.loading = false;
        state.createStatus = 'success';
      })
      .addCase(createQuestionPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createStatus = 'failed';
      });
  },
});


// Exports
export const { clearQuestionPaper, clearCreateStatus } = adminEntranceSlice.actions;
export default adminEntranceSlice.reducer;
