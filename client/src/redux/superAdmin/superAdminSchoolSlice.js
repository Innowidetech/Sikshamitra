import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch schools
export const fetchAllSchools = createAsyncThunk(
    "superAdmin/fetchAllSchools",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://sikshamitra.onrender.com/api/superadmin/schools",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.schools;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Fetch failed");
        }
    }
);

// Register new school
export const registerSchool = createAsyncThunk(
    "superAdmin/registerSchool",
    async (schoolData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/register",
                schoolData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to register school"
            );
        }
    }
);

// Update school status
export const updateSchoolStatus = createAsyncThunk(
    "superAdmin/updateSchoolStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const apiUrl = `https://sikshamitra.onrender.com/api/superAdmin/school/${id}/${status}`;

            console.log('=== API CALL DETAILS ===');
            console.log('API URL:', apiUrl);
            console.log('School ID being sent:', id);
            console.log('Status being sent:', status);

            const response = await axios.put(
                apiUrl,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('=== API RESPONSE ===');
            console.log('Response:', response.data);

            // Return the id from the request (not response) and the status
            return { id: id, status: status };
        } catch (error) {
            console.error('=== API ERROR ===');
            console.error('Error:', error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Failed to update status"
            );
        }
    }
);

const superAdminSchoolSlice = createSlice({
    name: "superAdminSchools",
    initialState: {
        schools: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearSchoolStatus: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSchools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSchools.fulfilled, (state, action) => {
                state.loading = false;
                state.schools = action.payload;
            })
            .addCase(fetchAllSchools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerSchool.pending, (state) => {
                state.loading = true;
                state.successMessage = null;
                state.error = null;
            })
            .addCase(registerSchool.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(registerSchool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fixed updateSchoolStatus cases
            .addCase(updateSchoolStatus.pending, (state) => {
                // Don't set loading to true for status updates to avoid UI flickering
                state.error = null;
            })
            .addCase(updateSchoolStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                console.log('Redux: Updating school', id, 'to status', status);
                console.log('Redux: Current schools count:', state.schools.length);

                // Find the school by _id (not id) since that's what's in the schools array
                const updatedSchools = state.schools.map((school) => {
                    console.log('Redux: Checking school._id:', school._id, 'against id:', id);
                    if (school._id === id) {
                        console.log('Redux: Found matching school, updating status from', school.status, 'to', status);
                        return { ...school, status };
                    }
                    return school;
                });

                state.schools = updatedSchools;
                console.log('Redux: Updated schools array');
            })
            .addCase(updateSchoolStatus.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearSchoolStatus } = superAdminSchoolSlice.actions;
export default superAdminSchoolSlice.reducer;