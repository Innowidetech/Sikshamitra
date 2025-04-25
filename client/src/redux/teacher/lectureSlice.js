import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Replace this with actual token management logic
const getToken = () => localStorage.getItem('token');

// Async thunk to fetch timetable (GET)
export const fetchLectureTimetable = createAsyncThunk(
  'lecture/fetchLectureTimetable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/timetable',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data; // API response contains teacherTimetable and classTimetable
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch timetable'
      );
    }
  }
);

// Async thunk to create or update timetable (POST)
export const createOrUpdateLectureTimetable = createAsyncThunk(
  'lecture/createOrUpdateLectureTimetable',
  async (timetableData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/timetable', // POST request to create or update the timetable
        timetableData, // This should contain the timetable data (e.g., day, timeSlots, etc.)
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data; // API response with success or the updated timetable
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create/update timetable'
      );
    }
  }
);

// Async thunk to upload the timetable file (e.g., PDF)
export const uploadLectureTimetableFile = createAsyncThunk(
  'lecture/uploadLectureTimetableFile',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file); // Append the file to the form data

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/upload-timetable', // API endpoint for file upload
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data', // This is important for file upload
          },
        }
      );
      return response.data; // Response should contain success info or the uploaded file info
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload timetable file'
      );
    }
  }
);

const lectureSlice = createSlice({
  name: 'lecture',
  initialState: {
    loading: false,
    data: {}, // Holds the teacherTimetable and classTimetable
    error: null,
    fileUpload: { loading: false, error: null, success: false }, // Track file upload state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching timetable (GET)
      .addCase(fetchLectureTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLectureTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store fetched timetable data
      })
      .addCase(fetchLectureTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle creating/updating timetable (POST)
      .addCase(createOrUpdateLectureTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateLectureTimetable.fulfilled, (state, action) => {
        state.loading = false;
        // Update the timetable data with the new or updated timetable
        state.data = action.payload; // Or handle based on the API response (e.g., show a success message)
      })
      .addCase(createOrUpdateLectureTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle uploading timetable file (file upload)
      .addCase(uploadLectureTimetableFile.pending, (state) => {
        state.fileUpload.loading = true;
        state.fileUpload.error = null;
        state.fileUpload.success = false;
      })
      .addCase(uploadLectureTimetableFile.fulfilled, (state, action) => {
        state.fileUpload.loading = false;
        state.fileUpload.success = true;
        // Optionally, add uploaded file info to the state if needed
        state.data.uploadedFile = action.payload; // Store uploaded file info if needed
      })
      .addCase(uploadLectureTimetableFile.rejected, (state, action) => {
        state.fileUpload.loading = false;
        state.fileUpload.error = action.payload;
      });
  },
});

export default lectureSlice.reducer;


