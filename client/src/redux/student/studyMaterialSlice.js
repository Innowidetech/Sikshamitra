// redux/studyMaterialSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch study materials
export const fetchStudyMaterials = createAsyncThunk(
  "studyMaterial/fetchStudyMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Or however you're storing token
      const response = await axios.get(
        "https://sikshamitra.onrender.com/api/student/studyMaterial",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

const studyMaterialSlice = createSlice({
  name: "studyMaterial",
  initialState: {
    studyMaterials: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudyMaterials.fulfilled, (state, action) => {
        state.studyMaterials = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudyMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studyMaterialSlice.reducer;
