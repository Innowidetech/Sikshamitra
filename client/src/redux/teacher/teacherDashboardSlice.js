import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// === DASHBOARD ===
export const fetchTeacherDashboard = createAsyncThunk(
  'teacherDashboard/fetch',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

// === NOTICES ===
export const fetchTeacherNotices = createAsyncThunk(
  'teacherDashboard/fetchNotices',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/notice', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notices');
    }
  }
);

export const createTeacherNotice = createAsyncThunk(
  'teacherDashboard/createNotice',
  async ({ token, noticeData }, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/notice',
        noticeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error creating notice');
    }
  }
);

export const editTeacherNotice = createAsyncThunk(
  'teacherDashboard/editNotice',
  async ({ token, noticeId, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/teacher/notice/${noticeId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error editing notice');
    }
  }
);

export const deleteTeacherNotice = createAsyncThunk(
  'teacherDashboard/deleteTeacherNotice',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://sikshamitra.onrender.com/api/teacher/notice/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the notice');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateTeacherNotice = createAsyncThunk(
  'teacherDashboard/updateNotice',
  async ({ token, id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/teacher/notice/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update notice');
    }
  }
);

// === CALENDAR ===
export const fetchTeacherCalendar = createAsyncThunk(
  'teacherDashboard/fetchCalendar',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/calendar', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar');
    }
  }
);

export const fetchTeacherCalendarByDate = createAsyncThunk(
  'teacherDashboard/fetchCalendarByDate',
  async ({ token, calendarDate }, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://sikshamitra.onrender.com/api/teacher/calendar/${calendarDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar by date');
    }
  }
);

export const createTeacherCalendarEvent = createAsyncThunk(
  'teacher/createCalendarEvent',
  async ({ token, calendarData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/calendar',
        calendarData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Server error');
    }
  }
);
// === EDIT CALENDAR EVENT ===
export const editTeacherCalendarEvent = createAsyncThunk(
  'teacher/editCalendarEvent',
  async ({ token, calendarId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://sikshamitra.onrender.com/api/teacher/calendar/${calendarId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to edit calendar event');
    }
  }
);

export const deleteTeacherCalendarEvent = createAsyncThunk(
  'teacher/deleteCalendarEvent',
  async ({ token, calendarId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://sikshamitra.onrender.com/api/teacher/calendar/${calendarId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the calendar event');
      }

      return calendarId; // Return the deleted calendarId
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchTeacherClassAccounts = createAsyncThunk(
  'teacherDashboard/fetchClassAccounts',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get('https://sikshamitra.onrender.com/api/teacher/classAccounts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch class accounts');
    }
  }
);

export const fetchTeacherRequests = createAsyncThunk(
  'teacherDashboard/fetchTeacherRequests',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        'https://sikshamitra.onrender.com/api/teacher/requests',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch teacher requests'
      );
    }
  }
);

export const createTeacherRequest = createAsyncThunk(
  'teacherDashboard/createTeacherRequest',
  async ({ token, requestData }, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/teacher/classRequest',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to submit request');
    }
  }
);




