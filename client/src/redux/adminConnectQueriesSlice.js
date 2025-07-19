import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ FETCH all admin queries
export const fetchAdminQueries = createAsyncThunk(
  'adminConnectQueries/fetchAdminQueries',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/query', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ FETCH a query by ID
export const fetchQueryById = createAsyncThunk(
  'adminConnectQueries/fetchQueryById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://sikshamitra.onrender.com/api/admin/query/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.query ?? response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ REPLY to a query
export const replyToQuery = createAsyncThunk(
  'adminConnectQueries/replyToQuery',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `https://sikshamitra.onrender.com/api/admin/query/${id}`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.query;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reply.');
    }
  }
);

// ✅ CREATE a new query
export const createAdminQuery = createAsyncThunk(
  'adminConnectQueries/createAdminQuery',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/query',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.query;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create query.');
    }
  }
);

// ✅ FETCH all meetings (connects)
export const fetchAdminConnects = createAsyncThunk(
  'adminConnectQueries/fetchAdminConnects',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/connect',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.connects;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch connects');
    }
  }
);

// ✅ CREATE Meeting (instant or scheduled in one API)
export const createAdminMeeting = createAsyncThunk(
  'adminConnectQueries/createAdminMeeting',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/connect',
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.connect;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create meeting');
    }
  }
);

const adminConnectQueriesSlice = createSlice({
  name: 'adminConnectQueries',
  initialState: {
    receivedQueries: [],
    sentQueries: [],
    selectedQuery: null,
    loading: false,
    error: null,
    connects: [],
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Queries
      .addCase(fetchAdminQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedQueries = action.payload.queriesReceived || [];
        state.sentQueries = action.payload.queriesSent || [];
      })
      .addCase(fetchAdminQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Query
      .addCase(fetchQueryById.pending, (state) => {
        state.loading = true;
        state.selectedQuery = null;
        state.error = null;
      })
      .addCase(fetchQueryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuery = action.payload;
      })
      .addCase(fetchQueryById.rejected, (state, action) => {
        state.loading = false;
        state.selectedQuery = null;
        state.error = action.payload;
      })

      // Reply
      .addCase(replyToQuery.fulfilled, (state, action) => {
        state.selectedQuery = action.payload;
      })

      // Create Query
      .addCase(createAdminQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.sentQueries.unshift(action.payload);
      })
      .addCase(createAdminQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Connects
      .addCase(fetchAdminConnects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminConnects.fulfilled, (state, action) => {
      state.connects = action.payload;  // <- ✅ this should update your meeting table
    })
      .addCase(fetchAdminConnects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Create Meeting (instant/schedule in same API)
      .addCase(createAdminMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.connects.unshift(action.payload);
      })
      .addCase(createAdminMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminConnectQueriesSlice.reducer;
