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
import adminProfileReducer from './adminProfileSlice';
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
import parentdashboardReducer from './parent/parentdashboardSlice';
import feesReducer from './parent/feesSlice';
import expensesReducer from './parent/expensesSlice';
import queryReducer from './parent/querySlice';
import curriculumReducer from './parent/curriculumSlice';
import accountReducer from './accountSlice';

import timeTableSliceReducer from './student/timeTableSlice';
import studyMaterialReducer from './student/studyMaterialSlice';
import admitCardSliceReducer from './student/admitCardSlice';
import assignmentSliceReducer from './student/assignmentSlice';
import syllabusSliceReducer from './student/syllabusSlice';
import syllabusViewSliceReducer from './student/syllabusViewSlice';
import classPlanSliceReducer from './student/classPlanSlice';
import resultSliceReducer from './student/resultSlice';

import aboutSliceReducer from './teacher/aboutSlice';
import createExamSliceReducer from './teacher/createExamSlice';
import studyMSliceReducer from './teacher/studyMSlice';
import assignmentsReducer from './teacher/assignmentsSlice';
import myStudentsReducer from './teacher/myStudentsSlice';
import tcurriculumSliceReducer from './teacher/tcurriculumSlice';
import lectureSlice from './teacher/lectureSlice';
import teacherResultsReducer from './teacher/teacherResultSlice';
import teaAttendanceReducer from './teacher/teaAttendanceSlice';
import teacherDashboardReducer from './teacher/teacherDashboardSlice';
import bookReducer from './student/bookSlice';
import connectQueriesReducer from './student/connectQueriesSlice';

import parentProfileSliceReducer from './parent/parentProfileSlice';
import ptransportationReducer from './parent/ptransportationSlice';
import staffDashboardReducer from './staff/staffDashboardSlice';
import superAdminStaffDashboardSliceReducer from './superAdminStaff/superAdminStaffDashboardSlice';
import superAdminStaffSendQueryReducer from './superAdminStaff/superAdminStaffQuerySlice';
import superAdminQueryReplayReducer from './superAdminStaff/superAdminStaffQueryReplaySlice'
import superAdminStaffBlogSliceReducer from './superAdminStaff/superAdminStaffBlogSlice'
import superAdminStaffSendQueryIdReplayReducer from './superAdminStaff/superAdminStaffReplayIdSlice'
import superAdminStaffPostReplyReducer from './superAdminStaff/superAdminStaffReplayIdPostSlice'
import blogReducer from "./superAdminStaff/superAdminStaffCreateBlogSlice";

import superAdminReducer from './superAdmin/superAdminDashboard';
import superAdminSchoolReducer from "./superAdmin/superAdminSchoolSlice";
import superAdminAccountsSliceReducer from './superAdmin/superAdminAccountsSlice';
import superAdminStaffReducer from './superAdmin/superAdminStaffSlice';
import superAdminTaskReducer from './superAdmin/superAdminTaskSlice';
import superAdminUserBlogReducer from './superAdmin/SuperAdminBlogSclice';
import superAdminConnectAndQueryReducer from './superAdmin/superAdminConnectSlice';
import adminConnectQueriesReducer from './adminConnectQueriesSlice';
import meetingReducer from './parent/meetingSlice';
import teacherQueryReducer from './teacher/teacherQuerySlice';
import createMeetingReducer from './teacher/createMeetingSlice';
import transReducer from './transSlice';
import stransportationReducer from './student/stransportationSlice';

import transportationReducer from './driver/transportationSlice';

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
    fees: feesReducer,
    accounts: accountReducer,
    expenses: expensesReducer,
    query: queryReducer,
    curriculum: curriculumReducer,
    timeTable: timeTableSliceReducer,
    studyMaterial: studyMaterialReducer,
    admitCard: admitCardSliceReducer,
    assignment: assignmentSliceReducer,
    syllabus: syllabusSliceReducer,
    syllabusView: syllabusViewSliceReducer,
    classPlan: classPlanSliceReducer,
    results: resultSliceReducer,
    about: aboutSliceReducer,
    createExam: createExamSliceReducer,
    studyMaterial: studyMSliceReducer,
    myStudents: myStudentsReducer,
    parentProfile: parentProfileSliceReducer,


    // myStudents: myStudentsReducer,

    assignments: assignmentsReducer,
    tcurriculum: tcurriculumSliceReducer,
    lecture: lectureSlice,
    teacherResults: teacherResultsReducer,
    teaAttendance: teaAttendanceReducer,
    teacherDashboard: teacherDashboardReducer,
    book: bookReducer,

    staffDashboard: staffDashboardReducer,

    // Super Admin Staff Dashboard
    superAdminStaffDashboard: superAdminStaffDashboardSliceReducer,

    // Super Admin Staff Query
    superAdminStaffSendQuery: superAdminStaffSendQueryReducer,
    // Super Admin Staff Query
    superAdminStaffSendQueryReplay: superAdminQueryReplayReducer,
    // super Admin Staff Blog
    superAdminStaffBlog: superAdminStaffBlogSliceReducer,
    //  super Admin Staff for id replay
    superAdminStaffSendQueryIdReplay: superAdminStaffSendQueryIdReplayReducer,
    //  super Admin Staff for id replay
    superAdminStaffPostReply: superAdminStaffPostReplyReducer,
    blogData: blogReducer,

    // Super Admin Dashboard
    superAdminDashboard: superAdminReducer,
    superAdminSchools: superAdminSchoolReducer,
    superAdminAccounts: superAdminAccountsSliceReducer,
    superAdminStaff: superAdminStaffReducer,
    superAdminTasks: superAdminTaskReducer,
    superAdminUserBlogs: superAdminUserBlogReducer,
    connectAndQuery: superAdminConnectAndQueryReducer,
      book: bookReducer,
    connectQueries: connectQueriesReducer,
    staffDashboard: staffDashboardReducer,
    adminConnectQueries: adminConnectQueriesReducer,
    meeting: meetingReducer,
    teacherQuery: teacherQueryReducer,
    createmeeting: createMeetingReducer,
    transportation: transReducer,
    stransportation: stransportationReducer,
  },
});

export default store;