// === SLICE ===
const teacherDashboardSlice = createSlice({
  name: 'teacherDashboard',
  initialState: {
    dashboardData: null,
    loading: false,
    error: null,

    notices: [],
    noticesLoading: false,
    noticesError: null,
    createNoticeLoading: false,
    createNoticeError: null,
    createNoticeSuccess: false,
    editNoticeLoading: false,
    editNoticeError: null,
    editNoticeSuccess: false,
    deleteNoticeLoading: false,
    deleteNoticeError: null,
    updateNoticeLoading: false,
    updateNoticeError: null,
    updateNoticeSuccess: false,

    calendarData: [],
    calendarLoading: false,
    calendarError: null,

    calendarByDate: null,
    calendarByDateLoading: false,
    calendarByDateError: null,

    createCalendarLoading: false,
    createCalendarError: null,
    createCalendarSuccess: false,

    editCalendarLoading: false,
    editCalendarError: null,
    editCalendarSuccess: false,
    editCalendarMessage: '', // New state for success message

    deleteCalendarLoading: false,
deleteCalendarError: null,

 classAccounts: [],
    classAccountsLoading: false,
    classAccountsError: null,

     teacherRequests: [],
    teacherRequestsLoading: false,
    teacherRequestsError: null,

    createRequestLoading: false,
createRequestError: null,
createRequestSuccess: false,


    
  },

  reducers: {
    clearCreateNoticeStatus: (state) => {
      state.createNoticeLoading = false;
      state.createNoticeError = null;
      state.createNoticeSuccess = false;
    },
    clearEditNoticeStatus: (state) => {
      state.editNoticeLoading = false;
      state.editNoticeError = null;
      state.editNoticeSuccess = false;
    },
    clearDeleteNoticeStatus: (state) => {
      state.deleteNoticeLoading = false;
      state.deleteNoticeError = null;
    },
    clearUpdateNoticeStatus: (state) => {
      state.updateNoticeLoading = false;
      state.updateNoticeError = null;
      state.updateNoticeSuccess = false;
    },
    clearCreateCalendarStatus: (state) => {
      state.createCalendarLoading = false;
      state.createCalendarError = null;
      state.createCalendarSuccess = false;
    },
     clearEditCalendarStatus: (state) => {
      state.editCalendarLoading = false;
      state.editCalendarError = null;
      state.editCalendarSuccess = false;
      state.editCalendarMessage = ''; // Reset the message after the action is cleared
    },
    setEditCalendarMessage: (state, action) => {
      state.editCalendarMessage = action.payload; // Set the success message
    },
    clearDeleteCalendarStatus: (state) => {
  state.deleteCalendarLoading = false;
  state.deleteCalendarError = null;
},
 clearClassAccountsStatus: (state) => {
      state.classAccountsLoading = false;
      state.classAccountsError = null;
    },

    clearCreateRequestStatus: (state) => {
  state.createRequestLoading = false;
  state.createRequestError = null;
  state.createRequestSuccess = false;
},



  },

  extraReducers: (builder) => {
    builder
      // === Dashboard ===
      .addCase(fetchTeacherDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchTeacherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Notices ===
      .addCase(fetchTeacherNotices.pending, (state) => {
        state.noticesLoading = true;
        state.noticesError = null;
      })
      .addCase(fetchTeacherNotices.fulfilled, (state, action) => {
        state.noticesLoading = false;
        state.notices = action.payload;
      })
      .addCase(fetchTeacherNotices.rejected, (state, action) => {
        state.noticesLoading = false;
        state.noticesError = action.payload;
      })

      .addCase(createTeacherNotice.pending, (state) => {
        state.createNoticeLoading = true;
        state.createNoticeError = null;
        state.createNoticeSuccess = false;
      })
      .addCase(createTeacherNotice.fulfilled, (state, action) => {
        state.createNoticeLoading = false;
        state.createNoticeSuccess = true;
        if (action.payload?.notice) {
          state.notices.unshift(action.payload.notice);
        }
      })
      .addCase(createTeacherNotice.rejected, (state, action) => {
        state.createNoticeLoading = false;
        state.createNoticeError = action.payload;
      })

      .addCase(editTeacherNotice.pending, (state) => {
        state.editNoticeLoading = true;
        state.editNoticeError = null;
        state.editNoticeSuccess = false;
      })
      .addCase(editTeacherNotice.fulfilled, (state, action) => {
        state.editNoticeLoading = false;
        state.editNoticeSuccess = true;
        const updated = action.payload.notice;
        const index = state.notices.findIndex((n) => n._id === updated._id);
        if (index !== -1) {
          state.notices[index] = updated;
        }
      })
      .addCase(editTeacherNotice.rejected, (state, action) => {
        state.editNoticeLoading = false;
        state.editNoticeError = action.payload;
      })

      .addCase(deleteTeacherNotice.pending, (state) => {
        state.deleteNoticeLoading = true;
        state.deleteNoticeError = null;
      })
      .addCase(deleteTeacherNotice.fulfilled, (state, action) => {
        state.deleteNoticeLoading = false;
        state.notices = state.notices.filter((n) => n._id !== action.payload);
      })
      .addCase(deleteTeacherNotice.rejected, (state, action) => {
        state.deleteNoticeLoading = false;
        state.deleteNoticeError = action.payload;
      })

      .addCase(updateTeacherNotice.pending, (state) => {
        state.updateNoticeLoading = true;
        state.updateNoticeError = null;
        state.updateNoticeSuccess = false;
      })
      .addCase(updateTeacherNotice.fulfilled, (state, action) => {
        state.updateNoticeLoading = false;
        state.updateNoticeSuccess = true;
        const updated = action.payload.notice;
        const index = state.notices.findIndex((n) => n._id === updated._id);
        if (index !== -1) {
          state.notices[index] = updated;
        }
      })
      .addCase(updateTeacherNotice.rejected, (state, action) => {
        state.updateNoticeLoading = false;
        state.updateNoticeError = action.payload;
      })

      // === Calendar ===
      .addCase(fetchTeacherCalendar.pending, (state) => {
        state.calendarLoading = true;
        state.calendarError = null;
      })
      .addCase(fetchTeacherCalendar.fulfilled, (state, action) => {
        state.calendarLoading = false;
        state.calendarData = action.payload;
      })
      .addCase(fetchTeacherCalendar.rejected, (state, action) => {
        state.calendarLoading = false;
        state.calendarError = action.payload;
      })

      .addCase(fetchTeacherCalendarByDate.pending, (state) => {
        state.calendarByDateLoading = true;
        state.calendarByDateError = null;
      })
      .addCase(fetchTeacherCalendarByDate.fulfilled, (state, action) => {
        state.calendarByDateLoading = false;
        state.calendarByDate = action.payload;
      })
      .addCase(fetchTeacherCalendarByDate.rejected, (state, action) => {
        state.calendarByDateLoading = false;
        state.calendarByDateError = action.payload;
      })

      // === Create Calendar Event ===
      .addCase(createTeacherCalendarEvent.pending, (state) => {
        state.createCalendarLoading = true;
        state.createCalendarError = null;
        state.createCalendarSuccess = false;
      })
      .addCase(createTeacherCalendarEvent.fulfilled, (state, action) => {
        state.createCalendarLoading = false;
        state.createCalendarSuccess = true;
        // Optionally add the new event to calendarData array if returned
        if (action.payload?.calendar) {
          state.calendarData.push(action.payload.calendar);
        }
      })
      .addCase(createTeacherCalendarEvent.rejected, (state, action) => {
        state.createCalendarLoading = false;
        state.createCalendarError = action.payload;
      })
       // === Edit Calendar Event ===
      .addCase(editTeacherCalendarEvent.pending, (state) => {
        state.editCalendarLoading = true;
        state.editCalendarError = null;
        state.editCalendarSuccess = false;
        state.editCalendarMessage = ''; // Reset the message while pending
      })
      .addCase(editTeacherCalendarEvent.fulfilled, (state, action) => {
      const updatedEvent = action.payload;
      const index = state.calendarData.calendars.findIndex(
        (event) => event._id === updatedEvent._id
      );
      if (index !== -1) {
        state.calendarData.calendars[index] = updatedEvent;
      }

        // Set success message
        state.editCalendarMessage = 'Event updated successfully!';
      })
      .addCase(editTeacherCalendarEvent.rejected, (state, action) => {
        state.editCalendarLoading = false;
        state.editCalendarError = action.payload;
      })
      .addCase(deleteTeacherCalendarEvent.pending, (state) => {
  state.deleteCalendarLoading = true;
  state.deleteCalendarError = null;
})
.addCase(deleteTeacherCalendarEvent.fulfilled, (state, action) => {
  state.deleteCalendarLoading = false;
  const deletedId = action.payload;

  // Remove the deleted calendar event from calendarData array
  if (Array.isArray(state.calendarData)) {
    state.calendarData = state.calendarData.filter((event) => event._id !== deletedId);
  } else if (state.calendarData?.calendars) {
    state.calendarData.calendars = state.calendarData.calendars.filter(
      (event) => event._id !== deletedId
    );
  }
})
.addCase(deleteTeacherCalendarEvent.rejected, (state, action) => {
  state.deleteCalendarLoading = false;
  state.deleteCalendarError = action.payload;
})

   .addCase(fetchTeacherClassAccounts.pending, (state) => {
        state.classAccountsLoading = true;
        state.classAccountsError = null;
      })
      .addCase(fetchTeacherClassAccounts.fulfilled, (state, action) => {
        state.classAccountsLoading = false;
        state.classAccounts = action.payload; // Store class accounts data
      })
      .addCase(fetchTeacherClassAccounts.rejected, (state, action) => {
        state.classAccountsLoading = false;
        state.classAccountsError = action.payload;
      })

       .addCase(fetchTeacherRequests.pending, (state) => {
        state.teacherRequestsLoading = true;
        state.teacherRequestsError = null;
      })
      .addCase(fetchTeacherRequests.fulfilled, (state, action) => {
        state.teacherRequestsLoading = false;
        state.teacherRequests = action.payload;
      })
      .addCase(fetchTeacherRequests.rejected, (state, action) => {
        state.teacherRequestsLoading = false;
        state.teacherRequestsError = action.payload;
      })

      .addCase(createTeacherRequest.pending, (state) => {
  state.createRequestLoading = true;
  state.createRequestError = null;
  state.createRequestSuccess = false;
})
.addCase(createTeacherRequest.fulfilled, (state, action) => {
  state.createRequestLoading = false;
  state.createRequestSuccess = true;
  state.teacherRequests.unshift(action.payload); // Fix: Add directly
})

.addCase(createTeacherRequest.rejected, (state, action) => {
  state.createRequestLoading = false;
  state.createRequestError = action.payload;
});


  },
});

export const {
  clearCreateNoticeStatus,
  clearEditNoticeStatus,
  clearDeleteNoticeStatus,
  clearUpdateNoticeStatus,
  clearCreateCalendarStatus,
   clearEditCalendarStatus, // ✅ Add this
  setEditCalendarMessage, // ✅ Add this
  clearDeleteCalendarStatus,
  clearClassAccountsStatus,
  clearRequestsStatus,
  clearCreateRequestStatus,


} = teacherDashboardSlice.actions;

export default teacherDashboardSlice.reducer;
