// redux/superAdmin/superAdminAccountsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Fetch income and expenses
export const fetchIncomeAndExpenses = createAsyncThunk(
    "superAdmin/fetchIncomeAndExpenses",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://sikshamitra.onrender.com/api/superadmin/accounts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { income, expense } = response.data;
            return { income, expense };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch accounts data"
            );
        }
    }
);

// ✅ Add new income
export const addIncome = createAsyncThunk(
    "superAdmin/addIncome",
    async (incomeData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/income",
                incomeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Income added successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add income");
            return rejectWithValue(error.response?.data);
        }
    }
);
export const addExpense = createAsyncThunk(
    "superAdmin/addExpense",
    async (expenseData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/expense",
                expenseData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Expense added successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add expense");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const editIncomeById = createAsyncThunk(
    "superAdmin/editIncomeById",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            // Add validation
            console.log("Editing income with ID:", id);
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid income ID provided');
            }

            console.log("Editing income with ID:", id); // Debug log

            const token = localStorage.getItem("token");
            const response = await axios.post(
                `https://sikshamitra.onrender.com/api/superadmin/editIncome/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Edit income error:", error); // Debug log
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update income"
            );
        }
    }
);

export const editExpenseById = createAsyncThunk(
    "superAdmin/editExpenseById",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            if (!id || id === "undefined" || id === "null") {
                throw new Error("Invalid expense ID provided");
            }

            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `https://sikshamitra.onrender.com/api/superadmin/editExpense/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Expense updated successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update expense");
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update expense"
            );
        }
    }
);

const superAdminAccountsSlice = createSlice({
    name: "superAdminAccounts",
    initialState: {
        income: [],
        expense: [],
        loading: false,
        error: null,
        success: false, // ✅ Added
        expenseSuccess: false,  // for expense
        expenseError: null,
    },
    reducers: {
        resetIncomeStatus: (state) => {
            state.success = false;
            state.error = null;
        },
        resetExpenseStatus: (state) => {
            state.expenseSuccess = false;
            state.expenseError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch income and expense
            .addCase(fetchIncomeAndExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncomeAndExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.income = action.payload.income;
                state.expense = action.payload.expense;
            })
            .addCase(fetchIncomeAndExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add income
            .addCase(addIncome.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(addIncome.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(addExpense.pending, (state) => {
                state.loading = true;
                state.expenseSuccess = false;
                state.expenseError = null;
            })
            .addCase(addExpense.fulfilled, (state) => {
                state.loading = false;
                state.expenseSuccess = true;
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.expenseSuccess = false;
                state.expenseError = action.payload;
            }).addCase(editIncomeById.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(editIncomeById.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(editIncomeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(editExpenseById.pending, (state) => {
                state.loading = true;
                state.expenseSuccess = false;
            })
            .addCase(editExpenseById.fulfilled, (state) => {
                state.loading = false;
                state.expenseSuccess = true;
            })
            .addCase(editExpenseById.rejected, (state, action) => {
                state.loading = false;
                state.expenseSuccess = false;
                state.expenseError = action.payload;
            });
    },
});

export const { resetIncomeStatus, resetExpenseStatus } = superAdminAccountsSlice.actions;
export default superAdminAccountsSlice.reducer;
