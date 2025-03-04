import React, { useEffect } from "react";
import Header from "./layout/Header";
import { Search } from "lucide-react";
import Calendar from '../adminDashboard/Calendar';
import { GraduationCap, SplitSquareVertical, UserCheck, User, Phone } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setSelectedStudent } from '../../redux/parent/pkidsSlice';

function ParentDashboard() {
  const dispatch = useDispatch();
  const { profile, selectedStudent, status, error } = useSelector((state) => state.pkids);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardData());
    }
  }, [status, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleStudentChange = (studentData) => {
    dispatch(setSelectedStudent(studentData));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const circumference = 100;
  const percentage = selectedStudent?.sumOfPresentAndLatePercentage || 0;
  const dashLength = (parseFloat(percentage) / 100) * circumference;

  return (
    <>
      <div className="flex justify-between items-center mx-8 overflow-x-hidden">
        <div className="flex justify-between items-center py-6 px-8">
          <h1 className="text-xl font-bold text-[#1982C4] xl:text-[36px]" style={{ fontFamily: "Poppins" }}>
            Dashboard
          </h1>
        </div>
        <div className="relative flex items-center space-x-6">
          <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 text-[#146192] w-5 h-5" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#1982C4]/20 md:w-40 lg:w-64 shadow-[4px_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Student Images Section */}
      <div className="flex justify-center gap-6 mb-8 mx-8">
        {profile?.students?.map((studentData) => (
          <div
            key={studentData.studentId}
            onClick={() => handleStudentChange(studentData)}
            className={`relative cursor-pointer group transition-all duration-300`}
          >
            <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-300 ${
              selectedStudent?.studentId === studentData.studentId
                ? 'border-[#1982C4] scale-110 shadow-lg'
                : 'border-transparent hover:border-[#1982C4]/50'
            }`}>
              <img
                src={studentData.student.studentProfile.photo}
                alt={`${studentData.student.studentProfile.firstName} ${studentData.student.studentProfile.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`mt-2 text-center transition-all duration-300 ${
              selectedStudent?.studentId === studentData.studentId
                ? 'text-[#1982C4] font-semibold'
                : 'text-gray-600'
            }`}>
              <p className="text-sm">{studentData.student.studentProfile.firstName}</p>
              <p className="text-sm">{studentData.student.studentProfile.lastName}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="md:flex md:justify-between md:mx-8 px-8 overflow-x-hidden md:gap-4">
        <div className="grid">
          <div className="grid space-y-6 mb-6 xl:w-[600px]">
            {/* Attendance Report Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="lg:flex items-start gap-8">
                <div className="relative w-32 h-32 mb-4 lg:mb-0">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E8F3F9"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1982C4"
                      strokeWidth="3"
                      strokeDasharray={`${dashLength}, ${circumference}`}
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-2xl font-bold text-[#1982C4]">
                      {selectedStudent?.sumOfPresentAndLatePercentage || '0'}%
                    </span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div className="p-1 lg:p-2 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs lg:text-sm">Total days</span>
                    </div>
                    <span className="text-2xl font-medium text-[#5FE33E]">
                      {selectedStudent?.totalDays || 0}
                    </span>
                  </div>
                  <div className="p-1 lg:p-2 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs lg:text-sm">Absent days</span>
                    </div>
                    <span className="text-2xl font-medium text-[#EC6767]">
                      {selectedStudent?.counts?.Absent || 0}
                    </span>
                  </div>
                  <div className="p-1 lg:p-2 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs lg:text-sm">Present days</span>
                    </div>
                    <span className="text-2xl font-medium text-[#5DD9D4]">
                      {selectedStudent?.counts?.Present || 0}
                    </span>
                  </div>
                  <div className="p-1 lg:p-2 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs lg:text-sm">Sick Leave</span>
                    </div>
                    <span className="text-2xl font-medium text-[#37778f]">
                      {selectedStudent?.counts?.Sickleave || 0}
                    </span>
                  </div>
                  <div className="p-1 lg:p-2 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs lg:text-sm">Late</span>
                    </div>
                    <span className="text-2xl font-medium text-[#FF05C8]">
                      {selectedStudent?.counts?.Late || 0}
                    </span>
                  </div>
                  <div className="p-1 lg:p-2 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs lg:text-sm">Holiday</span>
                    </div>
                    <span className="text-2xl font-medium text-[#f0b968f4]">
                      {selectedStudent?.counts?.Holiday || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notices Section */}
            <div className="space-y-4 border shadow-lg rounded-md p-4">
              <h1 className="xl:text-[20px] font-medium" style={{ fontFamily: 'Poppins' }}>Notices</h1>
              {selectedStudent?.notices?.length > 0 ? (
                selectedStudent.notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="border-b border-gray-500 rounded-sm p-4 hover:shadow-md transition-shadow xl:w-[500px]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{notice.title}</h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(notice.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notice.noticeMessage}</p>
                    <p className="text-xs text-gray-500 italic">{notice.createdByText}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No notices available at the moment
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid xl:w-[450px]">
          <div className="border mb-6 rounded-md p-4">
            {selectedStudent && (
              <div className="space-y-4">
                <div className="grid items-center justify-center">
                  <img
                    src={selectedStudent.student.studentProfile.photo}
                    alt={`${selectedStudent.student.studentProfile.firstName} ${selectedStudent.student.studentProfile.lastName}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-center">
                      {selectedStudent.student.studentProfile.firstName} {selectedStudent.student.studentProfile.lastName}
                    </h2>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#1982C4]" />
                      <p className="text-sm text-gray-600">Class</p>
                    </div>
                    <p className="font-medium">{selectedStudent.student.studentProfile.class || '-'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SplitSquareVertical className="w-5 h-5 text-[#1982C4]" />
                      <p className="text-sm text-gray-600">Section</p>
                    </div>
                    <p className="font-medium">{selectedStudent.student.studentProfile.section || '-'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-[#1982C4]" />
                      <p className="text-sm text-gray-600">Attendance</p>
                    </div>
                    <p className="font-medium">{selectedStudent.percentages?.Present || '0'}%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#1982C4]" />
                      <p className="text-sm text-gray-600">Parent Name</p>
                    </div>
                    <p className="font-medium">{profile?.parentData?.parentProfile?.fatherName || '-'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#1982C4]" />
                      <p className="text-sm text-gray-600">Parent Number</p>
                    </div>
                    <p className="font-medium">{profile?.parentData?.parentProfile?.fatherPhoneNumber || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
}

export default ParentDashboard;