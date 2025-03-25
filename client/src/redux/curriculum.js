import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Async thunk for fetching curriculum aims
export const fetchAims = createAsyncThunk(
  'adminCurriculum/fetchAims',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/aimobjective', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch aims');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching syllabus
export const fetchSyllabus = createAsyncThunk(
  'adminCurriculum/fetchSyllabus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/syllabus', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch syllabus');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching exams
export const fetchExams = createAsyncThunk(
  'adminCurriculum/fetchExams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/exams', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch exams');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating an aim
export const createAim = createAsyncThunk(
  'adminCurriculum/createAim',
  async (aimData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('https://sikshamitra.onrender.com/api/admin/aimobjective', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(aimData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create aim');
      }

      // Refresh the aims list after successful creation
      dispatch(fetchAims());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting an aim
export const deleteAim = createAsyncThunk(
  'adminCurriculum/deleteAim',
  async (aimId, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/aimobjective/${aimId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete aim');
      }

      // Refresh the aims list after successful deletion
      dispatch(fetchAims());
      return aimId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminCurriculumSlice = createSlice({
  name: 'adminCurriculum',
  initialState: {
    aims: null,
    syllabus: null,
    exams: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Aims cases
      .addCase(fetchAims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAims.fulfilled, (state, action) => {
        state.loading = false;
        state.aims = action.payload;
        state.error = null;
      })
      .addCase(fetchAims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Syllabus cases
      .addCase(fetchSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabus = action.payload;
        state.error = null;
      })
      .addCase(fetchSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Exams cases
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
        state.error = null;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create aim cases
      .addCase(createAim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAim.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createAim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete aim cases
      .addCase(deleteAim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAim.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminCurriculumSlice.actions;
export default adminCurriculumSlice.reducer;