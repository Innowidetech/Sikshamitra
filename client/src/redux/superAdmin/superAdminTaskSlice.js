import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⬇️ Thunk to fetch all tasks
export const fetchSuperAdminTasks = createAsyncThunk(
    "superAdmin/fetchTasks",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://sikshamitra.onrender.com/api/superadmin/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data; // includes message, pendingTasks, completedTasks
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch tasks"
            );
        }
    }
);
export const assignTask = createAsyncThunk(
    "superAdmin/assignTask",
    async (taskData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/task",
                taskData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data; // { message, task }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to assign task"
            );
        }
    }
);

const superAdminTaskSlice = createSlice({
    name: "superAdminTasks",
    initialState: {
        pendingTasks: [],
        completedTasks: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuperAdminTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingTasks = action.payload.pendingTasks || [];
                state.completedTasks = action.payload.completedTasks || [];
            })
            .addCase(fetchSuperAdminTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(assignTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.assignSuccess = null;
            })
            .addCase(assignTask.fulfilled, (state, action) => {
                state.loading = false;
                state.assignSuccess = action.payload.message;
            })
            .addCase(assignTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default superAdminTaskSlice.reducer;
