import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Auth header using token

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

// Base URLs
const QUERY_API = 'https://sikshamitra.onrender.com/api/parent/query';
const TEACHERS_API = 'https://sikshamitra.onrender.com/api/parent/teacherNames';
const CONNECT_API = 'https://sikshamitra.onrender.com/api/parent/connect';

// ✅ Get teacher names
export const fetchTeacherNames = createAsyncThunk(
  'query/fetchTeacherNames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(TEACHERS_API, getAuthHeader());
      return response.data.teachers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher names');
    }
  }
);

// ✅ Send query (POST)
export const sendQuery = createAsyncThunk(
  'query/sendQuery',
  async ({ name, contact, email, message, sendTo }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        QUERY_API,
        { name, contact, email, message, sendTo },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send query');
    }
  }
);

// ✅ Fetch all queries
export const fetchQueries = createAsyncThunk(
  'query/fetchQueries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(QUERY_API, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queries');
    }
  }
);

// ✅ Fetch single query by ID
export const fetchQueryById = createAsyncThunk(
  'query/fetchQueryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${QUERY_API}/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch query');
    }
  }
);

// ✅ Send reply via PUT
export const sendReply = createAsyncThunk(
  'query/sendReply',
  async ({ id, replyData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${QUERY_API}/${id}`, replyData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reply');
    }
  }
);

// ✅ Send reply via POST
export const postReply = createAsyncThunk(
  'query/postReply',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${QUERY_API}/${id}`, { message }, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to post reply');
    }
  }
);

// ✅ Get connects/meetings
export const fetchConnects = createAsyncThunk(
  'query/fetchConnects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CONNECT_API, getAuthHeader());
      return response.data.connects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connects');
    }
  }
);

// Slice
const querySlice = createSlice({
  name: 'query',
  initialState: {
    queries: [],
    selectedQuery: null,
    teacherNames: [],
    connects: [], // ✅ connects/meetings
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
      // ✅ Fetch queries
      .addCase(fetchQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = action.payload;
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch single query by ID
      .addCase(fetchQueryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuery = action.payload;
      })
      .addCase(fetchQueryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Send reply (PUT)
      .addCase(sendReply.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(sendReply.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Reply sent successfully';
      })
      .addCase(sendReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Post reply (POST)
      .addCase(postReply.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(postReply.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Reply posted successfully';
      })
      .addCase(postReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch teacher names
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

      // ✅ Send query
      .addCase(sendQuery.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(sendQuery.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Query sent successfully';
      })
      .addCase(sendQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch connects/meetings
      .addCase(fetchConnects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnects.fulfilled, (state, action) => {
        state.loading = false;
        state.connects = action.payload;
      })
      .addCase(fetchConnects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrorMessage, clearSuccessMessage } = querySlice.actions;
export default querySlice.reducer;
