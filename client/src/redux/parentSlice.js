import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch parents data
export const fetchParents = createAsyncThunk(
  'parents/fetchParents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/parents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.parents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice for parents data
const parentsSlice = createSlice({
  name: 'parents',
  initialState: {
    parents: [],
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addParent: (state, action) => {
      state.parents.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false;
        state.parents = action.payload;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, addParent } = parentsSlice.actions;

export default parentsSlice.reducer;
