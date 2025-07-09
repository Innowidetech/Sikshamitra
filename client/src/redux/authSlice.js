import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  user: null,
  userId:localStorage.getItem('userId'),
  token: localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole'),
  employeeType: localStorage.getItem('employeeType'),
  isLoading: false,
  error: null,
};

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(base64Payload));
    return decodedPayload;
  } catch (error) {
    return {};
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/auth/login',
        credentials
      );

      const { token, user } = response.data;

      if (token) {
        const decoded = decodeToken(token);
        const employeeType = decoded.employeeType || null;

        localStorage.setItem('token', token);
        localStorage.setItem('userRole', credentials.role);
       localStorage.setItem('userId', user._id); // ✅

        if (employeeType) {
          localStorage.setItem('employeeType', employeeType);
        } else {
          localStorage.removeItem('employeeType');
        }

        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 2000,
        });

       return {
  token,
  role: credentials.role,
  user,
  userId: user._id, // ✅ ADD THIS
  employeeType,
};

      }

      return rejectWithValue('No token received');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', {
        position: 'top-right',
        autoClose: 2000,
      });
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('https://sikshamitra.onrender.com/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('employeeType');
      toast.success('Logged out successfully', {
        position: 'top-right',
        autoClose: 2000,
      });
      return null;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('employeeType');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.role;
         state.userId = action.payload.userId; 
        state.employeeType = action.payload.employeeType;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.userRole = null;
        state.employeeType = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.userRole = null;
        state.employeeType = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
