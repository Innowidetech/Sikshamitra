import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Async thunk for fetching class ratios
export const fetchClassRatios = createAsyncThunk(
  'adminClasses/fetchClassRatios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/students/ratio', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to fetch class ratios');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching classes
export const fetchClasses = createAsyncThunk(
  'adminClasses/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/classes', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      return data.classData; // Return the classData array directly
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a class
export const createClass = createAsyncThunk(
  'adminClasses/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/class', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(classData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to create class');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminClassesSlice = createSlice({
  name: 'adminClasses',
  initialState: {
    classRatios: {},
    classes: [],
    loading: false,
    error: null,
    createClassLoading: false,
    createClassError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createClassError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Class Ratios
      .addCase(fetchClassRatios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassRatios.fulfilled, (state, action) => {
        state.loading = false;
        state.classRatios = action.payload;
      })
      .addCase(fetchClassRatios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.createClassLoading = true;
        state.createClassError = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.createClassLoading = false;
        state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.createClassLoading = false;
        state.createClassError = action.payload;
      });
  },
});

export const { clearError } = adminClassesSlice.actions;
export default adminClassesSlice.reducer;