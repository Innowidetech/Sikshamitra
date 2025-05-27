import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchStudents,
  fetchStudentDetails,
  setSearchQuery,
  updateStudentAsync,
} from "../../../redux/studentsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentsTable() {
  const dispatch = useDispatch();
  const { filteredStudents, selectedStudent, loading, error, searchQuery } =
    useSelector((state) => state.students);
  const [localSearch, setLocalSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    studentId: "",
    fullname: "",
    gender: "",
    dob: "",
    photo: "",
    address: "",
    about: "",
    registrationNumber: "",
    class: "",
    section: "",
    classType: "",
    childOf: "",
    rollNumber: "",
    fees: "",
    additionalFees: "",
    previousEducation: [],
    isActive: true,
    reason: "",
  });
  const [previousEducationInput, setPreviousEducationInput] = useState({
    study: "",
    schoolName: "",
    duration: "",
  });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const handleEditClick = (studentData) => {
    const profile = studentData?.studentProfile;
    if (!profile) return;

    setEditFormData({
      studentId: studentData._id,
      fullname: profile.fullname || "",
      gender: profile.gender || "",
      dob: new Date(profile.dob).toISOString().split("T")[0],
      photo: profile.photo || "",
      address: profile.address || "",
      about: profile.about || "",
      registrationNumber: profile.registrationNumber || "",
      class: profile.class || "",
      section: profile.section || "",
      classType: profile.classType || "primary",
      childOf: profile.childOf || "",
      rollNumber: profile.rollNumber || "",
      fees: profile.fees || "",
      additionalFees: profile.additionalFees || "0",
      previousEducation: profile.previousEducation || [],
      isActive: profile.isActive !== false,
      reason: "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddPreviousEducation = () => {
    if (
      previousEducationInput.study &&
      previousEducationInput.schoolName &&
      previousEducationInput.duration
    ) {
      setEditFormData((prev) => ({
        ...prev,
        previousEducation: [
          ...prev.previousEducation,
          { ...previousEducationInput },
        ],
      }));
      setPreviousEducationInput({ study: "", schoolName: "", duration: "" });
    }
  };

  const handleRemovePreviousEducation = (index) => {
    setEditFormData((prev) => ({
      ...prev,
      previousEducation: prev.previousEducation.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateStudentAsync({
          studentId: editFormData.studentId,
          updateData: {
            fullname: editFormData.fullname,
            gender: editFormData.gender,
            dob: editFormData.dob,
            photo: editFormData.photo,
            address: editFormData.address,
            about: editFormData.about,
            registrationNumber: editFormData.registrationNumber,
            class: editFormData.class,
            section: editFormData.section.toUpperCase(),
            classType: editFormData.classType,
            childOf: editFormData.childOf,
            rollNumber: editFormData.rollNumber,
            fees: editFormData.fees,
            additionalFees: editFormData.additionalFees,
            previousEducation: editFormData.previousEducation,
            isActive: editFormData.isActive,
            reason: editFormData.reason,
          },
        })
      ).unwrap();

      toast.success("Student updated successfully!");
      setIsEditModalOpen(false);
      // dispatch(fetchStudents());
    } catch (error) {
      toast.error(error.message || "Failed to update student");
    }
  };

  const getFilteredStudents = () => {
    const searchTerm = localSearch.toLowerCase().trim();
    if (!searchTerm) return filteredStudents;

    return filteredStudents.filter((student) => {
      const parent = student.parent?.parentProfile;
      const children = parent?.parentOf || [];

      return children.some((child) => {
        const studentData = child?.student?.studentProfile;
        if (!studentData) return false;

        const nameMatch = studentData.fullname
          ?.toLowerCase()
          .includes(searchTerm);
        const regNoMatch = studentData.registrationNumber
          ?.toLowerCase()
          .includes(searchTerm);
        const classMatch = studentData.class
          ?.toString()
          .toLowerCase()
          .includes(searchTerm);
        const sectionMatch = studentData.section
          ?.toLowerCase()
          .includes(searchTerm);

        return nameMatch || regNoMatch || classMatch || sectionMatch;
      });
    });
  };

  const displayStudents = getFilteredStudents();

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] p-4 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] p-4 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (displayStudents.length === 0 && localSearch) {
    return (
      <div className="h-[calc(100vh-4rem)] mx-4 md:mx-8">
        <div className="w-full md:w-96 mb-6">
          <div className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search by Name, Registration Number or Class"
              className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-[#146192]"
            />
            <CiSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="text-center text-gray-600 py-8">
          No students found matching "{localSearch}"
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="h-[calc(100vh-4rem)] mx-4 md:mx-8 overflow-auto">
        <div className="sticky top-0 z-10 bg-white py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  placeholder="Search by Name, Registration Number or Class"
                  className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-[#146192]"
                />
                <CiSearch
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg overflow-hidden border-2">
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y"
                  style={{ fontFamily: "Poppins" }}
                >
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Sr.No

                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Student Name
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Registration Number
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Parent Name
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Class
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Section
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Gender
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        DOB
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Fees
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                        Address
                      </th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-[#146192] border-r">
                        Action
                      </th>
                      <th className="px-2 py-2 text-center text-sm font-medium text-[#146192]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {displayStudents.map((student, index) => {
                      const parent = student.parent?.parentProfile;
                      const children = parent?.parentOf || [];

                      return children.map((child, childIndex) => {
                        const studentData = child?.student;
                        const teacherData = child?.teacher;

                        return (
                          <tr

                          >
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {index + 1}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.studentProfile.fullname}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.studentProfile.registrationNumber}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {parent?.fatherName || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.studentProfile.class || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.studentProfile.section || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.studentProfile.gender || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {new Date(
                                studentData?.studentProfile.dob
                              ).toLocaleDateString() || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              ₹
                              {parseInt(
                                studentData?.studentProfile.fees
                              ).toLocaleString() || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.studentProfile.address || "N/A"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-center border-r">
                              <button
                                className="text-[#146192] hover:text-[#0f4c7a]"
                                onClick={() => handleEditClick(studentData)}
                              >
                                <LiaEditSolid size={20} />
                              </button>
                            </td>
                            {/* <td className="px-2 py-2 text-sm text-center">
                              {teacherData?.fullname || "N/A"}
                            </td> */}
                            <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                              {studentData?.userId.isActive ? 'yes' : 'no'}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {displayStudents.map((student) => {
              const parent = student.parent?.parentProfile;
              const children = parent?.parentOf || [];

              return children.map((child, childIndex) => {
                const studentData = child?.student;
                const teacherData = child?.teacher;

                return (
                  <div
                    key={studentData?._id + "-" + childIndex}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-3 gap-2 text-xs items-center">
                      <div className="text-[#146192] font-medium text-left">
                        Sr.No
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.registrationNumber}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Student Name
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.fullname}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Registration Number
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.registrationNumber}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Parent Name
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {parent?.fatherName || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Class
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.class || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Section
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.section || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Gender
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.gender || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        DOB
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {new Date(
                          studentData?.studentProfile.dob
                        ).toLocaleDateString() || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Fees
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        ₹
                        {parseInt(
                          studentData?.studentProfile.fees
                        ).toLocaleString() || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Address
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.studentProfile.address || "N/A"}
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Action
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        <button
                          className="text-[#146192] hover:text-[#0f4c7a]"
                          onClick={() => handleEditClick(studentData)}
                        >
                          <LiaEditSolid size={20} />
                        </button>
                      </div>

                      <div className="text-[#146192] font-medium text-left">
                        Status
                      </div>
                      <div className="text-center">-</div>
                      <div className="text-left">
                        {studentData?.userId.isActive ? 'yes' : 'no'}
                      </div>
                    </div>
                    <hr className="border mt-4 border-[#146192]" />
                  </div>
                );
              });
            })}
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl mt-20 max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b">
                <h2 className="text-xl font-medium text-[#146192]">
                  Edit Student Details
                </h2>
              </div>

              <div className="p-6">
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.fullname}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fullname: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          gender: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editFormData.dob}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          dob: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      value={editFormData.address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <textarea
                      value={editFormData.about}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          about: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.registrationNumber}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          registrationNumber: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Class
                    </label>
                    <input
                      type="text"
                      value={editFormData.class}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          class: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <input
                      type="text"
                      value={editFormData.section}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          section: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Class Type
                    </label>
                    <select
                      value={editFormData.classType}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          classType: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.rollNumber}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          rollNumber: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fees
                    </label>
                    <input
                      type="text"
                      value={editFormData.fees}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fees: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Fees
                    </label>
                    <input
                      type="text"
                      value={editFormData.additionalFees}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          additionalFees: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Education
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Class"
                        value={previousEducationInput.study}
                        onChange={(e) =>
                          setPreviousEducationInput({
                            ...previousEducationInput,
                            study: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="School Name"
                        value={previousEducationInput.schoolName}
                        onChange={(e) =>
                          setPreviousEducationInput({
                            ...previousEducationInput,
                            schoolName: e.target.value,
                          })
                        }
                        className="p-2 border rounded-md"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={previousEducationInput.duration}
                          onChange={(e) =>
                            setPreviousEducationInput({
                              ...previousEducationInput,
                              duration: e.target.value,
                            })
                          }
                          className="p-2 border rounded-md flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddPreviousEducation}
                          className="px-4 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0f4c7a]"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {editFormData.previousEducation.map((edu, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                        >
                          <span>
                            {edu.study} - {edu.schoolName} ({edu.duration})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePreviousEducation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={editFormData.isActive.toString()}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Edit
                    </label>
                    <textarea
                      value={editFormData.reason}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          reason: e.target.value,
                        })
                      }
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                      placeholder="Please provide a reason for editing"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0f4c7a]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StudentsTable;
