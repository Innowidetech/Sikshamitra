import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://sikshamitra.onrender.com/api/staff";

// Thunk: Update blog by ID
export const updateBlogById = createAsyncThunk(
    "superAdminStaffBlog/updateBlogById",
    async ({ blogId, blog }, thunkAPI) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/blog/${blogId}`, {
                blog, // Array of { photo, description }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Optional: Fetch all blogs (assumes GET /blog)
export const fetchBlogs = createAsyncThunk(
    "superAdminStaffBlog/fetchBlogs",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/blog`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const superAdminStaffBlogSlice = createSlice({
    name: "superAdminStaffBlog",
    initialState: {
        blogs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Fetch blogs ---
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Update blog by ID ---
            .addCase(updateBlogById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBlogById.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBlog = action.payload;
                const index = state.blogs.findIndex((b) => b._id === updatedBlog._id);
                if (index !== -1) {
                    state.blogs[index] = updatedBlog;
                }
            })
            .addCase(updateBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default superAdminStaffBlogSlice.reducer;
