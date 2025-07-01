import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch staff dashboard + task data
export const fetchStaffDashboardData = createAsyncThunk(
  'staffDashboard/fetchStaffDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/staff/stasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to update task status (completed or pending)
export const updateTaskStatus = createAsyncThunk(
  'staffDashboard/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/staff/stask/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { taskId, updatedTask: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks and dashboard data
      .addCase(fetchStaffDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        const { totalTasks, completedTasks, pendingTasks, dateOfJoining, role, tasks } = action.payload;

        state.dashboard = {
          totalTasks,
          completedTasks,
          pendingTasks,
          dateOfJoining,
          role,
        };
        state.tasks = tasks || [];
      })
      .addCase(fetchStaffDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Update status of a task
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, updatedTask } = action.payload;
        const index = state.tasks.findIndex((task) => task._id === taskId);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updatedTask };

          // Recalculate counts
          const totalTasks = state.tasks.length;
          const completedTasks = state.tasks.filter(t => t.status === 'completed').length;
          const pendingTasks = totalTasks - completedTasks;

          state.dashboard.totalTasks = totalTasks;
          state.dashboard.completedTasks = completedTasks;
          state.dashboard.pendingTasks = pendingTasks;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update task status';
      });
  },
});

export default staffDashboardSlice.reducer;
