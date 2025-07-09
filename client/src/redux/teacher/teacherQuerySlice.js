import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🔐 Auth headers using token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    throw new Error('No token found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🌐 Base URLs for Teacher APIs
const QUERY_API = 'https://sikshamitra.onrender.com/api/teacher/query';
const CONNECT_API = 'https://sikshamitra.onrender.com/api/teacher/connect';
const TEACHERS_API = 'https://sikshamitra.onrender.com/api/teacher/teacherNames';

// ✅ Get parent/admin names
export const fetchTeacherNames = createAsyncThunk(
  'teacherQuery/fetchTeacherNames',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(TEACHERS_API, getAuthHeader());
      return res.data.teachers;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch names');
    }
  }
);

// ✅ Send query
export const sendTeacherQuery = createAsyncThunk(
  'teacherQuery/sendTeacherQuery',
  async ({ name, contact, email, message, sendTo }, { rejectWithValue }) => {
    try {
      const res = await axios.post(QUERY_API, { name, contact, email, message, sendTo }, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send query');
    }
  }
);

// ✅ Fetch all teacher queries
export const fetchTeacherQueries = createAsyncThunk(
  'teacherQuery/fetchTeacherQueries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(QUERY_API, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch queries');
    }
  }
);

// ✅ Fetch single teacher query
export const fetchTeacherQueryById = createAsyncThunk(
  'teacherQuery/fetchTeacherQueryById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${QUERY_API}/${id}`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch query');
    }
  }
);

// ✅ PUT reply to teacher query
export const sendTeacherReply = createAsyncThunk(
  'teacherQuery/sendTeacherReply',
  async ({ id, replyData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${QUERY_API}/${id}`, replyData, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send reply');
    }
  }
);

// ✅ POST reply to teacher query
export const postTeacherReply = createAsyncThunk(
  'teacherQuery/postTeacherReply',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${QUERY_API}/${id}`, { message }, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to post reply');
    }
  }
);

// ✅ Get meetings/connects for teacher
export const fetchTeacherConnects = createAsyncThunk(
  'teacherQuery/fetchTeacherConnects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(CONNECT_API, getAuthHeader());
      return res.data.connects;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch connects');
    }
  }
);

// ✅ Update status of a connect/meeting
export const updateTeacherConnectStatus = createAsyncThunk(
  'teacherQuery/updateTeacherConnectStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${CONNECT_API}/${id}`,
        { status },
        getAuthHeader()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update connect status');
    }
  }
);

// Slice
const teacherQuerySlice = createSlice({
  name: 'teacherQuery',
  initialState: {
    queriesSent: [],
    queriesReceived: [],
    selectedQuery: null,
    teacherNames: [],
    connects: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearErrorMessage: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queriesSent = action.payload?.queriesSent || [];
        state.queriesReceived = action.payload?.queriesReceived || [];
      })
      .addCase(fetchTeacherQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTeacherQueryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherQueryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuery = action.payload;
      })
      .addCase(fetchTeacherQueryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendTeacherReply.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(sendTeacherReply.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Reply sent successfully';
      })
      .addCase(sendTeacherReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(postTeacherReply.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(postTeacherReply.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Reply posted successfully';
      })
      .addCase(postTeacherReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendTeacherQuery.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(sendTeacherQuery.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Query sent successfully';
      })
      .addCase(sendTeacherQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTeacherNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherNames.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherNames = action.payload;
      })
      .addCase(fetchTeacherNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTeacherConnects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherConnects.fulfilled, (state, action) => {
        state.loading = false;
        state.connects = action.payload;
      })
      .addCase(fetchTeacherConnects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTeacherConnectStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherConnectStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Connect status updated successfully';
      })
      .addCase(updateTeacherConnectStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrorMessage, clearSuccessMessage } = teacherQuerySlice.actions;
export default teacherQuerySlice.reducer;
