import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch study materials
export const fetchStudyMaterials = createAsyncThunk(
  'studyMaterial/fetchStudyMaterials',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/studyMaterial', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // We are returning both teacherMaterial and classMaterial
      return {
        teacherMaterial: response.data.teacherMaterial,
        classMaterial: response.data.classMaterial
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch study materials');
    }
  }
);

// Create study material
export const createStudyMaterial = createAsyncThunk(
  'studyMaterial/createStudyMaterial',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/studyMaterial',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.newMaterial;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create study material');
    }
  }
);

// Delete study material
export const deleteStudyMaterial = createAsyncThunk(
  'studyMaterial/deleteStudyMaterial',
  async (materialId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://sikshamitra.onrender.com/api/teacher/studyMaterial/${materialId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return materialId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete study material');
    }
  }
);

const studyMSlice = createSlice({
  name: 'studyMaterial',
  initialState: {
    teacherMaterial: [],
    classMaterial: [],
    loading: false,
    error: null,
    createStatus: null,
  },
  reducers: {
    clearStudyMaterials: (state) => {
      state.teacherMaterial = [];
      state.classMaterial = [];
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudyMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherMaterial = action.payload.teacherMaterial;
        state.classMaterial = action.payload.classMaterial;
      })
      .addCase(fetchStudyMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStudyMaterial.pending, (state) => {
        state.createStatus = 'pending';
        state.error = null;
      })
      .addCase(createStudyMaterial.fulfilled, (state, action) => {
        state.createStatus = 'success';
        state.teacherMaterial.push(action.payload);
      })
      .addCase(createStudyMaterial.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteStudyMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudyMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherMaterial = state.teacherMaterial.filter(
          (material) => material._id !== action.payload
        );
      })
      .addCase(deleteStudyMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudyMaterials, resetCreateStatus } = studyMSlice.actions;
export default studyMSlice.reducer;
