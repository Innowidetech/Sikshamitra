// ✅ Only keep title and status flags in Redux
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const createBlog = createAsyncThunk(
    'blog/createBlog',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://sikshamitra.onrender.com/api/staff/blog',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // DO NOT set Content-Type manually for FormData — let the browser set it
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const deleteBlog = createAsyncThunk(
    'blog/deleteBlog',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `https://sikshamitra.onrender.com/api/staff/blog/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const updateBlog = createAsyncThunk(
    'blog/updateBlog',
    async ({ id, title, blog }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `https://sikshamitra.onrender.com/api/staff/blog/${id}`,
                { title, blog },
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

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        title: '',
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        resetBlogState: (state) => {
            state.title = '';
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createBlog.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlog.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 🟢 Update Blog (Edit)
            .addCase(updateBlog.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(updateBlog.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setTitle, resetBlogState } = blogSlice.actions;
export { createBlog, deleteBlog, updateBlog };
export default blogSlice.reducer;
