// bookSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage (or wherever you store it)
      const token = localStorage.getItem('token'); 

      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/books',
        {
          headers: {
            Authorization: `Bearer ${token}`, // add token here
          },
        }
      );

      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const bookSlice = createSlice({
  name: 'book',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
