// src/redux/student/connectQueriesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://sikshamitra.onrender.com/api/student/query';
const CONNECT_BASE = 'https://sikshamitra.onrender.com/api/student/connect';

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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reply.');
    }
  }
);

// ✅ Send a new query
export const sendNewQuery = createAsyncThunk(
  'connectQueries/sendNewQuery',
  async ({ name, contact, email, message, sendTo }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        API_BASE,
        { name, contact, email, message, sendTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send query.');
    }
  }
);


// 🚀 Fetch all connects
export const fetchConnects = createAsyncThunk(
  'connectQueries/fetchConnects',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(CONNECT_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // assuming API returns { connectsReceived, connectsSent } or similar structure
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create meeting (scheduled or instant based on provided fields)
export const createMeeting = createAsyncThunk(
  'connectQueries/createMeeting',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      // Build request body conditionally
      const requestBody = {
        title: payload.title,
        attendants: payload.attendants || [],
      };

      // Add scheduling fields if they exist
      if (
        payload.startDate &&
        payload.startTime &&
        payload.endDate &&
        payload.endTime
      ) {
        requestBody.startDate = payload.startDate;
        requestBody.startTime = payload.startTime;
        requestBody.endDate = payload.endDate;
        requestBody.endTime = payload.endTime;
      }

      const res = await axios.post(
        CONNECT_BASE,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create meeting.');
    }
  }
);


const connectQueriesSlice = createSlice({
  name: 'connectQueries',
  initialState: {
    received: [],
    sent: [],
    connectsReceived: [], // new
    connectsSent: [],     // new
    singleQuery: null,
    loading: false,
    error: null,
    replyStatus: null,
    sendStatus: null,
    connectsStatus: null, // new
  },
  reducers: {
    resetReplyStatus: (state) => {
      state.replyStatus = null;
    },
    resetSendStatus: (state) => {
      state.sendStatus = null;
    },
    resetConnectsStatus: (state) => {
      state.connectsStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 fetchConnectQueries
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

      // 📥 fetchQueryById
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

      // 📨 replyToQuery
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

      // ✉️ sendNewQuery
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
      })

      // 🌐 fetchConnects
      .addCase(fetchConnects.pending, (state) => {
        state.connectsStatus = 'loading';
        state.error = null;
      })
    .addCase(fetchConnects.fulfilled, (state, action) => {
  state.connectsStatus = 'success';
  state.connectsReceived = action.payload.connects || []; // ✅
   })

      .addCase(fetchConnects.rejected, (state, action) => {
        state.connectsStatus = 'error';
        state.error = action.payload || 'Failed to load connects';
      })

      // 🧩 createMeeting
.addCase(createMeeting.pending, (state) => {
  state.sendStatus = 'loading';
  state.error = null;
})
.addCase(createMeeting.fulfilled, (state) => {
  state.sendStatus = 'success';
})
.addCase(createMeeting.rejected, (state, action) => {
  state.sendStatus = 'error';
  state.error = action.payload;
})

  },
});

export const {
  resetReplyStatus,
  resetSendStatus,
  resetConnectsStatus,
} = connectQueriesSlice.actions;

export default connectQueriesSlice.reducer;
