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

// ✅ CREATE a new query (new API you provided)
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

export const fetchAdminConnects = createAsyncThunk(
  'adminConnectQueries/fetchAdminConnects',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/connect',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.connects; // adapt based on API response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch connects');
    }
  }
);

// ✅ CREATE Scheduled Meeting (date + time)
export const createAdminScheduleMeeting = createAsyncThunk(
  'adminConnectQueries/createAdminScheduleMeeting',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/connect',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.connect;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to schedule meeting.');
    }
  }
);

// ✅ CREATE Instant Meeting
export const createAdminInstantMeeting = createAsyncThunk(
  'adminConnectQueries/createAdminInstantMeeting',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/connect',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.connect;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to start instant meeting.');
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
      // Fetch All
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
        state.error = action.payload || 'Failed to fetch queries';
      })

      // Fetch by ID
      .addCase(fetchQueryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedQuery = null;
      })
      .addCase(fetchQueryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuery = action.payload || null;
      })
      .addCase(fetchQueryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch single query';
        state.selectedQuery = null;
      })

      // Reply to Query
      .addCase(replyToQuery.fulfilled, (state, action) => {
        state.selectedQuery = action.payload;
      })

      // ✅ Create Query
      .addCase(createAdminQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.sentQueries.unshift(action.payload); // Add to sent list
      })
      .addCase(createAdminQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create query';
      })

         .addCase(fetchAdminConnects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminConnects.fulfilled, (state, action) => {
        state.loading = false;
        state.connects = action.payload;
      })
      .addCase(fetchAdminConnects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(createAdminScheduleMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminScheduleMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.connects.unshift(action.payload); // prepend to list
      })
      .addCase(createAdminScheduleMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAdminInstantMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminInstantMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.connects.unshift(action.payload);
      })
      .addCase(createAdminInstantMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminConnectQueriesSlice.reducer;
