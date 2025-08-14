import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { LiaEditSolid } from "react-icons/lia";
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import {
  fetchStudents,
  fetchStudentDetails,
  setSearchQuery,
  updateStudentAsync,
  fetchUpdatedStudentHistory,
} from "../../../redux/studentsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function StudentsTable() {
  const dispatch = useDispatch();
  const { filteredStudents, selectedStudent, loading, error, searchQuery } =
    useSelector((state) => state.students);
  const [localSearch, setLocalSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [expandedStudentId, setExpandedStudentId] = useState(null);
const [historyLoading, setHistoryLoading] = useState(false); // ✅ Only declare once
const { studentUpdateHistory } = useSelector(state => state.students); // From redux
const [loadingStudentId, setLoadingStudentId] = useState(null);




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

  // ✅ New fields
  email: studentData?.userId?.email || "",
  phone:
    parent?.parentProfile?.fatherPhoneNumber ||
    "",
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
  const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="p-2 w-full border rounded-md"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="p-2 w-full border rounded-md"
    >
      {options.map((opt) => (
        <option key={opt} value={opt.toLowerCase()}>{opt}</option>
      ))}
    </select>
  </div>
);

const handleRowClick = (studentId) => {
  if (expandedStudentId === studentId) {
    setExpandedStudentId(null);
  } else {
    setExpandedStudentId(studentId);
    dispatch(fetchUpdatedStudentHistory(studentId));  // ← Add this line here!
  }
};



