import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../redux/parent/pkidsSlice";

function Kids() {
  const dispatch = useDispatch();
  const { parentData, students, status, error } = useSelector((state) => state.pkids);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (students.length > 0) {
      setSelectedStudent(students[0]);
    }
  }, [students]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mx-4 lg:mx-10 gap-4 mt-20">
        <div className="md:ml-64">
          <h1 className="text-2xl font-light text-black xl:text-[38px]">My Kids</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}{" "}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">My Kids</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Student Selector Strip */}
      <div className="bg-[#285A87] h-[100px] xl:h-[120px] max-w-5xl md:ml-72 rounded-tl-lg rounded-tr-lg">
        <div className="flex gap-6 mt-8 mx-4 md:mx-10 items-center pt-16 overflow-x-auto pb-4">
          {students.length > 0 ? (
            students.map((student, index) => (
              <div
                key={student.studentId}
                onClick={() => setSelectedStudent(student)}
                className="cursor-pointer text-center min-w-[100px]"
              >
                <div
                  className={`w-24 h-24 rounded-full bg-[#FF9F1C] overflow-hidden border-4 p-2 ${
                    selectedStudent?.studentId === student.studentId
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={student.studentProfile.photo}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-full h-full object-fill rounded-full"
                  />
                </div>
                <h3
                  className={`mt-2 font-bold lg:text-xl ${
                    selectedStudent?.studentId === student.studentId
                      ? "text-[#146192]"
                      : "text-gray-600"
                  }`}
                >
                  {student.studentProfile.fullname}
                </h3>
                <p className="text-sm text-[#A098AE]">
                  Student {String(index + 1).padStart(2, "0")}
                </p>
              </div>
            ))
          ) : (
            <div>No students found</div>
          )}
        </div>
      </div>

      {/* Student Info Section */}
      {selectedStudent && (
        <div className="flex flex-col lg:flex-row justify-between gap-8 mt-28 mb-10 mx-4 lg:mx-10">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 md:ml-64">
            <div className="bg-gradient-to-r from-[#bad8ec] to-[#f8e3b7] shadow-lg rounded-lg p-6 border border-[#DBDBDB]">
              <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87] p-6">
                Personal Details
              </h4>
              <div className="text-sm text-[#666666]">
                <p className="flex justify-between py-1">
                  <span className="text-[#285A87] text-lg">Name:</span>
                  <span>{selectedStudent.studentProfile.fullname}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Email:</span>
                  <span>{selectedStudent.userId.email}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Phone:</span>
                  <span>
                    {parentData?.parentProfile?.fatherPhoneNumber || "Phone number not available"}
                  </span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Gender:</span>
                  <span>{selectedStudent.studentProfile.gender}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">DOB:</span>
                  <span>
                    {new Date(selectedStudent.studentProfile.dob).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Address:</span>
                  <span>{selectedStudent.studentProfile.address}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Class:</span>
                  <span>{selectedStudent.studentProfile.class}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Section:</span>
                  <span>{selectedStudent.studentProfile.section}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2">
            {/* Previous Education */}
            <h4 className="text-xl font-semibold text-[#285A87] mb-2 border-b-2 border-[#285A87] w-fit">
              Previous Education Details
            </h4>
            <div className="text-lg text-[#285A87] space-y-2 mt-4">
              {selectedStudent?.studentProfile?.previousEducation?.map((edu, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-xl leading-5">•</span>
                  <p className="flex gap-2 flex-wrap">
                    <span>{edu.schoolName}</span>
                    <span>–</span>
                    <span>{edu.study}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Student Info */}
            <h4 className="text-xl font-semibold text-[#285A87] mt-6 mb-2 border-b-2 border-[#285A87] w-fit">
              Student Details
            </h4>
            <div className="text-lg text-[#285A87] space-y-3 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-xl leading-5">•</span>
                <p className="flex gap-2">
                  <span>Registration No:</span>
                  <span>–</span>
                  <span>{selectedStudent.studentProfile.registrationNumber}</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl leading-5">•</span>
                <p className="flex gap-2">
                  <span>Joining Date</span>
                  <span>–</span>
                  <span>
                    {new Date(selectedStudent.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Kids;
