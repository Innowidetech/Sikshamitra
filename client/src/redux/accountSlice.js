import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  accounts: [],
  revenueAndExpenses: {},
  teacherRequests: [],
   updatedIncomeHistoryById: {}, // ✅ Individual income history
  loadingIncomeHistoryById: {}, // ✅ Per-income loading status
  status: 'idle',
  error: null,
  errorAccounts: null,
  errorRevenue: null,
  errorTeacherRequests: null,
  errorIncomeHistory: null,
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

// Fetch updated income history
export const fetchUpdatedIncomeHistory = createAsyncThunk(
  'accounts/fetchUpdatedIncomeHistory',
  async () => {
    const token = getToken();
    const response = await fetch('https://sikshamitra.onrender.com/api/admin/updatedIncomeHistory', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch updated income history');
    const data = await response.json();
    return data;
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

// Post a new expense
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

// Post a new income
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

// Edit income
export const editIncome = createAsyncThunk(
  'accounts/editIncome',
  async ({ incomeId, incomeData }, { rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/income/${incomeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to edit income');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch updated income history by ID
export const fetchUpdatedIncomeHistoryById = createAsyncThunk(
  'accounts/fetchUpdatedIncomeHistoryById',
  async (incomeId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/updatedIncomeHistory/${incomeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch income history by ID');
      }

      const data = await response.json();
      return data.incomeHistory || []; // Ensure it's always an array
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

      .addCase(fetchUpdatedIncomeHistory.pending, (state) => {
        state.status = 'loading';
        state.errorIncomeHistory = null;
      })
      .addCase(fetchUpdatedIncomeHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.updatedIncomeHistory = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUpdatedIncomeHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.errorIncomeHistory = action.error.message;
      })

      .addCase(updateTeacherRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teacherRequests = state.teacherRequests.map((req) =>
          req.id === action.payload.id ? action.payload : req
        );
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

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        if (Array.isArray(state.revenueAndExpenses.expenses)) {
          state.revenueAndExpenses.expenses = state.revenueAndExpenses.expenses.filter(
            (exp) => exp.id !== id
          );
        }
      })

      .addCase(postExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.revenueAndExpenses.expenses)) {
          state.revenueAndExpenses.expenses.unshift(action.payload);
        } else {
          state.revenueAndExpenses.expenses = [action.payload];
        }
      })

      .addCase(postIncome.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(state.revenueAndExpenses.revenue)) {
          state.revenueAndExpenses.revenue.unshift(action.payload);
        } else {
          state.revenueAndExpenses.revenue = [action.payload];
        }
      })

      .addCase(editIncome.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(editIncome.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;
        if (Array.isArray(state.revenueAndExpenses.revenue)) {
          state.revenueAndExpenses.revenue = state.revenueAndExpenses.revenue.map((rev) =>
            rev.id === updated.id ? updated : rev
          );
        }
      })
      .addCase(editIncome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })


// Updated Income History by ID
      .addCase(fetchUpdatedIncomeHistoryById.pending, (state, action) => {
        const incomeId = action.meta.arg;
        state.loadingIncomeHistoryById[incomeId] = true;
      })
      .addCase(fetchUpdatedIncomeHistoryById.fulfilled, (state, action) => {
        const incomeId = action.meta.arg;
        state.loadingIncomeHistoryById[incomeId] = false;
        state.updatedIncomeHistoryById[incomeId] = action.payload;
      })
      .addCase(fetchUpdatedIncomeHistoryById.rejected, (state, action) => {
        const incomeId = action.meta.arg;
        state.loadingIncomeHistoryById[incomeId] = false;
        state.updatedIncomeHistoryById[incomeId] = [];
        state.errorIncomeHistory = action.payload || action.error.message;
      });
  },
});

export default accountSlice.reducer;