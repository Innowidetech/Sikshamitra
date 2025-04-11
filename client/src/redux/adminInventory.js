import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.inventory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSales = createAsyncThunk(
  'inventory/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.get('https://sikshamitra.onrender.com/api/admin/inventory/sale', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.sales;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/addItem',
  async (itemData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/inventory/add',
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await dispatch(fetchInventory());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saleInventoryItem = createAsyncThunk(
  'inventory/saleItem',
  async (saleData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/inventory/sale',
        saleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await dispatch(fetchInventory());
      await dispatch(fetchSales());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    sales: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saleInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saleInventoryItem.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saleInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;