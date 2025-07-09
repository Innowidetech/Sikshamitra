// bookSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all books
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/books',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Request a book by ID
export const requestBook = createAsyncThunk(
  'books/requestBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://sikshamitra.onrender.com/api/student/requestBook/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { bookId, message: response.data.message || 'Book requested successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRequestedBooks = createAsyncThunk(
  'books/fetchRequestedBooks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/student/bookRequests',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response fetchRequestedBooks:", response.data);  // <-- यहाँ देखें response
      return response.data.requests;  // Ensure this matches actual response shape
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const bookSlice = createSlice({
  name: 'book',
  initialState: {
    items: [], // All books
    loading: false,
    error: null,

    requestStatus: null, // Book request status
    requestError: null,

    requestedBooks: [], // Borrowing history
    requestedBooksLoading: false,
    requestedBooksError: null,
  },
  reducers: {
    clearRequestStatus(state) {
      state.requestStatus = null;
      state.requestError = null;
    },
    clearRequestedBooksError(state) {
      state.requestedBooksError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchBooks
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
      })

      // Handle requestBook
      .addCase(requestBook.pending, (state) => {
        state.requestStatus = 'loading';
        state.requestError = null;
      })
      .addCase(requestBook.fulfilled, (state, action) => {
        state.requestStatus = 'success';
        const index = state.items.findIndex(book => book._id === action.payload.bookId);
        if (index !== -1) {
          state.items[index].availability = false;
        }
      })
      .addCase(requestBook.rejected, (state, action) => {
        state.requestStatus = 'failed';
        state.requestError = action.payload;
      })

    // Handling state update in extraReducers
  .addCase(fetchRequestedBooks.pending, (state) => {
    state.requestedBooksLoading = true;
    state.requestedBooksError = null;
  })
.addCase(fetchRequestedBooks.fulfilled, (state, action) => {
  console.log("Redux action payload fetchRequestedBooks:", action.payload);
  state.requestedBooksLoading = false;
  state.requestedBooks = action.payload;
})



  .addCase(fetchRequestedBooks.rejected, (state, action) => {
    state.requestedBooksLoading = false;
    state.requestedBooksError = action.payload;
  });

  },
});

// Export actions and reducer
export const { clearRequestStatus, clearRequestedBooksError } = bookSlice.actions;
export default bookSlice.reducer;
