import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  accounts: [],
  revenueAndExpenses: {},
  teacherRequests: [],
  status: 'idle',
  error: null,
  errorAccounts: null,
  errorRevenue: null,
  errorTeacherRequests: null,
};

// Get token
const getToken = () => localStorage.getItem('token');

// Fetch accounts
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async () => {
    const token = getToken();
    const response = await fetch('https://sikshamitra.onrender.com/api/admin/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch accounts');
    const data = await response.json();
    return data.accounts;
  }
);

// Fetch revenue and expenses
export const fetchRevenueAndExpenses = createAsyncThunk(
  'accounts/fetchRevenueAndExpenses',
  async () => {
    const token = getToken();
    const response = await fetch('https://sikshamitra.onrender.com/api/admin/accountsData', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch revenue and expenses data');
    const data = await response.json();
    return data;
  }
);

// Fetch teacher requests
export const fetchTeacherRequests = createAsyncThunk(
  'accounts/fetchTeacherRequests',
  async () => {
    const token = getToken();
    const response = await fetch('https://sikshamitra.onrender.com/api/admin/expenseRequest', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch teacher requests');
    const data = await response.json();
    return data.teacherRequests || [];
  }
);

// Update teacher request
export const updateTeacherRequest = createAsyncThunk(
  'accounts/updateTeacherRequest',
  async ({ requestId, status, amount }) => {
    const token = getToken();
    if (status === 'success' && !amount) {
      throw new Error('Amount is required when status is success');
    }
    const response = await fetch(`https://sikshamitra.onrender.com/api/admin/expenseRequest/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        amount: status === 'success' ? amount : null,
      }),
    });
    if (!response.ok) throw new Error('Failed to update teacher request');
    const data = await response.json();
    return data;
  }
);

// Edit an expense
export const editExpense = createAsyncThunk(
  'accounts/editExpense',
  async ({ expenseId, data }) => {
    const token = getToken();
    if (!data || Object.keys(data).length === 0) {
      throw new Error('At least one field must be provided to update the expense');
    }
    const response = await fetch(`https://sikshamitra.onrender.com/api/admin/expenses/${expenseId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to edit expense');
    const result = await response.json();
    return result;
  }
);

// Delete an expense
export const deleteExpense = createAsyncThunk(
  'accounts/deleteExpense',
  async (expenseId) => {
    const token = getToken();
    const response = await fetch(`https://sikshamitra.onrender.com/api/admin/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to delete expense');
    return expenseId;
  }
);

// ✅ Post a new expense
export const postExpense = createAsyncThunk(
  'accounts/postExpense',
  async (expenseData, { rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/expenses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to post expense');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Post a new income
export const postIncome = createAsyncThunk(
  'accounts/postIncome',
  async (incomeData, { rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/income', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to post income');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
        state.errorAccounts = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.errorAccounts = action.error.message;
      })

      .addCase(fetchRevenueAndExpenses.pending, (state) => {
        state.status = 'loading';
        state.errorRevenue = null;
      })
      .addCase(fetchRevenueAndExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.revenueAndExpenses = action.payload;
      })
      .addCase(fetchRevenueAndExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.errorRevenue = action.error.message;
      })

      .addCase(fetchTeacherRequests.pending, (state) => {
        state.status = 'loading';
        state.errorTeacherRequests = null;
      })
      .addCase(fetchTeacherRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teacherRequests = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTeacherRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.errorTeacherRequests = action.error.message;
      })

      .addCase(updateTeacherRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTeacherRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teacherRequests = state.teacherRequests.map((req) =>
          req.id === action.payload.id ? action.payload : req
        );
      })
      .addCase(updateTeacherRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(editExpense.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;
        if (Array.isArray(state.revenueAndExpenses.expenses)) {
          state.revenueAndExpenses.expenses = state.revenueAndExpenses.expenses.map((exp) =>
            exp.id === updated.id ? updated : exp
          );
        }
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deleteExpense.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        if (Array.isArray(state.revenueAndExpenses.expenses)) {
          state.revenueAndExpenses.expenses = state.revenueAndExpenses.expenses.filter(
            (exp) => exp.id !== id
          );
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(postExpense.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(postExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.revenueAndExpenses.expenses)) {
          state.revenueAndExpenses.expenses.unshift(action.payload);
        } else {
          state.revenueAndExpenses.expenses = [action.payload];
        }
      })
      .addCase(postExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // ✅ Handle postIncome
      .addCase(postIncome.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(postIncome.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.revenueAndExpenses.revenue)) {
          state.revenueAndExpenses.revenue.unshift(action.payload);
        } else {
          state.revenueAndExpenses.revenue = [action.payload];
        }
      })
      .addCase(postIncome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default accountSlice.reducer;
