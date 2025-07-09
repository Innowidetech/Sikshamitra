import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth headers
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return isFormData
    ? { Authorization: `Bearer ${token}` } // no content-type for FormData, browser sets it automatically
    : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

      dispatch(fetchAims());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ New async thunk for updating an aim
export const updateAim = createAsyncThunk(
  'adminCurriculum/updateAim',
  async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/aimobjective/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update aim');
      }

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

      dispatch(fetchAims());
      return aimId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching syllabus based on class
export const fetchSyllabus = createAsyncThunk(
  'adminCurriculum/fetchSyllabus',
  async (className = '1', { rejectWithValue }) => {
    try {
      const response = await fetch(`https://sikshamitra.onrender.com/api/admin/syllabus/${className}`, {
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

// Async thunk for creating or updating syllabus
export const createOrUpdateSyllabus = createAsyncThunk(
  'adminCurriculum/createOrUpdateSyllabus',
  async ({ id, className, subject, description, file }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('className', className);
      formData.append('subject', subject);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      // Conditionally set URL based on presence of ID
      const url = id
        ? `https://sikshamitra.onrender.com/api/admin/syllabus/${id}`
        : 'https://sikshamitra.onrender.com/api/admin/syllabus';

      const response = await fetch(url, {
        method: 'POST', // Still using POST, assuming your API handles create/update via same method
        headers: getAuthHeaders(true),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create or update syllabus');
      }

      dispatch(fetchSyllabus(className));
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Slice
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
      // Aims
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

      // Create aim
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

      // Update aim
      .addCase(updateAim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAim.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateAim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete aim
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
      })

      // Syllabus
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

      // Exams
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

      // Create or update syllabus
      .addCase(createOrUpdateSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateSyllabus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrUpdateSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminCurriculumSlice.actions;

export default adminCurriculumSlice.reducer;

// Export thunks