const handleStudentClick = (studentId) => {
  if (expandedStudentId === studentId) {
    setExpandedStudentId(null);
    setLoadingStudentId(null);
  } else {
    setExpandedStudentId(studentId);
    setLoadingStudentId(studentId);
    dispatch(fetchUpdatedStudentHistory(studentId))
      .unwrap()
      .finally(() => setLoadingStudentId(null));
  }
};


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
                  className="min-w-full divide-y border border-black"
                  style={{ fontFamily: "Poppins" }}
                >
                  <thead className="sticky top-0">
            <tr>
              {[
                "Sr.No",
                "Student Name  Registration No",
                "Email / Phone No.",
                "Parent Name",
                "Class",
                "Section",
                "Gender",
                "DOB",
                "Fees",
                "Address",
                "Action",
                "Status",
              ].map((header, i) => {
        const bgColor = i % 2 === 0 ? "bg-white" : "bg-[#e5f3ff]";
        return (
           <th
          key={header}
          className={`px-2 py-2 text-left text-sm font-medium border border-black ${bgColor}`}
          style={{ color: "#146192" }}
        >
          {header}
        </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
  {(() => {
    let serialCounter = 1; // ✅ Define counter outside loops

    return displayStudents.flatMap((student, index) => {
      const parent = student.parent?.parentProfile;
      const children = parent?.parentOf || [];

      return children.map((child, childIndex) => {
        const studentData = child?.student;
        const studentId = studentData?._id;

        const getBg = (i) => (i % 2 === 0 ? "bg-white" : "bg-[#e5f3ff]");

        return (
          <React.Fragment key={studentId + "-" + childIndex}>
            <tr
              onClick={() => handleRowClick(studentId)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className={`px-2 py-2 border-r text-sm ${getBg(0)} text-black border border-black`}>
                {serialCounter++}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(1)} text-black border border-black`}>
                <div>{studentData?.studentProfile.fullname || "N/A"}</div>
                <div className="text-xs opacity-75">
                  {studentData?.studentProfile.registrationNumber || "N/A"}
                </div>
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(2)} text-black border border-black`}>
                <div>{studentData?.userId?.email || "N/A"}</div>
                <div className="text-xs opacity-75">
                  {parent?.fatherPhoneNumber || "N/A"}
                </div>
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(3)} text-black border border-black`}>
                {parent?.fatherName || "N/A"}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(4)} text-black border border-black`}>
                {studentData?.studentProfile.class || "N/A"}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(5)} text-black border border-black`}>
                {studentData?.studentProfile.section || "N/A"}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(6)} text-black border border-black`}>
                {studentData?.studentProfile.gender || "N/A"}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(7)} text-black border border-black`}>
                {studentData?.studentProfile.dob
                  ? new Date(studentData.studentProfile.dob).toLocaleDateString()
                  : "N/A"}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(8)} text-black border border-black`}>
                {studentData?.studentProfile.fees
                  ? `₹${parseInt(studentData.studentProfile.fees).toLocaleString()}`
                  : "N/A"}
              </td>

              <td className={`px-2 py-2 border-r text-sm ${getBg(9)} text-black border border-black`}>
                {studentData?.studentProfile.address || "N/A"}
              </td>

              <td className={`px-2 py-2 text-center border-r ${getBg(10)} border border-black`}>
                <button
                  className="text-[#146192] hover:text-[#0f4c7a]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(studentData);
                  }}
                >
                  <LiaEditSolid size={20} />
                </button>
              </td>

              <td className={`px-2 py-2 text-center border-r ${getBg(11)} border border-black`}>
                {studentData?.userId?.isActive ? (
                  <div className="w-5 h-5 mx-auto flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold border border-green-700">
                    ✓
                  </div>
                ) : (
                  <div className="w-5 h-5 mx-auto flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold border border-red-700">
                    ✕
                  </div>
                )}
              </td>
            </tr>

            {/* Expanded Update History */}
            {expandedStudentId === studentId && (
              <>
                {Array.isArray(studentUpdateHistory[studentId]) &&
                studentUpdateHistory[studentId].length > 0 ? (
                  studentUpdateHistory[studentId].map((entry, i) => {
                    const prev = entry.previousData || {};
                    const fieldsChanged = Object.keys(prev);

                    return (
                      <tr key={i} className="bg-[#0000001A] text-sm border-t border-b border-gray-300">
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('name') ? prev.name : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('email') ? prev.email : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('contact') ? prev.contact : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('guardianName') ? prev.guardianName : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('class') ? prev.class : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('section') ? prev.section : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('gender') ? prev.gender : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('admissionDate') ? prev.admissionDate : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('fees')
                            ? `₹${parseFloat(prev.fees).toLocaleString('en-IN')}`
                            : '-'}
                        </td>
                        <td className="border px-2 py-1">
                          {fieldsChanged.includes('address') ? prev.address : '-'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="bg-[#0000001A] text-sm border-t border-b border-gray-300 text-center">
                    <td colSpan={10} className="border px-2 py-2 text-gray-500 ">
                      No history found
                    </td>
                  </tr>
                )}
              </>
            )}
          </React.Fragment>
        );
      });
    });
  })()}
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

      return (
        <div
          key={studentData?._id + "-" + childIndex}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          {/* CLICKABLE STUDENT CARD */}
          <div onClick={() => handleStudentClick(studentData?._id)}>
            <div className="grid grid-cols-3 gap-2 text-xs items-center">
              <div className="text-[#146192] font-medium text-left">Sr.No</div>
              <div className="text-center">-</div>
              <div className="text-left">
                {studentData?.studentProfile.registrationNumber}
              </div>

              <div className="text-[#146192] font-medium text-left">Student Name</div>
              <div className="text-center">-</div>
              <div className="text-left">
                {studentData?.studentProfile.fullname || "N/A"}
              </div>

              <div className="text-[#146192] font-medium text-left">Registration Number</div>
              <div className="text-center">-</div>
              <div className="text-left">
                {studentData?.studentProfile.registrationNumber || "N/A"}
              </div>

              <div className="text-[#146192] font-medium text-left">Email ID</div>
              <div className="text-center">-</div>
             <div className="text-left break-words whitespace-normal">
  {studentData?.userId?.email || "N/A"}
</div>


              <div className="text-[#146192] font-medium text-left">Phone Number</div>
              <div className="text-center">-</div>
              <div className="text-left">{parent?.fatherPhoneNumber || "N/A"}</div>

              <div className="text-[#146192] font-medium text-left">Parent Name</div>
              <div className="text-center">-</div>
              <div className="text-left">{parent?.fatherName || "N/A"}</div>

              <div className="text-[#146192] font-medium text-left">Class</div>
              <div className="text-center">-</div>
              <div className="text-left">{studentData?.studentProfile.class || "N/A"}</div>

              <div className="text-[#146192] font-medium text-left">Section</div>
              <div className="text-center">-</div>
              <div className="text-left">{studentData?.studentProfile.section || "N/A"}</div>

              <div className="text-[#146192] font-medium text-left">Gender</div>
              <div className="text-center">-</div>
              <div className="text-left">{studentData?.studentProfile.gender || "N/A"}</div>

              <div className="text-[#146192] font-medium text-left">DOB</div>
              <div className="text-center">-</div>
              <div className="text-left">
                {new Date(studentData?.studentProfile.dob).toLocaleDateString() || "N/A"}
              </div>

              <div className="text-[#146192] font-medium text-left">Fees</div>
              <div className="text-center">-</div>
              <div className="text-left">
                ₹{parseInt(studentData?.studentProfile.fees).toLocaleString() || "N/A"}
              </div>

              <div className="text-[#146192] font-medium text-left">Address</div>
              <div className="text-center">-</div>
              <div className="text-left">{studentData?.studentProfile.address || "N/A"}</div>

              <div className="text-[#146192] font-medium text-left">Action</div>
              <div className="text-center">-</div>
              <div className="text-left">
                <button
                  className="text-[#146192] hover:text-[#0f4c7a]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(studentData);
                  }}
                >
                  <LiaEditSolid size={20} />
                </button>
              </div>

              <div className="text-[#146192] font-medium text-left">Status</div>
              <div className="text-center">-</div>
              <div className="text-left">
                {studentData?.userId?.isActive ? (
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold border border-green-700">
                    ✓
                  </div>
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold border border-red-700">
                    ✕
                  </div>
                )}
              </div>
            </div>
          </div>

      {expandedStudentId === studentData?._id && (
  <div className="mt-4 p-3 border-t border-[#146192] bg-[#f0f9ff] rounded text-sm text-gray-700 space-y-2">
    {loadingStudentId === studentData._id ? (
      <p className="text-gray-500 text-xs">Loading history...</p>
    ) : studentUpdateHistory[studentData._id]?.length > 0 ? (
      studentUpdateHistory[studentData._id].map((history, index) => (
        <div key={history._id || index} className="border-b pb-2 text-xs last:border-none">
          <p><span className="font-semibold text-[#146192]">Reason:</span> {history.reason || "N/A"}</p>
          <p><span className="font-semibold text-[#146192]">Updated At:</span> {new Date(history.updatedAt).toLocaleString()}</p>
          <p className="font-semibold text-[#146192]">Previous Data:</p>
          <ul className="list-disc pl-5 text-gray-700">
            {Object.entries(history.previousData || {}).map(([key, value]) => (
              <li key={key}>
                <span className="capitalize">{key}:</span> {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-xs">No history found.</p>
    )}
  </div>
)}



          <hr className="border mt-4 border-[#146192]" />
        </div>
      );
    });
  })}
