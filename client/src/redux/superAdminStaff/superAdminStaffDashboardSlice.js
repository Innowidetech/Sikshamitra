import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


// Thunk to fetch staff dashboard + task data
export const fetchSuperAdminStaffDashboardData = createAsyncThunk(
  'superadminstaffDashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/staff/satasks', {
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



export const updateTaskStatus = createAsyncThunk(
  'superAdminStaffDashboard/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/staff/satask/${taskId}`,
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

const superAdminStaffDashboardSlice = createSlice({
  name: 'superadminstaffDashboard',
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
      .addCase(fetchSuperAdminStaffDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminStaffDashboardData.fulfilled, (state, action) => {
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
      .addCase(fetchSuperAdminStaffDashboardData.rejected, (state, action) => {
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

// Thunk to fetch school names
export const fetchSchoolNames = createAsyncThunk(
  'superadminstaffDashboard/fetchSchoolNames',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/staff/schoolNames', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // adjust based on your actual API response structure
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




export default superAdminStaffDashboardSlice.reducer;
