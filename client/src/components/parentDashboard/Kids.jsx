import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../redux/parent/pkidsSlice";
import {MapPin,Phone,Mail,GraduationCap,SplitSquareVertical,} from "lucide-react";


function Kids() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.pkids);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDashboardData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (profile?.students?.length > 0) {
      setSelectedStudent(profile.students[0]);
    }
  }, [profile]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // console.log(profile)

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">
            My Kids
          </h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">
              My Kids
            </span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      <div className="bg-[#285A87] h-[100px] xl:h-[120px] mx-10 lg:max-w-3xl xl:max-w-5xl xl:mx-auto rounded-tl-lg rounded-tr-lg">
        <div className="flex  gap-6 mt-8 mx-8 items-center pt-16">
          {profile?.students?.map((student, index) => (
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
                  src={student.student.studentProfile.photo}
                  alt={`${student.student.studentProfile.firstName} ${student.student.studentProfile.lastName}`}
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
                {student.student.studentProfile.firstName}{" "}
                {student.student.studentProfile.lastName}
              </h3>
              <p className="text-sm text-[#A098AE ]">
                Student {String(index + 1).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Student Details */}
        {selectedStudent && (
          <div className="mx-8 mt-8 p-6">
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-[#146192] rounded-full p-2">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600">
                  {selectedStudent.student.studentProfile.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-[#146192] rounded-full p-2">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600">
                    {profile?.parentData?.parentProfile?.fatherPhoneNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-[#146192] rounded-full p-2">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600">{selectedStudent.student.userId.email}{profile?.parentData?.parentProfile?.fatherPhoneNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-[#146192] rounded-full p-2">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600">
                  Class - {selectedStudent.student.studentProfile.class}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-[#146192] rounded-full p-2">
                    <SplitSquareVertical className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600">
                  Section - {selectedStudent.student.studentProfile.section}
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="text-[#146192] font-bold mb-3 lg:text-xl">
                  Parents Details:
                </h3>
                <div className="space-y-2" style={{fontFamily:'Poppins'}}>
                  <p className="text-gray-600">
                    <span className="font-medium text-[#222850]">Father Name:</span>{" "}
                    {profile?.parentData?.parentProfile?.fatherName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-[#222850]">Mobile Number:</span>{" "}
                    {profile?.parentData?.parentProfile?.fatherPhoneNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-[#222850]">Occupation:</span>{" "}
                    {profile?.parentData?.parentProfile?.fatherOccupation}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-[#222850]">Address:</span>{" "}
                    {profile?.parentData?.parentProfile?.fatherAddress}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-[#146192] font-bold lg:text-xl mb-3">
                  Previous Education:
                </h3>
                <div className="space-y-3">
                  {selectedStudent.student.studentProfile.previousEducation.map(
                    (edu, index) => (
                      <div key={index}>
                        <p className="font-medium text-[#303972]">{edu.schoolName}</p>
                        <p className="text-sm text-[#A098AE]">
                          Class {edu.study} - {edu.duration}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Kids;
