import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../redux/parent/pkidsSlice"; // Assuming fetchDashboardData exists
import { MapPin, Phone, Mail, GraduationCap, SplitSquareVertical } from "lucide-react";

function Kids() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.pkids);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Predefined student information for two students
  const predefinedStudents = [
    {
      studentId: 1,
      studentProfile: {
        photo: "https://example.com/student1.jpg", // Your original image URL for student 1
        firstName: "John",
        lastName: "Doe",
      },
      email: "john.doe@email.com",
      phone: "123-456-7890",
      gender: "Male",
      dob: "2005-05-15",
      address: "1234 Elm Street",
      previousEducation: {
        schoolName: "XYZ School (1)",
      },
    },
    {
      studentId: 2,
      studentProfile: {
        photo: "https://example.com/student2.jpg", // Your original image URL for student 2
        firstName: "Jane",
        lastName: "Smith",
      },
      email: "jane.smith@email.com",
      phone: "234-567-8901",
      gender: "Female",
      dob: "2004-07-20",
      address: "5678 Maple Avenue",
      previousEducation: {
        schoolName: "ABC School (2)",
      },
    },
  ];

  // Set the first student by default
  useEffect(() => {
    if (predefinedStudents?.length > 0) {
      setSelectedStudent(predefinedStudents[0]);
    }
  }, []);

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
          {predefinedStudents.map((student, index) => (
            <div
              key={student.studentId}
              onClick={() => setSelectedStudent(student)}
              className="cursor-pointer text-center"
            >
              <div
                className={`w-24 h-24 rounded-full bg-[#FF9F1C] overflow-hidden border-4 p-2 ${
                  selectedStudent?.studentId === student.studentId
                    ? "border-white scale-110 "
                    : "border-transparent"
                }`}
              >
                <img
                  src={student.studentProfile.photo}
                  alt={`${student.studentProfile.firstName} ${student.studentProfile.lastName}`}
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
                {student.studentProfile.firstName} {student.studentProfile.lastName}
              </h3>
              <p className="text-sm text-[#A098AE]">
                Student {String(index + 1).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Details Card */}
      {selectedStudent && (
        <div className="flex justify-between mt-32 mx-10">
          {/* Left Card Section (Student Profile) */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-r from-[#bad8ec] to-[#f8e3b7] shadow-lg rounded-lg p-6 border border-[#DBDBDB]">
              <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87] p-6">
                Personal Details
              </h4>
              <div className="text-sm text-[#666666]">
                <p className="flex justify-between py-1">
                  <span className="text-[#285A87] text-lg">Name:</span>
                  <span>{selectedStudent.studentProfile.firstName} {selectedStudent.studentProfile.lastName}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Email:</span>
                  <span>{selectedStudent.email}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Phone:</span>
                  <span>{selectedStudent.phone}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Gender:</span>
                  <span>{selectedStudent.gender}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">DOB:</span>
                  <span>{selectedStudent.dob}</span>
                </p>
                <p className="flex justify-between py-1">
                  <span className="text-lg text-[#285A87]">Address:</span>
                  <span>{selectedStudent.address}</span>
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
              {/* School Name with Range from 1 to 9 */}
              <p className="flex ">
                <span className="text-[#285A87] text-lg">Vidya Arts And Science School-</span>
                <span className="text-[#285A87] text-lg ml-6">From 1 to 9</span>
              </p>
              <p className="flex ">
                <span className="text-[#285A87] text-lg">Vidya Arts And Science School-</span>
                <span className="text-[#285A87] text-lg ml-6">From 1 to 9</span>
              </p>
              <p className="flex ">
                <span className="text-[#285A87] text-lg">Vidya Arts And Science School-</span>
                <span className="text-[#285A87] text-lg ml-6">From 1 to 9</span>
              </p>

              <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87] mt-5">
                     Student Details:
                  </h4>
              {/* Student Details */}
              <p className="flex  py-1">
                <span className="text-[#285A87] text-lg">Student ID:</span>
                <span className="ml-6 text-lg">{selectedStudent.studentId}</span>
              </p>
              <p className="flex  py-1">
                <span className="text-[#285A87] text-lg">Joinin Date:</span>
                <span className="ml-6 text-lg">01-03-2025</span>
              </p>
             
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Kids;
