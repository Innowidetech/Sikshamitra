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
import inventoryReducer from './adminInventory';
import libraryReducer from './librarySlice';
import adminClassesReducer from './adminClasses';
import adminEmployeeReducer from './adminEmployee';
import adminResultsReducer from './adminResults';
import adminCurriculumReducer from './curriculum';
import studentProfileReducer from './student/studentProfileSlice';
import examSliceReducer from './student/examSlice';
import parentdashboardReducer from './parent/parentdashboardSlice'; // Parent Dashboard Slice
import feesReducer from './parent/feesSlice';
<<<<<<< HEAD
import expensesReducer from './parent/expensesSlice'
import queryReducer from './parent/querySlice'
import curriculumReducer from './parent/curriculumSlice'
=======
import timeTableSliceReducer from './student/timeTableSlice';
import studyMaterialReducer from './student/studyMaterialSlice';
import admitCardSliceReducer from './student/admitCardSlice';
import assignmentSliceReducer from './student/assignmentSlice';
import syllabusSliceReducer from './student/syllabusSlice';
import syllabusViewSliceReducer from './student/syllabusViewSlice';
import classPlanSliceReducer from './student/classPlanSlice';
import resultSliceReducer from './student/resultSlice';
>>>>>>> f91a1abe8496bc10630c29759b94b5fe9ddcb972

const store = configureStore({
  reducer: {
    teachers: teachersReducer,
    students: studentsReducer,
    parents: parentsReducer,
    admissions: admissionsReducer,
    pkids: pkidsReducer,
    ParentResults: resultsReducer,
    exams: examReducer,
    studentDashboard: studentDashboardReducer,
    dashboard: dashboardReducer,
    adminProfile: adminProfileReducer,
    auth: authReducer,
    adminFees: adminFeesReducer,
    inventory: inventoryReducer,
    library: libraryReducer,
    adminClasses: adminClassesReducer,
    adminEmployee: adminEmployeeReducer,
    adminResults: adminResultsReducer,
    adminCurriculum: adminCurriculumReducer,
    studentProfile: studentProfileReducer,
    exam: examSliceReducer,
    parent: parentdashboardReducer, // Add parentdashboardReducer here
    fees : feesReducer,
<<<<<<< HEAD
    expenses:expensesReducer,
    query: queryReducer,
    curriculum: curriculumReducer,
=======
    timeTable: timeTableSliceReducer,
    studyMaterial: studyMaterialReducer,
    admitCard : admitCardSliceReducer,
    assignment : assignmentSliceReducer,
    syllabus : syllabusSliceReducer,
    syllabusView : syllabusViewSliceReducer,
    classPlan : classPlanSliceReducer,
    results : resultSliceReducer,
   
   
>>>>>>> f91a1abe8496bc10630c29759b94b5fe9ddcb972

  },
});

export default store;
