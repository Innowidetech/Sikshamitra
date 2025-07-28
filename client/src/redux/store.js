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
import studyMSliceReducer from './teacher/studyMSlice';
import syllabusSliceReducer from './student/syllabusSlice';
import syllabusViewSliceReducer from './student/syllabusViewSlice';
import tcurriculumSliceReducer from './teacher/tcurriculumSlice';
import teaAttendanceReducer from './teacher/teaAttendanceSlice';
import teacherDashboardReducer from './teacher/teacherDashboardSlice';

import superAdminStaffDashboardSliceReducer from './superAdminStaff/superAdminStaffDashboardSlice';
import superAdminStaffSendQueryReducer from './superAdminStaff/superAdminStaffQuerySlice';
import superAdminQueryReplayReducer from './superAdminStaff/superAdminStaffQueryReplaySlice';
import superAdminStaffBlogSliceReducer from './superAdminStaff/superAdminStaffBlogSlice';
import superAdminStaffSendQueryIdReplayReducer from './superAdminStaff/superAdminStaffReplayIdSlice';
import superAdminStaffPostReplyReducer from './superAdminStaff/superAdminStaffReplayIdPostSlice';
import blogReducer from "./superAdminStaff/superAdminStaffCreateBlogSlice";

import superAdminReducer from './superAdmin/superAdminDashboard';
import superAdminSchoolReducer from "./superAdmin/superAdminSchoolSlice";
import superAdminAccountsSliceReducer from './superAdmin/superAdminAccountsSlice';
import superAdminStaffReducer from './superAdmin/superAdminStaffSlice';
import superAdminTaskReducer from './superAdmin/superAdminTaskSlice';
import superAdminUserBlogReducer from './superAdmin/SuperAdminBlogSclice';
import superAdminConnectAndQueryReducer from './superAdmin/superAdminConnectSlice';

import teacherQueryReducer from './teacher/teacherQuerySlice';
import teacherResultsReducer from './teacher/teacherResultSlice';
import teachersReducer from './teachersSlice';
import timeTableSliceReducer from './student/timeTableSlice';
import transReducer from './transSlice';
import transportationReducer from './driver/transportationSlice';
import entranceReducer from './users/entranceSlice';
import adminEntranceReducer from './adminEntranceSlice';

const store = configureStore({
  reducer: {
    about: aboutSliceReducer,
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
    fees: feesReducer,
    accounts: accountReducer,
    admitCard: admitCardSliceReducer,
    // adminClasses: adminClassesReducer, // Duplicate
    // adminConnectQueries: adminConnectQueriesReducer, // Duplicate
    // adminCurriculum: adminCurriculumReducer, // Duplicate
    // adminEmployee: adminEmployeeReducer, // Duplicate
    // adminFees: adminFeesReducer, // Duplicate
    // adminProfile: adminProfileReducer, // Duplicate
    // adminResults: adminResultsReducer, // Duplicate
    // admissions: admissionsReducer, // Duplicate
    assignment: assignmentSliceReducer,
    assignments: assignmentsReducer,
    // auth: authReducer, // Duplicate
    book: bookReducer,
    classPlan: classPlanSliceReducer,
    connectQueries: connectQueriesReducer,
    createExam: createExamSliceReducer,
    createmeeting: createMeetingReducer,
    curriculum: curriculumReducer,
    // dashboard: dashboardReducer, // Duplicate
    // exam: examSliceReducer, // Duplicate
    // exams: examReducer, // Duplicate
    expenses: expensesReducer,
    // fees: feesReducer, // Duplicate
    // inventory: inventoryReducer, // Duplicate
    lecture: lectureSlice,
    // library: libraryReducer, // Duplicate
    meeting: meetingReducer,
    myStudents: myStudentsReducer,
    parent: parentDashboardReducer,
    parentProfile: parentProfileSliceReducer,
    // parents: parentsReducer, // Duplicate
    // pkids: pkidsReducer, // Duplicate
    ptransportation: ptransportationReducer,
    query: queryReducer,
    results: resultSliceReducer,
    // ParentResults: resultsReducer, // Duplicate
    staffDashboard: staffDashboardReducer,
    stransportation: stransportationReducer,
    // studentDashboard: studentDashboardReducer, // Duplicate
    // studentProfile: studentProfileReducer, // Duplicate
    // students: studentsReducer, // Duplicate
    studyMaterial: studyMaterialReducer,
    studyMaterialTeacher: studyMSliceReducer,
    syllabus: syllabusSliceReducer,
    syllabusView: syllabusViewSliceReducer,
    // classPlan: classPlanSliceReducer, // Duplicate
    // results: resultSliceReducer, // Duplicate
    // about: aboutSliceReducer, // Duplicate
    // createExam: createExamSliceReducer, // Duplicate
    // studyMaterial: studyMSliceReducer, // Duplicate
    // myStudents: myStudentsReducer, // Duplicate
    // assignments: assignmentsReducer, // Duplicate
    tcurriculum: tcurriculumSliceReducer,
    teaAttendance: teaAttendanceReducer,
    teacherDashboard: teacherDashboardReducer,
    // staffDashboard: staffDashboardReducer, // Duplicate
    superAdminStaffDashboard: superAdminStaffDashboardSliceReducer,
    superAdminStaffSendQuery: superAdminStaffSendQueryReducer,
    superAdminStaffSendQueryReplay: superAdminQueryReplayReducer,
    superAdminStaffBlog: superAdminStaffBlogSliceReducer,
    superAdminStaffSendQueryIdReplay: superAdminStaffSendQueryIdReplayReducer,
    superAdminStaffPostReply: superAdminStaffPostReplyReducer,
    blogData: blogReducer,
    superAdminDashboard: superAdminReducer,
    superAdminSchools: superAdminSchoolReducer,
    superAdminAccounts: superAdminAccountsSliceReducer,
    superAdminStaff: superAdminStaffReducer,
    superAdminTasks: superAdminTaskReducer,
    superAdminUserBlogs: superAdminUserBlogReducer,
    connectAndQuery: superAdminConnectAndQueryReducer,
    teacherQuery: teacherQueryReducer,
    teacherResults: teacherResultsReducer,
    timeTable: timeTableSliceReducer,
    trans: transReducer,
    transportation: transportationReducer,
    entrance: entranceReducer,
    adminEntrance: adminEntranceReducer,
  },
});

export default store;
