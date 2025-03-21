import { configureStore } from '@reduxjs/toolkit';
import teachersReducer from './teachersSlice';
import studentsReducer from './studentsSlice';
import parentsReducer from './parentSlice';
import admissionsReducer from './admission';
import pkidsReducer from './parent/pkidsSlice';
import resultsReducer from './parent/results';
import examReducer from './parent/examSlice';
import studentDashboardReducer from './student/studashboardSlice';
import dashboardReducer from './dashboard';
import adminProfileReducer from './adminprofile';
import authReducer from './authSlice';
import adminFeesReducer from './adminfees';


const store = configureStore({
  reducer: {
    teachers: teachersReducer,
    students: studentsReducer,
    parents: parentsReducer,
    admissions: admissionsReducer,
    pkids: pkidsReducer,
    ParentResults: resultsReducer,
    exams:examReducer,
    studentDashboard: studentDashboardReducer,
    dashboard: dashboardReducer,
    adminProfile: adminProfileReducer,
    auth: authReducer,
    adminFees: adminFeesReducer,
  },
});

export default store;