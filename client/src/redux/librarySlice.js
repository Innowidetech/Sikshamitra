import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch library data with book requests and fine info
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

      // Return both parts of the data
      return {
        fineAmount: response.data.libraryFineAmount,
        requests: response.data.bookRequestsWithParents,
      };
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

      // ✅ Append fields matching API requirements exactly
      formData.append("bookName", bookData.bookName);
      formData.append("author", bookData.author);
      formData.append("subject", bookData.subject);
      formData.append("noOfBooks", bookData.noOfBooks);  // ✅ correct field name
      formData.append("edition", bookData.edition);
      formData.append("price", bookData.price);
      formData.append("pages", bookData.pages);
      formData.append("photo", bookData.photo); // ✅ must be a File object

      // ✅ Debug: Log FormData entries
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

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
      console.error("❌ Add book thunk error:", error.response?.data || error.message);
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

// Update Fine Amount
export const updateFineAmount = createAsyncThunk(
  'library/updateFineAmount',
  async (newFineAmount, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found.');

      const response = await axios.patch(
        'https://sikshamitra.onrender.com/api/admin/fineAmount',
        { fineAmount: newFineAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.fineAmount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Book Request Status
export const updateBookRequestStatus = createAsyncThunk(
  'library/updateBookRequestStatus',
  async ({ requestId, status, dueOn }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const payload = status === 'issued' ? { status, dueOn } : { status };

      console.log("📦 Payload being sent:", payload);

      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/admin/bookRequest/${requestId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { requestId, updatedRequest: response.data.updatedRequest };
    } catch (error) {
      console.error("❌ PATCH Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const editBook = createAsyncThunk(
  "library/editBook",
  async ({ bookId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found.");

      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/admin/book/${bookId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

   console.log("✅ Updated book from API:", response.data);

      return response.data.updatedBook;
    } catch (error) {
      console.error("❌ Edit book thunk error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resolveBookRequest = createAsyncThunk(
  'library/resolveBookRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found.');

      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/admin/resolveBookRequest/${requestId}`, // ✅ CORRECT endpoint
        {
          status: "returned",
          resolved: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        requestId,
        resolvedRequest: response.data, // or response.data.updatedRequest if that's how your backend returns it
      };
    } catch (error) {
      console.error('❌ Resolve book request error:', error.response?.data || error.message);
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
     fineAmount: 0,
    requests: [],
    selectedBook: null,
    loading: false,
    error: null,
    searchQuery: '',
    addBookStatus: 'idle',
    issueBookStatus: 'idle',
    deleteBookStatus: 'idle',
    updateFineStatus: 'idle',
    editBookStatus: 'idle',


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
       state.updateFineStatus = 'idle';
        state.editBookStatus = 'idle';
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
        state.fineAmount = action.payload.fineAmount;
        state.requests = action.payload.requests;
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
      // Add Book
.addCase(addBook.pending, (state) => {
  state.addBookStatus = 'loading';
  state.error = null;
})
.addCase(addBook.fulfilled, (state, action) => {
  state.addBookStatus = 'succeeded';
  state.books.push(action.payload);  // Add newly added book
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
      })

            // Update Fine Amount
    .addCase(updateFineAmount.pending, (state) => {
        state.updateFineStatus = 'loading';
        state.error = null;
      })
      .addCase(updateFineAmount.fulfilled, (state, action) => {
        state.updateFineStatus = 'succeeded';
        state.fineAmount = action.payload;
      })
      .addCase(updateFineAmount.rejected, (state, action) => {
        state.updateFineStatus = 'failed';
        state.error = action.payload;
      })

      // Update Book Request Status
// Update Book Request Status
.addCase(updateBookRequestStatus.fulfilled, (state, action) => {
  if (!action.payload?.requestId) return state; // Avoid undefined errors

  const idx = state.requests.findIndex(r => r._id === action.payload.requestId);
  if (idx === -1) return state; // If not found, do not crash

  // ✅ Safely update just the modified fields
  state.requests[idx] = {
    ...state.requests[idx],
    ...action.payload.updatedRequest,
  };
})


.addCase(updateBookRequestStatus.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


// Edit Book
    .addCase(editBook.pending, (state) => {
        state.editBookStatus = "loading";
      })
     .addCase(editBook.fulfilled, (state, action) => {
  const updatedBook = action.payload;

  if (!updatedBook || !updatedBook._id) return;

  const index = state.allBooks.findIndex(book => book._id === updatedBook._id);
  if (index !== -1) {
    state.allBooks[index] = updatedBook;
  }
})

      .addCase(editBook.rejected, (state, action) => {
        state.editBookStatus = "failed";
        state.error = action.payload;
      })

      // Resolve Book Request
.addCase(resolveBookRequest.fulfilled, (state, action) => {
  const { requestId, resolvedRequest } = action.payload;
  const index = state.requests.findIndex(req => req._id === requestId);
  if (index !== -1) {
    state.requests[index] = resolvedRequest;
  }
})
.addCase(resolveBookRequest.rejected, (state, action) => {
  state.error = action.payload;
});


  },
});

export const { setSearchQuery, setSelectedBook, resetStatus } = librarySlice.actions;
export default librarySlice.reducer;