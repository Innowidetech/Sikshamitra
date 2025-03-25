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

// Fetch fee receipts
export const fetchFeesReceipts = createAsyncThunk(
  'fees/fetchFeesReceipts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/getFeesReceipts', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch fee receipts');
      }
      const data = await response.json();
      return data.feesReceipts || [];  // Extract feeReceipts from the API response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch children (students) details
export const fetchChildren = createAsyncThunk(
  'fees/fetchChildren',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/children', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }
      const data = await response.json();
      return data.children || [];  // Extract children from the API response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Pay fees (POST)
export const payFees = createAsyncThunk(
  'fees/payFees',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/payFee', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) {
        throw new Error('Failed to pay fees');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const feesSlice = createSlice({
  name: 'fees',
  initialState: {
    feesReceipts: [],
    children: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.feesReceipts = [];
      state.children = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Fees Receipts
      .addCase(fetchFeesReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.feesReceipts = action.payload;
      })
      .addCase(fetchFeesReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Children
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pay Fees
      .addCase(payFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(payFees.fulfilled, (state, action) => {
        state.loading = false;
        alert('Payment successful');
      })
      .addCase(payFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetState } = feesSlice.actions;
export default feesSlice.reducer;
