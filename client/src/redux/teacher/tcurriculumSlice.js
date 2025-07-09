import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Fetch Teacher Syllabus by className
export const fetchTeacherSyllabus = createAsyncThunk(
  'tcurriculum/fetchTeacherSyllabus',
  async (className = '', { rejectWithValue }) => {
    try {
      let url = `https://sikshamitra.onrender.com/api/teacher/syllabus`;
      if (className) {
        url += `/${className}`;
      }

      const res = await fetch(url, {
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

// Fetch Classes and Sections for syllabus and class plans
export const fetchClassesAndSections = createAsyncThunk(
  'tcurriculum/fetchClassesAndSections',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://sikshamitra.onrender.com/api/teacher/get', {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch classes and sections');
      const data = await res.json();
      return data; // Expecting data contains classes and sections info
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create or Update Syllabus
// Uncomment and modify if needed
// export const createOrUpdateSyllabus = createAsyncThunk(
//   'tcurriculum/createOrUpdateSyllabus',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const res = await fetch('https://sikshamitra.onrender.com/api/teacher/syllabus', {
//         method: 'POST',
//         headers: {
//           ...getAuthHeaders(),
//         },
//         body: formData,
//       });
//       if (!res.ok) throw new Error('Failed to submit syllabus');
//       const data = await res.json();
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// Create Class Plan
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
      return data.classPlan;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update Class Plan
export const updateClassPlan = createAsyncThunk(
  'tcurriculum/updateClassPlan',
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
      if (!res.ok) throw new Error('Failed to update class plan');
      const data = await res.json();
      return data.classPlan;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch Aim Objectives
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

// Fetch Class Plans with Filters
export const fetchTeacherClassPlans = createAsyncThunk(
  'tcurriculum/fetchTeacherClassPlans',
  async ({ className, section }, { rejectWithValue }) => {
    try {
      let url = 'https://sikshamitra.onrender.com/api/teacher/classPlan';
      if (className && section) {
        url += `/${className}/${section}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error("No class plan found for the specified class and section.");
      const data = await res.json();
      return data.classPlan;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice Definition
const tcurriculumSlice = createSlice({
  name: 'tcurriculum',
  initialState: {
    syllabus: { syllabus: [] }, // syllabus API response shape
    aimObjectives: [],
    classPlan: null,
    classesAndSections: null, // store classes and sections info here
    loading: false,
    errorMessage: null,
    successMessage: null,
    filters: {
      className: '',
      section: '',
    },
  },
  reducers: {
    clearTCurriculumError: (state) => {
      state.errorMessage = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTeacherSyllabus
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

      // createOrUpdateSyllabus
      // Uncomment and handle if using createOrUpdateSyllabus
      // .addCase(createOrUpdateSyllabus.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(createOrUpdateSyllabus.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.successMessage = action.payload.message || 'Syllabus saved successfully';
      // })
      // .addCase(createOrUpdateSyllabus.rejected, (state, action) => {
      //   state.loading = false;
      //   state.errorMessage = action.payload;
      // })

      // createClassPlan
      .addCase(createClassPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClassPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.classPlan = action.payload;
        state.successMessage = 'Class plan created successfully';
      })
      .addCase(createClassPlan.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // updateClassPlan
      .addCase(updateClassPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClassPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.classPlan = action.payload;
        state.successMessage = 'Class plan updated successfully';
      })
      .addCase(updateClassPlan.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // fetchAimObjectives
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

      // fetchTeacherClassPlans
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
      })

      // fetchClassesAndSections
      .addCase(fetchClassesAndSections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassesAndSections.fulfilled, (state, action) => {
        state.loading = false;
        state.classesAndSections = action.payload;
      })
      .addCase(fetchClassesAndSections.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearTCurriculumError, clearSuccessMessage, setFilters } = tcurriculumSlice.actions;
export default tcurriculumSlice.reducer;
