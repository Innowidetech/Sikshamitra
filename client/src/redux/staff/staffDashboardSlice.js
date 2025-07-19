import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ---------- FETCH TASKS + DASHBOARD ----------
export const fetchStaffDashboardData = createAsyncThunk(
  'staffDashboard/fetchStaffDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/staff/stasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- UPDATE TASK STATUS ----------
export const updateTaskStatus = createAsyncThunk(
  'staffDashboard/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/staff/stask/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { taskId, updatedTask: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- FETCH STAFF QUERIES ----------
export const fetchStaffQueries = createAsyncThunk(
  'staffDashboard/fetchStaffQueries',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/staff/query', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // { queriesReceived, queriesSent }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- SEND A NEW STAFF QUERY ----------
export const sendStaffQuery = createAsyncThunk(
  'staffDashboard/sendStaffQuery',
  async (queryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/staff/query',
        queryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- FETCH TEACHER NAMES ----------
export const fetchTeacherNames = createAsyncThunk(
  'staffDashboard/fetchTeacherNames',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/staff/teacherNames',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.teachers.map((t) => ({
        fullname: t.profile.fullname,
        _id: t._id,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- GET QUERY BY ID ----------
export const getQueryById = createAsyncThunk(
  'staffDashboard/getQueryById',
  async (queryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/staff/query/${queryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------- REPLY TO QUERY ----------
export const replyToQuery = createAsyncThunk(
  'staffDashboard/replyToQuery',
  async ({ queryId, replyMessage }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://sikshamitra.onrender.com/api/staff/query/${queryId}`,
        { message: replyMessage }, // ✅ FIXED
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// ---------- SLICE ----------
const staffDashboardSlice = createSlice({
  name: 'staffDashboard',
  initialState: {
    dashboard: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      dateOfJoining: '',
      role: '',
    },
    tasks: [],
    queriesReceived: [],
    queriesSent: [],
    selectedQuery: null,
    loading: false,
    queryLoading: false,
    error: null,
    queryError: null,
    teacherNames: [],
    teacherLoading: false,
    teacherError: null,
    replyStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------- DASHBOARD ----------
      .addCase(fetchStaffDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        const { totalTasks, completedTasks, pendingTasks, dateOfJoining, role, tasks } = action.payload;
        state.dashboard = { totalTasks, completedTasks, pendingTasks, dateOfJoining, role };
        state.tasks = tasks || [];
      })
      .addCase(fetchStaffDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- UPDATE TASK ----------
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, updatedTask } = action.payload;
        const index = state.tasks.findIndex((task) => task._id === taskId);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };
          const totalTasks = state.tasks.length;
          const completedTasks = state.tasks.filter((t) => t.status === 'completed').length;
          state.dashboard.completedTasks = completedTasks;
          state.dashboard.pendingTasks = totalTasks - completedTasks;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ---------- FETCH QUERIES ----------
      .addCase(fetchStaffQueries.pending, (state) => {
        state.queryLoading = true;
        state.queryError = null;
      })
      .addCase(fetchStaffQueries.fulfilled, (state, action) => {
        state.queryLoading = false;
        state.queriesReceived = action.payload.queriesReceived || [];
        state.queriesSent = action.payload.queriesSent || [];
      })
      .addCase(fetchStaffQueries.rejected, (state, action) => {
        state.queryLoading = false;
        state.queryError = action.payload;
      })

      // ---------- SEND QUERY ----------
      .addCase(sendStaffQuery.pending, (state) => {
        state.queryLoading = true;
        state.queryError = null;
      })
      .addCase(sendStaffQuery.fulfilled, (state, action) => {
        state.queryLoading = false;
        state.queriesSent.unshift(action.payload);
      })
      .addCase(sendStaffQuery.rejected, (state, action) => {
        state.queryLoading = false;
        state.queryError = action.payload;
      })

      // ---------- TEACHER NAMES ----------
      .addCase(fetchTeacherNames.pending, (state) => {
        state.teacherLoading = true;
        state.teacherError = null;
      })
      .addCase(fetchTeacherNames.fulfilled, (state, action) => {
        state.teacherLoading = false;
        state.teacherNames = action.payload;
      })
      .addCase(fetchTeacherNames.rejected, (state, action) => {
        state.teacherLoading = false;
        state.teacherError = action.payload;
      })

      // ---------- GET QUERY BY ID ----------
      .addCase(getQueryById.pending, (state) => {
        state.queryLoading = true;
        state.queryError = null;
        state.selectedQuery = null;
      })
      .addCase(getQueryById.fulfilled, (state, action) => {
        state.queryLoading = false;
        state.selectedQuery = action.payload;
      })
      .addCase(getQueryById.rejected, (state, action) => {
        state.queryLoading = false;
        state.queryError = action.payload;
      })

      // ---------- REPLY TO QUERY ----------
      .addCase(replyToQuery.pending, (state) => {
        state.replyStatus = 'loading';
        state.queryError = null;
      })
      .addCase(replyToQuery.fulfilled, (state, action) => {
        state.replyStatus = 'success';
        if (state.selectedQuery && action.payload) {
          state.selectedQuery = action.payload;
        }
      })
      .addCase(replyToQuery.rejected, (state, action) => {
        state.replyStatus = 'failed';
        state.queryError = action.payload;
      });
  },
});

export default staffDashboardSlice.reducer;
