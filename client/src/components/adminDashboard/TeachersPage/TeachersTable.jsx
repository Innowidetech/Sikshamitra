import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeachers, setSearchQuery, updateTeacherAsync } from "../../../redux/teachersSlice";
import { LiaEditSolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TeachersTable() {
  const dispatch = useDispatch();
  const { teachers, filteredTeachers, loading, error, searchQuery } =
    useSelector((state) => state.teachers);
  const [localSearch, setLocalSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    teacherId: "",
    employeeId: "",
    fullname: "",
    class: "",
    section: "",
    gender: "",
    email: "",
    phoneNumber: "",
    subjects: [],
    salary: "",
    isActive: true
  });
  const [subjectInput, setSubjectInput] = useState("");

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleEditClick = (teacher) => {
    setEditFormData({
      teacherId: teacher._id,
      employeeId: teacher.profile.employeeId,
      fullname: teacher.profile.fullname,
      class: teacher.profile.class || "",
      section: teacher.profile.section || "",
      gender: teacher.profile.gender,
      email: teacher.userId.email,
      phoneNumber: teacher.profile.phoneNumber,
      subjects: teacher.profile.subjects || [],
      salary: teacher.profile.salary,
      isActive: teacher.userId.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setEditFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput("");
    }
  };

  const handleRemoveSubject = (index) => {
    setEditFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTeacherAsync({
        teacherId: editFormData.teacherId,
        updateData: {
          isActive: editFormData.isActive,
          profile: {
            fullname: editFormData.fullname,
            phoneNumber: editFormData.phoneNumber,
            gender: editFormData.gender,
            class: editFormData.class,
            section: editFormData.section,
            subjects: editFormData.subjects,
            salary: editFormData.salary,
            employeeId: editFormData.employeeId
          }
        }
      })).unwrap();
      
      toast.success("Teacher updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update teacher");
    }
  };

  // Local search functionality
 const filteredTeachersLocal =
  filteredTeachers?.filter((teacher) =>
    teacher?.profile?.fullname?.toLowerCase().includes(localSearch.toLowerCase()) ||
    teacher?.userId?.email?.toLowerCase().includes(localSearch.toLowerCase()) ||
    teacher?.profile?.employeeId?.toLowerCase().includes(localSearch.toLowerCase())
  ) || [];

  const validTeachers = teachers.filter(
  (t) => t.profile && t.userId && t.profile.fullname && t.userId.email
);

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
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
    <div className="mx-4 md:mx-8">
      {/* Search and Export Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by Name, Email or Employee ID"
              className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-[#146192]"
            />
            <CiSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block">
  <div className="bg-white rounded-lg overflow-hidden border-2">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y" style={{ fontFamily: "Poppins" }}>
        <thead>
          <tr>
            <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
              Teacher ID
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
              Teacher Name
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
              Role Type
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
              E-mail Address
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
              Subject Name
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
              Phone Number
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
              Salary
            </th>
            <th className="px-2 py-2 text-center text-sm font-medium text-[#146192]">
              Edit
            </th>
            <th className="px-2 py-2 text-center text-sm font-medium text-[#146192]">
              Active Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {filteredTeachersLocal.map((teacher, index) => (
            <tr
              key={teacher._id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.employeeId}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.fullname}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.userId.employeeType.charAt(0).toUpperCase() +
                  teacher.userId.employeeType.slice(1)}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.userId.email}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.class || "N/A"}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.section || "N/A"}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.gender}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.subjects?.join(", ") || "N/A"}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                {teacher.profile.phoneNumber}
              </td>
              <td className="px-2 py-2 whitespace-nowrap border-r text-sm">
                ₹{teacher.profile.salary?.toLocaleString() || "N/A"}
              </td>
              <td className="px-2 py-2 whitespace-nowrap text-center border-r">
                <button
                  className="text-[#146192] hover:text-[#0f4c7a]"
                  onClick={() => handleEditClick(teacher)}
                >
                  <LiaEditSolid size={20} />
                </button>
              </td>
              <td className="px-2 py-2 text-sm text-center">
                {teacher.userId.isActive ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

{/* Mobile and Tablet View - Cards */}
<div className="lg:hidden">
  {filteredTeachersLocal.map((teacher) => (
    <div key={teacher._id} className="bg-white p-4">
      <div className="grid grid-cols-3 gap-2 text-xs items-center">
        <div className="text-[#146192] font-medium text-left">Teacher ID</div>
        <div className="text-center">-</div>
        <div className="text-left">{teacher.profile.employeeId}</div>

        <div className="text-[#146192] font-medium text-left">Teacher Name</div>
        <div className="text-center">-</div>
        <div className="text-left">{teacher.profile.fullname}</div>

        <div className="text-[#146192] font-medium text-left">Role Type</div>
        <div className="text-center">-</div>
        <div className="text-left">
          {teacher.userId.employeeType.charAt(0).toUpperCase() +
            teacher.userId.employeeType.slice(1)}
        </div>

        <div className="text-[#146192] font-medium text-left">E-mail Address</div>
        <div className="text-center">-</div>
        <div className="text-left break-words overflow-hidden text-ellipsis">
          {teacher.userId.email}
        </div>

        <div className="text-[#146192] font-medium text-left">Class</div>
        <div className="text-center">-</div>
        <div className="text-left">{teacher.profile.class || "N/A"}</div>

        <div className="text-[#146192] font-medium text-left">Section</div>
        <div className="text-center">-</div>
        <div className="text-left">{teacher.profile.section || "N/A"}</div>

        <div className="text-[#146192] font-medium text-left">Gender</div>
        <div className="text-center">-</div>
        <div className="text-left">{teacher.profile.gender}</div>

        <div className="text-[#146192] font-medium text-left">Subject Name</div>
        <div className="text-center">-</div>
        <div className="text-left break-words">
          {teacher.profile.subjects?.join(", ") || "N/A"}
        </div>

        <div className="text-[#146192] font-medium text-left">Phone Number</div>
        <div className="text-center">-</div>
        <div className="text-left">{teacher.profile.phoneNumber}</div>

        <div className="text-[#146192] font-medium text-left">Salary</div>
        <div className="text-center">-</div>
        <div className="text-left">
          ₹{teacher.profile.salary?.toLocaleString() || "N/A"}
        </div>

        <div className="text-[#146192] font-medium text-left">Edit</div>
        <div className="text-center">-</div>
        <div className="text-left">
          <button
            className="text-[#146192] hover:text-[#0f4c7a]"
            onClick={() => handleEditClick(teacher)}
          >
            <LiaEditSolid size={20} />
          </button>
        </div>

        <div className="text-[#146192] font-medium text-left">Active Status</div>
        <div className="text-center">-</div>
        <div className="text-left">
          {teacher.userId.isActive ? (
            <span className="text-green-500">✅</span>
          ) : (
            <span className="text-red-500">❌</span>
          )}
        </div>
      </div>
      <hr className="border mt-4 border-[#146192]" />
    </div>
  ))}
</div>


      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4 text-[#146192]">Edit teacher's Data</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Teacher's ID</label>
                <input
                  type="text"
                  value={editFormData.employeeId}
                  onChange={(e) => setEditFormData({...editFormData, employeeId: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teacher's name</label>
                <input
                  type="text"
                  value={editFormData.fullname}
                  onChange={(e) => setEditFormData({...editFormData, fullname: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <input
                  type="text"
                  value={editFormData.class}
                  onChange={(e) => setEditFormData({...editFormData, class: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  value={editFormData.section}
                  onChange={(e) => setEditFormData({...editFormData, section: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={editFormData.gender}
                  onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={editFormData.email}
                  className="mt-1 p-2 w-full border rounded-md"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="mt-1 p-2 flex-1 border rounded-md"
                    placeholder="Add subject"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="mt-1 px-4 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0f4c7a]"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editFormData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="text"
                  value={editFormData.salary}
                  onChange={(e) => setEditFormData({...editFormData, salary: e.target.value})}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Is Active</label>
                <select
                  value={editFormData.isActive.toString()}
                  onChange={(e) => setEditFormData({...editFormData, isActive: e.target.value === "true"})}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-end gap-4 mt-4">
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
                  EDIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default TeachersTable;