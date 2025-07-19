// src/redux/admin/adminProfileSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// === Thunk: Fetch Admin Profile ===
export const fetchAdminProfile = createAsyncThunk(
  'adminProfile/fetchProfile',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/getProfile',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

// === Thunk: Edit Admin Profile ===
export const editAdminProfile = createAsyncThunk(
  'adminProfile/editProfile',
  async ({ token, profileData }, thunkAPI) => {
    try {
      const formData = new FormData();

      for (const key in profileData) {
        if (['authority', 'paymentDetails', 'contact', 'details'].includes(key)) {
          formData.append(key, JSON.stringify(profileData[key]));
        } else if (key !== 'schoolLogo' && key !== 'schoolBanner') {
          if (profileData[key] !== undefined && profileData[key] !== null) {
            formData.append(key, profileData[key]);
          }
        }
      }

      if (profileData.schoolLogo instanceof File) {
        formData.append('schoolLogo', profileData.schoolLogo);
      }

      if (profileData.schoolBanner instanceof File) {
        formData.append('schoolBanner', profileData.schoolBanner);
      }

      const response = await axios.put(
        'https://sikshamitra.onrender.com/api/admin/edit',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// === Thunk: Fetch Teacher Names ===
export const fetchTeacherNames = createAsyncThunk(
  'adminProfile/fetchTeacherNames',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/admin/teacherNames',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.teachers;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch teacher names'
      );
    }
  }
);

// === Thunk: Add or Update Authority Details ===
export const updateAuthorityDetails = createAsyncThunk(
  'adminProfile/updateAuthorityDetails',
  async ({ token, actionType, employeeType, teacherName, oldTeacher }, thunkAPI) => {
    try {
      const payload = {
        action: actionType, // 'add' or 'update'
        employeeType,       // 'accountant', 'librarian', etc.
        teacherName,        // selected teacher name from dropdown
      };

      if (actionType === 'update') {
        payload.oldTeacher = oldTeacher;
      }

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/authorityb',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update authority details'
      );
    }
  }
);

// === Thunk: Add or Update Authority Login Details ===
export const updateAuthorityLoginDetails = createAsyncThunk(
  'adminProfile/updateAuthorityLoginDetails',
  async ({ token, email, passwordIs, employeeType }, thunkAPI) => {
    try {
      const payload = {
        email,         // ✅ Correct key
        passwordIs,    // ✅ Correct key
        employeeType,  // ✅ Keep as is, value must be exact e.g. 'admissionsManager'
      };

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/admin/authorityAccess',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update authority login details'
      );
    }
  }
);


// === Slice ===
const adminProfileSlice = createSlice({
  name: 'adminProfile',
  initialState: {
    loading: false,
    profile: null,
    error: null,

    updateLoading: false,
    updateError: null,

    teacherNames: [],
    teacherLoading: false,
    teacherError: null,

    authorityLoading: false,
    authorityError: null,
    authoritySuccess: null,
  },
  reducers: {
    resetAdminProfile: (state) => {
      state.loading = false;
      state.profile = null;
      state.error = null;

      state.updateLoading = false;
      state.updateError = null;

      state.teacherLoading = false;
      state.teacherError = null;
      state.teacherNames = [];

      state.authorityLoading = false;
      state.authorityError = null;
      state.authoritySuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === Fetch Profile ===
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Edit Profile ===
      .addCase(editAdminProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(editAdminProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
      })
      .addCase(editAdminProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // === Fetch Teacher Names ===
      .addCase(fetchTeacherNames.pending, (state) => {
        state.teacherLoading = true;
        state.teacherError = null;
      })
      .addCase(fetchTeacherNames.fulfilled, (state, action) => {
        state.teacherLoading = false;
        state.teacherNames = action.payload;
      })
      .addCase(fetchTeacherNames.rejected, (state, action) => {
        state.teacherLoading = false;
        state.teacherError = action.payload;
      })

      // === Add / Update Authority ===
      .addCase(updateAuthorityDetails.pending, (state) => {
        state.authorityLoading = true;
        state.authorityError = null;
        state.authoritySuccess = null;
      })
      .addCase(updateAuthorityDetails.fulfilled, (state, action) => {
        state.authorityLoading = false;
        state.authoritySuccess = action.payload;
      })
      .addCase(updateAuthorityDetails.rejected, (state, action) => {
        state.authorityLoading = false;
        state.authorityError = action.payload;
      })
      // === Add / Update Authority Login Details ===
.addCase(updateAuthorityLoginDetails.pending, (state) => {
  state.authorityLoading = true;
  state.authorityError = null;
  state.authoritySuccess = null;
})
.addCase(updateAuthorityLoginDetails.fulfilled, (state, action) => {
  state.authorityLoading = false;
  state.authoritySuccess = action.payload;
})
.addCase(updateAuthorityLoginDetails.rejected, (state, action) => {
  state.authorityLoading = false;
  state.authorityError = action.payload;
});

  },
});

export const { resetAdminProfile } = adminProfileSlice.actions;
export default adminProfileSlice.reducer;
