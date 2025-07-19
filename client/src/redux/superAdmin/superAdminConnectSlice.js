import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


export const fetchConnectMeetings = createAsyncThunk(
    "superAdmin/fetchConnectMeetings",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://sikshamitra.onrender.com/api/superadmin/connect", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.connects;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch meetings");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchSuperAdminQueries = createAsyncThunk(
    "superAdmin/fetchSuperAdminQueries",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://sikshamitra.onrender.com/api/superadmin/query", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                queriesReceived: res.data.queriesReceived,
                queriesSent: res.data.queriesSent,
            };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch queries");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchSchoolNames = createAsyncThunk(
    "superAdmin/fetchSchoolNames",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://sikshamitra.onrender.com/api/superadmin/schools", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Extract only names from the school data
            const schoolNames = res.data.schools.map((school) => school.schoolName);
            return schoolNames;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch school names");
            return rejectWithValue(error.response?.data);
        }
    }
);
export const postSuperAdminQuery = createAsyncThunk(
    "superAdmin/postSuperAdminQuery",
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/query",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Query posted successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post query");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const createMeeting = createAsyncThunk(
    "superAdmin/createMeeting",
    async (meetingData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "https://sikshamitra.onrender.com/api/superadmin/connect",
                meetingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Meeting created successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create meeting");
            return rejectWithValue(error.response?.data);
        }
    }
);
// === INITIAL STATE ===

const initialState = {
    meetings: [],
    queriesReceived: [],
    queriesSent: [],
    schoolNames: [],
    loading: false,
    postQueryLoading: false,
    postQuerySuccess: false,
    error: null,
};

// === SLICE ===

const superAdminConnectAndQuerySlice = createSlice({
    name: "superAdminConnectAndQuery",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Connect Meetings
            .addCase(fetchConnectMeetings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConnectMeetings.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload;
            })
            .addCase(fetchConnectMeetings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error fetching meetings";
            })

            // Queries (Received + Sent)
            .addCase(fetchSuperAdminQueries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminQueries.fulfilled, (state, action) => {
                state.loading = false;
                state.queriesReceived = action.payload.queriesReceived;
                state.queriesSent = action.payload.queriesSent;
            })
            .addCase(fetchSuperAdminQueries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error fetching queries";
            }).addCase(fetchSchoolNames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchoolNames.fulfilled, (state, action) => {
                state.loading = false;
                state.schoolNames = action.payload;
            })
            .addCase(fetchSchoolNames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error fetching school names";
            })// Post Query
            .addCase(postSuperAdminQuery.pending, (state) => {
                state.postQueryLoading = true;
                state.postQuerySuccess = false;
                state.error = null;
            })
            .addCase(postSuperAdminQuery.fulfilled, (state) => {
                state.postQueryLoading = false;
                state.postQuerySuccess = true;
            })
            .addCase(postSuperAdminQuery.rejected, (state, action) => {
                state.postQueryLoading = false;
                state.postQuerySuccess = false;
                state.error = action.payload || "Error posting query";
            }).addCase(createMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings.push(action.payload.createdMeeting); // <-- adjust key if different
            })
            .addCase(createMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error creating meeting";
            });
    },
});

export default superAdminConnectAndQuerySlice.reducer;
