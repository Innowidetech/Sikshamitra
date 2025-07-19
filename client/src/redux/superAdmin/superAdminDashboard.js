import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper for auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Thunk: Dashboard data
export const fetchSuperAdminDashboard = createAsyncThunk(
    'superAdmin/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch('https://sikshamitra.onrender.com/api/superadmin/dashboard', {
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch dashboard data');
            return await res.json(); // { schools, activeSchools, ... }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Thunk: Accounts data
export const fetchSuperAdminAccounts = createAsyncThunk(
    'superAdmin/fetchAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch('https://sikshamitra.onrender.com/api/superadmin/accounts', {
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch accounts');
            return await res.json(); // { accounts: [...], income: [...], expense: [...] }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    dashboard: {
        schools: 0,
        activeSchools: 0,
        inActiveSchools: 0,
        suspendedSchools: 0,
        teachers: 0,
        students: 0,
        parents: 0,
    },
    accounts: {
        accounts: [],
        income: [],
        expense: []
    },
    loadingDashboard: false,
    loadingAccounts: false,
    dashboardError: null,
    accountsError: null,
};

const superAdminSlice = createSlice({
    name: 'superAdmin',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.dashboardError = null;
            state.accountsError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Dashboard async logic
            .addCase(fetchSuperAdminDashboard.pending, (state) => {
                state.loadingDashboard = true;
                state.dashboardError = null;
            })
            .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
                state.loadingDashboard = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
                state.loadingDashboard = false;
                state.dashboardError = action.payload;
            })
            // Accounts async logic
            .addCase(fetchSuperAdminAccounts.pending, (state) => {
                state.loadingAccounts = true;
                state.accountsError = null;
            })
            .addCase(fetchSuperAdminAccounts.fulfilled, (state, action) => {
                state.loadingAccounts = false;
                state.accounts = action.payload;
            })
            .addCase(fetchSuperAdminAccounts.rejected, (state, action) => {
                state.loadingAccounts = false;
                state.accountsError = action.payload;
            });
    }
});

export const { clearErrors } = superAdminSlice.actions;
export default superAdminSlice.reducer;
