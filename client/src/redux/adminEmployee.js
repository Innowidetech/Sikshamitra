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
export const fetchEmployees = createAsyncThunk(
  'adminEmployee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/employee', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employees');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEmployee = createAsyncThunk(
  'adminEmployee/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/employee', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: employeeData.name,
          role: employeeData.role,
          department: employeeData.department,
          mobileNumber: employeeData.mobileNumber,
          salary: parseInt(employeeData.salary, 10)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
      
      // After successful addition, return the new employee data
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editEmployee = createAsyncThunk(
  'adminEmployee/editEmployee',
  async ({ employeeId, employeeData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/employee/${employeeId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          newName: employeeData.name,
          newRole: employeeData.role,
          newDepartment: employeeData.department,
          newMobileNumber: employeeData.mobileNumber,
          newSalary: parseInt(employeeData.salary, 10)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit employee');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminEmployeeSlice = createSlice({
  name: 'adminEmployee',
  initialState: {
    employees: null,
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
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Instead of updating the state directly, we'll fetch the updated list
        // This ensures we have the most current data including the total salary
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Employee
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Instead of updating the state directly, we'll fetch the updated list
        // This ensures we have the most current data including the total salary
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminEmployeeSlice.actions;
export default adminEmployeeSlice.reducer;