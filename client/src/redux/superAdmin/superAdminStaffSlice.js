import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch staff data
export const fetchSuperAdminStaff = createAsyncThunk(
    "superAdmin/fetchStaff",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://sikshamitra.onrender.com/api/superadmin/staff",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.staff;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch staff data");
        }
    }
);
export const addSuperAdminStaff = createAsyncThunk(
    "superAdmin/addStaff",
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/staff",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.staff;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to add new staff"
            );
        }
    }
);


const superAdminStaffSlice = createSlice({
    name: "superAdminStaff",
    initialState: {
        staffList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuperAdminStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staffList = action.payload;
            })
            .addCase(fetchSuperAdminStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            }).addCase(addSuperAdminStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSuperAdminStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staffList.push(action.payload);
            })
            .addCase(addSuperAdminStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default superAdminStaffSlice.reducer;
