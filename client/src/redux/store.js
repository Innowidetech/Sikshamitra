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
import expensesReducer from './parent/expensesSlice'
import queryReducer from './parent/querySlice'
import curriculumReducer from './parent/curriculumSlice'

import timeTableSliceReducer from './student/timeTableSlice';
import studyMaterialReducer from './student/studyMaterialSlice';
import admitCardSliceReducer from './student/admitCardSlice';
import assignmentSliceReducer from './student/assignmentSlice';
import syllabusSliceReducer from './student/syllabusSlice';
import syllabusViewSliceReducer from './student/syllabusViewSlice';
import classPlanSliceReducer from './student/classPlanSlice';
import resultSliceReducer from './student/resultSlice';

import aboutSliceReducer from './teacher/aboutSlice'
import createExamSliceReducer from './teacher/createExamSlice'
import studyMSliceReducer from './teacher/studyMSlice';
<<<<<<< HEAD

import myStudentsReducer from './teacher/myStudentsSlice';
import assignmentsReducer from './teacher/assignmentsSlice';
=======
import myStudentsReducer from './teacher/myStudentsSlice';
import assignmentsReducer from './teacher/assignmentsSlice';
import tcurriculumSliceReducer from './teacher/tcurriculumSlice';
import lectureSliceReducer from './teacher/lectureSlice';
<<<<<<< HEAD
import teacherResultsReducer from './teacher/teacherResultSlice';
import teaAttendanceReducer from './teacher/teaAttendanceSlice';
=======
=======
>>>>>>> f8a2267d0a703a300841997028d2fe806658056e
>>>>>>> ac66aadf8697680500167b4cb6f6b3cc2af9bb4d
>>>>>>> a240f7af96d09c64d317daf573d717b7b507fed9

import tcurriculumSliceReducer from './teacher/tcurriculumSlice';
import lectureSliceReducer from './teacher/lectureSlice';



>>>>>>> 1de4beed18f1fb1f1ac6684736bfe840150be634


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

    expenses:expensesReducer,
    query: queryReducer,
    curriculum: curriculumReducer,
    timeTable: timeTableSliceReducer,
    studyMaterial: studyMaterialReducer,
    admitCard : admitCardSliceReducer,
    assignment : assignmentSliceReducer,
    syllabus : syllabusSliceReducer,
    syllabusView : syllabusViewSliceReducer,
    classPlan : classPlanSliceReducer,
    results : resultSliceReducer,
   
    about : aboutSliceReducer,
    createExam :createExamSliceReducer,
    studyMaterial : studyMSliceReducer,

<<<<<<< HEAD
    myStudents: myStudentsReducer,
    assignments: assignmentsReducer,
    tcurriculum: tcurriculumSliceReducer, 
    lecture: lectureSliceReducer,

=======
    students: myStudentsReducer,
    assignments: assignmentsReducer,
    

    tcurriculum: tcurriculumSliceReducer, 

   
    lecture: lectureSliceReducer,
    teacherResults: teacherResultsReducer,
    teacherAttendance: teaAttendanceReducer,


<<<<<<< HEAD
=======
=======
>>>>>>> f8a2267d0a703a300841997028d2fe806658056e
>>>>>>> d1a30a44b7a750e63246ebf5b0cfdfbabb002274
>>>>>>> ac66aadf8697680500167b4cb6f6b3cc2af9bb4d
>>>>>>> a240f7af96d09c64d317daf573d717b7b507fed9
>>>>>>> 1de4beed18f1fb1f1ac6684736bfe840150be634
    

  },
});

export default store;  