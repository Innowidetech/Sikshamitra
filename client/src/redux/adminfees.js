import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Async thunks for API calls
export const fetchFees = createAsyncThunk(
  'adminFees/fetchFees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/classwisefees', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to fetch fees');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFees = createAsyncThunk(
  'adminFees/addFees',
  async (feeData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/classwisefees', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(feeData),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to add fees');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFees = createAsyncThunk(
  'adminFees/updateFees',
  async ({ id, feeData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/classwisefees/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(feeData),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to update fees');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminFeesSlice = createSlice({
  name: 'adminFees',
  initialState: {
    fees: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Fees
      .addCase(fetchFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Fees
      .addCase(addFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees.push(action.payload);
      })
      .addCase(addFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Fees
      .addCase(updateFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFees.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fees.findIndex(fee => fee._id === action.payload._id);
        if (index !== -1) {
          state.fees[index] = action.payload;
        }
      })
      .addCase(updateFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminFeesSlice.actions;
export default adminFeesSlice.reducer;