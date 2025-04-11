import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchClassPlan = createAsyncThunk(
  "classPlan/fetchClassPlan",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(
        "https://sikshamitra.onrender.com/api/student/classPlan",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.classPlan?.plan || [];
    } catch (error) {
      console.error("Error fetching class plan:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const classPlanSlice = createSlice({
  name: "classPlan",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClassPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch class plan";
      });
  },
});

export default classPlanSlice.reducer;
