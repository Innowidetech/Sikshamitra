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
      setSelectedStudent(students[0]); // Set default student if available
    }
  }, [students]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mx-10">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">My Kids</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">My Kids</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      <div className="bg-[#285A87] h-[100px] xl:h-[120px] lg:max-w-3xl xl:max-w-5xl xl:mx-auto rounded-tl-lg rounded-tr-lg">
        <div className="flex gap-6 mt-8 mx-10 items-center pt-16">
          {students.length > 0 ? (
            students.map((student, index) => (
              <div
                key={student.studentId}
                onClick={() => setSelectedStudent(student)}
                className="cursor-pointer text-center"
              >
                <div
                  className={`w-24 h-24 rounded-full bg-[#FF9F1C] overflow-hidden border-4 p-2 ${selectedStudent?.studentId === student.studentId
                      ? "border-white scale-110 "
                      : "border-transparent"
                    }`}
                >
                  <img
                    src={student.studentProfile.photo} // Make sure 'photo' exists
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-full h-full object-fill rounded-full"
                  />
                </div>
                <h3
                  className={`mt-2 font-bold lg:text-xl ${selectedStudent?.studentId === student.studentId
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

      {/* Student Details Card */}
      {selectedStudent && (
        <div className="flex justify-between mt-28 mb-10 mx-10">
          {/* Left Card Section (Student Profile) */}
          <div className="w-full lg:w-1/2">
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
                    {selectedStudent && parentData?.parentProfile?.fatherPhoneNumber
                      ? parentData.parentProfile.fatherPhoneNumber // Use fatherPhoneNumber or motherPhoneNumber based on preference
                      : "Phone number not available"}
                  </span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Gender:</span>
                  <span>{selectedStudent.studentProfile.gender}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">DOB:</span>
                  <span>{new Date (selectedStudent.studentProfile.dob). toLocaleDateString()}</span>
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

          {/* Right Section (Previous Education Details) */}
          <div className="pl-10 w-full lg:w-1/2">
            <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87] mb-5">
              Previous Education Details:
            </h4>
            <div className="text-sm text-[#666666]">
              {selectedStudent.studentProfile.previousEducation &&
                selectedStudent.studentProfile.previousEducation.map((edu, index) => (
                  <p key={index} className="flex">
                    <span className="text-[#285A87] text-lg">{edu.schoolName} -</span>
                    <span className="text-[#285A87] text-lg ml-6">{edu.range}</span>
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Kids;
