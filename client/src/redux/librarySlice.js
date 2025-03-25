import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch library data
export const fetchLibrary = createAsyncThunk(
  'library/fetchLibrary',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/library', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.library;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch all books
export const fetchAllBooks = createAsyncThunk(
  'library/fetchAllBooks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.books;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add new book
export const addBook = createAsyncThunk(
  'library/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const formData = new FormData();
      Object.keys(bookData).forEach(key => {
        formData.append(key, bookData[key]);
      });

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/createBook',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Issue book
export const issueBook = createAsyncThunk(
  'library/issueBook',
  async (issueData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/issueBook',
        issueData,
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

// Delete book
export const deleteBook = createAsyncThunk(
  'library/deleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.delete(
        `https://sikshamitra.onrender.com/api/admin/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { bookId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState: {
    books: [],
    allBooks: [],
    filteredBooks: [],
    selectedBook: null,
    loading: false,
    error: null,
    searchQuery: '',
    addBookStatus: 'idle',
    issueBookStatus: 'idle',
    deleteBookStatus: 'idle',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredBooks = state.books.filter(book => {
        const searchTerm = action.payload.toLowerCase();
        return (
          book.bookName?.toLowerCase().includes(searchTerm) ||
          book.issuedBy?.toLowerCase().includes(searchTerm) ||
          book.issuedTo?.studentProfile?.fullname?.toLowerCase().includes(searchTerm) ||
          book.issuedTo?.studentProfile?.class?.toString().toLowerCase().includes(searchTerm) ||
          book.issuedTo?.studentProfile?.section?.toLowerCase().includes(searchTerm)
        );
      });
    },
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    resetStatus: (state) => {
      state.addBookStatus = 'idle';
      state.issueBookStatus = 'idle';
      state.deleteBookStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Library
      .addCase(fetchLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.filteredBooks = action.payload;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Books
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBooks = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Book
      .addCase(addBook.pending, (state) => {
        state.addBookStatus = 'loading';
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state) => {
        state.addBookStatus = 'succeeded';
      })
      .addCase(addBook.rejected, (state, action) => {
        state.addBookStatus = 'failed';
        state.error = action.payload;
      })
      // Issue Book
      .addCase(issueBook.pending, (state) => {
        state.issueBookStatus = 'loading';
        state.error = null;
      })
      .addCase(issueBook.fulfilled, (state) => {
        state.issueBookStatus = 'succeeded';
      })
      .addCase(issueBook.rejected, (state, action) => {
        state.issueBookStatus = 'failed';
        state.error = action.payload;
      })
      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.deleteBookStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.deleteBookStatus = 'succeeded';
        state.allBooks = state.allBooks.filter(book => book._id !== action.payload.bookId);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.deleteBookStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedBook, resetStatus } = librarySlice.actions;
export default librarySlice.reducer;