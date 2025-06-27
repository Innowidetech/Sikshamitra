// src/redux/librarySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetching all book requests
export const fetchLibraryRequests = createAsyncThunk(
  "library/fetchLibraryRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "https://sikshamitra.onrender.com/api/admin/library",
        config
      );

      return response.data.bookRequestsWithParents;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch"
      );
    }
  }
);

// Updating a book request
export const updateBookRequest = createAsyncThunk(
  "library/updateBookRequest",
  async ({ requestId, status, dueOn, returnedOn, fine }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const body = { status };

      // Handle 'issued' status
      if (status === "issued") {
        if (!dueOn) return rejectWithValue("Due date is required for issued status");
        body.dueOn = dueOn;
      }

      // Handle 'returned' status
      if (status === "returned") {
        if (!returnedOn) return rejectWithValue("Returned date is required");
        if (!dueOn) return rejectWithValue("Due date is required for return status");

        const dueDate = new Date(dueOn);
        const returnDate = new Date(returnedOn);

        body.returnedOn = returnedOn;
        body.dueOn = dueOn;

        if (returnDate > dueDate) {
          if (!fine && fine !== 0) {
            return rejectWithValue("Fine is required if return is late");
          }
          body.fine = fine;
        } else {
          body.fine = 0;
        }
      }

      await axios.patch(
        `https://sikshamitra.onrender.com/api/admin/bookRequest/${requestId}`,
        body,
        config
      );

      return { requestId, status, dueOn, returnedOn, fine };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update"
      );
    }
  }
);

// Redux slice
const librarySlice = createSlice({
  name: "library",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    updateStatus: "idle",
    updateError: null,
  },
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibraryRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLibraryRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBookRequest.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateBookRequest.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.requests.findIndex(
          (r) => r._id === action.payload.requestId
        );
        if (index !== -1) {
          const updated = state.requests[index];
          state.requests[index] = {
            ...updated,
            status: action.payload.status,
            dueOn: action.payload.dueOn ?? updated.dueOn,
            returnedOn: action.payload.returnedOn ?? updated.returnedOn,
            fine: action.payload.fine ?? updated.fine,
          };
        }
      })
      .addCase(updateBookRequest.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      });
  },
});

export const { clearUpdateStatus } = librarySlice.actions;
export default librarySlice.reducer;
