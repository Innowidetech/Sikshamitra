// src/redux/superAdminStaff/superAdminStaffPostReplySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const postStaffReplyMessage = createAsyncThunk(
  'superAdminStaffReply/postReply',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // ⬅️ optional, if auth is required
      const response = await axios.post(
        `https://sikshamitra.onrender.com/api/staff/saquery/${id}`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const superAdminStaffPostReplySlice = createSlice({
  name: 'superAdminStaffReplypostReply',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetPostReplyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postStaffReplyMessage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postStaffReplyMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(postStaffReplyMessage.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

 // export const { resetPostReplyState } = superAdminStaffPostReplySlice.actions;
export default superAdminStaffPostReplySlice.reducer;
