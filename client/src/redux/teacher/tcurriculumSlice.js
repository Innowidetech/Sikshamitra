import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ 1. Fetch Syllabus
export const fetchTeacherSyllabus = createAsyncThunk(
  'tcurriculum/fetchTeacherSyllabus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://sikshamitra.onrender.com/api/teacher/syllabus', {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch syllabus');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ 2. Create or Update Syllabus
export const createOrUpdateSyllabus = createAsyncThunk(
  'tcurriculum/createOrUpdateSyllabus',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch('https://sikshamitra.onrender.com/api/teacher/syllabus', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit syllabus');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ 3. Create Class Plan
export const createClassPlan = createAsyncThunk(
  'tcurriculum/createClassPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const res = await fetch('https://sikshamitra.onrender.com/api/teacher/classPlan', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });
      if (!res.ok) throw new Error('Failed to create class plan');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ 4. Fetch Aim Objectives
export const fetchAimObjectives = createAsyncThunk(
  'tcurriculum/fetchAimObjectives',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://sikshamitra.onrender.com/api/teacher/aimobjective', {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch aim objectives');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ 5. Fetch Class Plans (updated for nested classPlan object)
export const fetchTeacherClassPlans = createAsyncThunk(
  'tcurriculum/fetchTeacherClassPlans',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://sikshamitra.onrender.com/api/teacher/classPlan', {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch class plans');
      const data = await res.json();
      return data.classPlan; // ✅ return full classPlan object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tcurriculumSlice = createSlice({
  name: 'tcurriculum',
  initialState: {
    syllabus: { syllabus: [] },
    aimObjectives: [],
    classPlan: null, // ✅ Updated to store full classPlan object
    loading: false,
    errorMessage: null,
    successMessage: null,
  },
  reducers: {
    clearTCurriculumError: (state) => {
      state.errorMessage = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Syllabus Fetch
      .addCase(fetchTeacherSyllabus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabus = action.payload;
      })
      .addCase(fetchTeacherSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // ✅ Syllabus Create/Update
      .addCase(createOrUpdateSyllabus.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrUpdateSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Syllabus saved successfully';
      })
      .addCase(createOrUpdateSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // ✅ Class Plan Create
      .addCase(createClassPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClassPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Class plan created successfully';
      })
      .addCase(createClassPlan.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // ✅ Aim Objectives Fetch
      .addCase(fetchAimObjectives.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAimObjectives.fulfilled, (state, action) => {
        state.loading = false;
        state.aimObjectives = action.payload;
      })
      .addCase(fetchAimObjectives.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // ✅ Class Plans Fetch (updated)
      .addCase(fetchTeacherClassPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherClassPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.classPlan = action.payload;
      })
      .addCase(fetchTeacherClassPlans.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearTCurriculumError, clearSuccessMessage } = tcurriculumSlice.actions;
export default tcurriculumSlice.reducer;
