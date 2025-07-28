import { configureStore } from '@reduxjs/toolkit';

import aboutSliceReducer from './teacher/aboutSlice';
import accountReducer from './accountSlice';
import admitCardSliceReducer from './student/admitCardSlice';
import adminClassesReducer from './adminClasses';
import adminConnectQueriesReducer from './adminConnectQueriesSlice';
import adminCurriculumReducer from './curriculum';
import adminEmployeeReducer from './adminEmployee';
import adminFeesReducer from './adminfees';
import adminProfileReducer from './adminProfileSlice';
import adminResultsReducer from './adminResults';
import admissionsReducer from './admission';
import assignmentSliceReducer from './student/assignmentSlice';
import assignmentsReducer from './teacher/assignmentsSlice';
import authReducer from './authSlice';
import bookReducer from './student/bookSlice';
import classPlanSliceReducer from './student/classPlanSlice';
import connectQueriesReducer from './student/connectQueriesSlice';
import createExamSliceReducer from './teacher/createExamSlice';
import createMeetingReducer from './teacher/createMeetingSlice';
import curriculumReducer from './parent/curriculumSlice';
import dashboardReducer from './dashboard';
import examReducer from './parent/examSlice';
import examSliceReducer from './student/examSlice';
import expensesReducer from './parent/expensesSlice';
import feesReducer from './parent/feesSlice';
import inventoryReducer from './adminInventory';
import lectureSlice from './teacher/lectureSlice';
import libraryReducer from './librarySlice';
import meetingReducer from './parent/meetingSlice';
import myStudentsReducer from './teacher/myStudentsSlice';
import parentDashboardReducer from './parent/parentdashboardSlice';
import parentProfileSliceReducer from './parent/parentProfileSlice';
import parentsReducer from './parentSlice';
import pkidsReducer from './parent/pkidsSlice';
import ptransportationReducer from './parent/ptransportationSlice';
import queryReducer from './parent/querySlice';
import resultSliceReducer from './student/resultSlice';
import resultsReducer from './parent/results';
import staffDashboardReducer from './staff/staffDashboardSlice';
import stransportationReducer from './student/stransportationSlice';
import studentDashboardReducer from './student/studashboardSlice';
import studentProfileReducer from './student/studentProfileSlice';
import studentsReducer from './studentsSlice';
import studyMaterialReducer from './student/studyMaterialSlice';
import studyMSliceReducer from './teacher/studyMSlice'; // Renamed for clarity
import syllabusSliceReducer from './student/syllabusSlice';
import syllabusViewSliceReducer from './student/syllabusViewSlice';
import tcurriculumSliceReducer from './teacher/tcurriculumSlice';
import teaAttendanceReducer from './teacher/teaAttendanceSlice';
import teacherDashboardReducer from './teacher/teacherDashboardSlice';
import teacherQueryReducer from './teacher/teacherQuerySlice';
import teacherResultsReducer from './teacher/teacherResultSlice';
import teachersReducer from './teachersSlice';
import timeTableSliceReducer from './student/timeTableSlice';
import transReducer from './transSlice';
import transportationReducer from './driver/transportationSlice';
import entranceReducer from './users/entranceSlice'; // ✅ Update this path if needed
import adminEntranceReducer from './adminEntranceSlice';


const store = configureStore({
  reducer: {
    about: aboutSliceReducer,
    accounts: accountReducer,
    admitCard: admitCardSliceReducer,
    adminClasses: adminClassesReducer,
    adminConnectQueries: adminConnectQueriesReducer,
    adminCurriculum: adminCurriculumReducer,
    adminEmployee: adminEmployeeReducer,
    adminFees: adminFeesReducer,
    adminProfile: adminProfileReducer,
    adminResults: adminResultsReducer,
    admissions: admissionsReducer,
    assignment: assignmentSliceReducer,
    assignments: assignmentsReducer,
    auth: authReducer,
    book: bookReducer,
    classPlan: classPlanSliceReducer,
    connectQueries: connectQueriesReducer,
    createExam: createExamSliceReducer,
    createmeeting: createMeetingReducer,
    curriculum: curriculumReducer,
    dashboard: dashboardReducer,
    exam: examSliceReducer,
    exams: examReducer,
    expenses: expensesReducer,
    fees: feesReducer,
    inventory: inventoryReducer,
    lecture: lectureSlice,
    library: libraryReducer,
    meeting: meetingReducer,
    myStudents: myStudentsReducer,
    parent: parentDashboardReducer,
    parentProfile: parentProfileSliceReducer,
    parents: parentsReducer,
    pkids: pkidsReducer,
    ptransportation: ptransportationReducer,
    query: queryReducer,
    results: resultSliceReducer,
    ParentResults: resultsReducer,
    staffDashboard: staffDashboardReducer,
    stransportation: stransportationReducer,
    studentDashboard: studentDashboardReducer,
    studentProfile: studentProfileReducer,
    students: studentsReducer,
    studyMaterial: studyMaterialReducer,
    studyMaterialTeacher: studyMSliceReducer,
    syllabus: syllabusSliceReducer,
    syllabusView: syllabusViewSliceReducer,
    tcurriculum: tcurriculumSliceReducer,
    teaAttendance: teaAttendanceReducer,
    teacherDashboard: teacherDashboardReducer,
    teacherQuery: teacherQueryReducer,
    teacherResults: teacherResultsReducer,
    teachers: teachersReducer,
    timeTable: timeTableSliceReducer,
    trans: transReducer,
    transportation: transportationReducer,
    entrance: entranceReducer,
    adminEntrance: adminEntranceReducer,
  },
});

export default store;
