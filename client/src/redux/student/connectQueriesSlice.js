// src/redux/student/connectQueriesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://sikshamitra.onrender.com/api/student/query';

// ✅ Fetch all queries
export const fetchConnectQueries = createAsyncThunk(
  'connectQueries/fetchConnectQueries',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch single query by ID
export const fetchQueryById = createAsyncThunk(
  'connectQueries/fetchQueryById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.query;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Reply to a query
export const replyToQuery = createAsyncThunk(
  'connectQueries/replyToQuery',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE}/${id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reply.');
    }
  }
);

// ✅ Send a new query (added based on your API)
export const sendNewQuery = createAsyncThunk(
  'connectQueries/sendNewQuery',
  async ({ name, contact, email, message, sendTo }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        API_BASE,
        { name, contact, email, message, sendTo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send query.');
    }
  }
);

const connectQueriesSlice = createSlice({
  name: 'connectQueries',
  initialState: {
    received: [],
    sent: [],
    singleQuery: null,
    loading: false,
    error: null,
    replyStatus: null,
    sendStatus: null, // ✅ New status for sending query
  },
  reducers: {
    resetReplyStatus: (state) => {
      state.replyStatus = null;
    },
    resetSendStatus: (state) => {
      state.sendStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch all queries
      .addCase(fetchConnectQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnectQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.received = action.payload.queriesReceived || [];
        state.sent = action.payload.queriesSent || [];
      })
      .addCase(fetchConnectQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load queries';
      })

      // 📥 Fetch query by ID
      .addCase(fetchQueryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleQuery = null;
      })
      .addCase(fetchQueryById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleQuery = action.payload || {};
      })
      .addCase(fetchQueryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load query';
      })

      // 📨 Reply to query
      .addCase(replyToQuery.pending, (state) => {
        state.replyStatus = 'loading';
        state.error = null;
      })
      .addCase(replyToQuery.fulfilled, (state) => {
        state.replyStatus = 'success';
      })
      .addCase(replyToQuery.rejected, (state, action) => {
        state.replyStatus = 'error';
        state.error = action.payload;
      })

      // ✉️ Send new query
      .addCase(sendNewQuery.pending, (state) => {
        state.sendStatus = 'loading';
        state.error = null;
      })
      .addCase(sendNewQuery.fulfilled, (state) => {
        state.sendStatus = 'success';
      })
      .addCase(sendNewQuery.rejected, (state, action) => {
        state.sendStatus = 'error';
        state.error = action.payload;
      });
  },
});

export const { resetReplyStatus, resetSendStatus } = connectQueriesSlice.actions;
export default connectQueriesSlice.reducer;
