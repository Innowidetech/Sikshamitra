// redux/superAdmin/superAdminBlogSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch blogs
export const fetchUserBlogs = createAsyncThunk(
    "superAdmin/fetchUserBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://sikshamitra.onrender.com/api/user/blogs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.blogs;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch blogs");
        }
    }
);

// Delete blog by ID
export const deleteBlogById = createAsyncThunk(
    "superAdmin/deleteBlogById",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://sikshamitra.onrender.com/api/superadmin/blog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete blog");
        }
    }
);

// Create blog (used in component)
export const createBlog = createAsyncThunk(
    "superAdmin/createBlog",
    async (blogData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/blog",
                blogData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.blog;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create blog");
        }
    }
);
export const updateBlogById = createAsyncThunk(
    "superAdminUserBlogs/updateBlogById",
    async ({ id, formData }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(

                `https://sikshamitra.onrender.com/api/superadmin/blog/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Update blog error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Unknown error" });
        }
    }
);

export const deleteBlogDetailById = createAsyncThunk(
    "superAdmin/deleteBlogDetailById",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://sikshamitra.onrender.com/api/superadmin/blogDetail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete blog detail");
        }
    }
);



// Slice
const superAdminBlogSlice = createSlice({
    name: "superAdminBlogs",
    initialState: {
        blogs: [],
        title: "",
        loading: false,
        error: null,
    },
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        resetBlogState: (state) => {
            state.title = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch blogs
            .addCase(fetchUserBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchUserBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // delete
            .addCase(deleteBlogById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = state.blogs.filter((b) => b._id !== action.payload);
            })
            .addCase(deleteBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // create blog
            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs.unshift(action.payload);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })// update blog
            .addCase(updateBlogById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBlogById.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.blogs.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.blogs[index] = action.payload;
                }
            })
            .addCase(updateBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // delete blogDetail
            .addCase(deleteBlogDetailById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlogDetailById.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = state.blogs.filter((b) => b._id !== action.payload);
            })
            .addCase(deleteBlogDetailById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// 👇 export actions
export const { setTitle, resetBlogState } = superAdminBlogSlice.actions;

// 👇 export reducer
export default superAdminBlogSlice.reducer;
