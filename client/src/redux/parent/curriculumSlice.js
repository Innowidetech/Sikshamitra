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

// Fetch School Aim and Objectives
export const fetchAimObjective = createAsyncThunk(
  'curriculum/fetchAimObjective',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/aimobjective', {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch aim and objectives');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch Syllabus Data (Store full response object)
export const fetchSyllabus = createAsyncThunk(
  'curriculum/fetchSyllabus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/syllabus', {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch syllabus');
      }
      const data = await response.json();
      return data; // ✅ returning full object: { message, syllabus: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Class Plans Data
export const fetchClassPlans = createAsyncThunk(
  'curriculum/fetchClassPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/parent/classPlan', {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch class plans');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Curriculum Slice
const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState: {
    aimObjective: null,
    syllabus: { syllabus: [] }, // ✅ Store the whole object
    classPlans: [],
    loading: false,
    errorMessage: null,
  },
  reducers: {
    clearErrorMessage: (state) => {
      state.errorMessage = null;
    },
    resetCurriculumState: (state) => {
      state.aimObjective = null;
      state.syllabus = { syllabus: [] };
      state.classPlans = [];
      state.loading = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Aim and Objectives
      .addCase(fetchAimObjective.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAimObjective.fulfilled, (state, action) => {
        state.loading = false;
        state.aimObjective = action.payload;
      })
      .addCase(fetchAimObjective.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // ✅ Syllabus
      .addCase(fetchSyllabus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabus = action.payload; // ✅ Includes message and syllabus array
      })
      .addCase(fetchSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // Class Plans
      .addCase(fetchClassPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.classPlans = action.payload;
      })
      .addCase(fetchClassPlans.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearErrorMessage, resetCurriculumState } = curriculumSlice.actions;
export default curriculumSlice.reducer;
