import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found in localStorage');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Fetch students for the dropdown
export const fetchStudents = createAsyncThunk(
  'query/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/children', {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      return data.children || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send the query to the API
export const sendQuery = createAsyncThunk(
  'query/sendQuery',
  async (queryData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/query', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(queryData),
      });

      if (!response.ok) {
        throw new Error('Failed to send query');
      }

      const data = await response.json();
      return data.message || 'Query sent successfully';
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice for handling query data
const querySlice = createSlice({
  name: 'query',
  initialState: {
    students: [],
    loading: false,
    errorMessage: null,
    successMessage: null,
  },
  reducers: {
    clearErrorMessage: (state) => {
      state.errorMessage = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(sendQuery.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(sendQuery.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearErrorMessage, clearSuccessMessage } = querySlice.actions;
export default querySlice.reducer;
