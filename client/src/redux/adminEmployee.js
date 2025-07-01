import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
  'adminEmployee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/staff', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch staff');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Employee
export const addEmployee = createAsyncThunk(
  'adminEmployee/addEmployee',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/staff', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email: staffData.email,
          password: staffData.password,
          mobileNumber: staffData.mobileNumber,
          name: staffData.name,
          employeeRole: staffData.employeeRole,
          department: staffData.department,
          salary: parseInt(staffData.salary, 10)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add staff');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Edit Employee
export const editEmployee = createAsyncThunk(
  'adminEmployee/editEmployee',
  async ({ staffId, staffData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/staff/${staffId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email: staffData.email,
          mobileNumber: staffData.mobileNumber,
          isActive: staffData.isActive, // ✅ status integration
          name: staffData.name,
          employeeRole: staffData.employeeRole,
          department: staffData.department,
          salary: parseInt(staffData.salary, 10)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit staff');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminEmployeeSlice = createSlice({
  name: 'adminEmployee',
  initialState: {
    staffList: null,
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
      // Fetch
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminEmployeeSlice.actions;
export default adminEmployeeSlice.reducer;