</div>
</div>
        {isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-4xl mt-20 max-h-[90vh] overflow-y-auto">
      
      {/* Header */}
      <div className="sticky top-0 bg-white px-8 pt-8 pb-4 border-b">
        <h2 className="text-3xl font-semibold text-[#146192]">Edit Student Profile</h2>
      </div>

      {/* Form Section */}
      <div className="px-8 pt-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Blue Rounded Main Form Container */}
          <div className="bg-[#dceaf4] rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <InputField label="Full name" value={editFormData.fullname} onChange={(e) => setEditFormData({ ...editFormData, fullname: e.target.value })} />
            <InputField label="Date of Birth" type="date" value={editFormData.dob} onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })} />
            <InputField label="Registration Number" value={editFormData.registrationNumber} onChange={(e) => setEditFormData({ ...editFormData, registrationNumber: e.target.value })} />
            <InputField label="Class" value={editFormData.class} onChange={(e) => setEditFormData({ ...editFormData, class: e.target.value })} />
            <InputField label="Section" value={editFormData.section} onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })} />
            
            <SelectField label="Class Type" value={editFormData.classType} options={['Primary', 'Secondary']} onChange={(e) => setEditFormData({ ...editFormData, classType: e.target.value })} />
<InputField
  label="Email-ID"
  value={editFormData.email}
  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
/>

<InputField
  label="Phone No."
  value={editFormData.phone}
  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
/>

            <InputField label="Fees" value={editFormData.fees} onChange={(e) => setEditFormData({ ...editFormData, fees: e.target.value })} />
            <SelectField label="Gender" value={editFormData.gender} options={['Male', 'Female']} onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })} />
            
            <SelectField label="Is Active" value={editFormData.isActive.toString()} options={['true', 'false']} onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === "true" })} />

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="p-2 w-full border rounded-md"
              />
            </div>
          </div>

          {/* Reason for Edit Box */}
          <div className="bg-[#dceaf4] rounded-xl p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for edit</label>
            <textarea
              value={editFormData.reason}
              onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Changing child’s surname to mother’s"
              required
            />
          </div>

        <div className="col-span-1 sm:col-span-2 flex justify-end gap-4 mt-4">
  <button
    type="button"
    onClick={() => setIsEditModalOpen(false)} // closes the modal
    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="px-4 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0f4c7a]"
  >
    Save
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
