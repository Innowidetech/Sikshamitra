import React, { useEffect, useState, useRef } from 'react';
import { Plus, X } from "lucide-react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassRatios, fetchClasses, createClass, updateTeacherName, } from '../../redux/adminClasses';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Classes() {
  const dispatch = useDispatch();
  const { classRatios, classes, loading, error, createClassLoading, createClassError } = useSelector((state) => state.adminClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    classType: '',
    classs: '',
    section: '',
    teacherName: ''
  });
  const teacherInputRef = useRef(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedTeacher, setEditedTeacher] = useState('');


  useEffect(() => {
    dispatch(fetchClassRatios());
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (isModalOpen && teacherInputRef.current) {
      teacherInputRef.current.focus();
    }
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleEditClick = (index, currentName) => {
    setEditingRow(index);
    setEditedTeacher(currentName);
  };

  const handleSaveTeacher = async (classItem) => {
    const payload = {
      classId: classItem._id,
      newTeacher: editedTeacher.trim(),
    };

    console.log('Updating teacher with:', payload);

    try {
      const resultAction = await dispatch(updateTeacherName(payload));
      console.log('Update result:', resultAction);

      if (updateTeacherName.fulfilled.match(resultAction)) {
        toast.success('Teacher name updated successfully!');
        setEditingRow(null);
        dispatch(fetchClasses());
      } else {
        throw new Error(resultAction.payload || 'Update failed');
      }
    } catch (error) {
      toast.error(`Failed to update teacher name: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createClass(formData));
    if (!result.error) {
      setIsModalOpen(false);
      setFormData({
        classType: '',
        classs: '',
        section: '',
        teacherName: ''
      });
      dispatch(fetchClasses());
      toast.success('Class created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(result.error.message || 'Failed to create class', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Modal Component
  const CreateClassModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#146192]">Create Class</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#146191] mb-2">
                Class Type
              </label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Type</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#146191] mb-2">
                Class
              </label>
              <select
                name="classs"
                value={formData.classs}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Class</option>
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#146191] mb-2">
                Section
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Section</option>
                {['A', 'B', 'C', 'D'].map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#146191] mb-2">
                Teacher name
              </label>
              <input
                // ref={teacherInputRef} ❌ remove this
                autoFocus // ✅ use this instead
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192] focus:border-transparent"
                placeholder="Enter teacher full name"
                required
              />

            </div>
          </div>

          {createClassError && (
            <p className="text-red-500 text-sm">{createClassError}</p>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#146192]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClassLoading}
              className="px-6 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0f4c7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#146192] disabled:opacity-50"
            >
              Upload class
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center mx-8 py-10 ">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">Classes</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Classes
            </span>
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#146192] text-white text-xs md:text-lg md:px-4 px-1 py-2 rounded-md flex items-center gap-2 hover:bg-[#0f4c7a] transition-colors"
        >
          <Plus size={20} />
          Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 lg:px-8 mb-6">
        {/* Total */}
        <div className="bg-white rounded-2xl shadow-md flex items-center px-6 py-4 gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-[6px] border-t-yellow-400 border-b-[#14629e] border-l-yellow-400 border-r-[#14629e]">
            <FaUserGraduate className="text-[#146192] text-xl" />
          </div>
          <div>
            <p className="text-[#285A87] font-semibold text-sm">TOTAL</p>
            <p className="text-[#146192] font-bold text-2xl">{classRatios?.totalStudents || 0}</p>
          </div>
        </div>

        {/* Primary */}
        <div className="bg-white rounded-2xl shadow-md flex items-center px-6 py-4 gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-[6px] border-t-yellow-400 border-b-[#14629e] border-l-yellow-400 border-r-[#14629e]">
            <FaChalkboardTeacher className="text-[#146192] text-xl" />
          </div>
          <div>
            <p className="text-[#285A87] font-semibold text-sm">PRIMARY</p>
            <p className="text-xs text-gray-500">
              <span className="mr-2 text-[#3f3f3f]">■ Male ({classRatios?.primaryMaleRatio || 0}%)</span>
              <span className="text-[#f6ae2d]">■ Female ({classRatios?.primaryFemaleRatio || 0}%)</span>
            </p>
            <p className="text-[#146192] font-bold text-2xl">{classRatios?.primaryStudents || 0}</p>
          </div>
        </div>

        {/* Secondary */}
        <div className="bg-white rounded-2xl shadow-md flex items-center px-6 py-4 gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-[6px] border-t-yellow-400 border-b-[#14629e] border-l-yellow-400 border-r-[#14629e]">
            <FaUserTie className="text-[#146192] text-xl" />
          </div>
          <div>
            <p className="text-[#285A87] font-semibold text-sm">SECONDARY</p>
            <p className="text-xs text-gray-500">
              <span className="mr-2 text-[#3f3f3f]">■ Male ({classRatios?.secondaryMaleRatio || 0}%)</span>
              <span className="text-[#f6ae2d]">■ Female ({classRatios?.secondaryFemaleRatio || 0}%)</span>
            </p>
            <p className="text-[#146192] font-bold text-2xl">{classRatios?.secondaryStudents || 0}</p>
          </div>
        </div>
      </div>

      {/* Desktop and Laptop View - Table */}
      <div className="mx-8 px-4 mb-6 hidden lg:block">
        <div className="rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y border">
              <thead className="bg-[#4a82aeb8]" style={{ fontFamily: "Poppins" }}>
                <tr>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Class Type
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Class
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Section
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Assigned Teacher
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Number of Students
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {Array.isArray(classes) && classes.map((classItem, index) => (
                  <tr key={`${classItem.class}-${classItem.section}`} className="relative">
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">{classItem.classType}</td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">{classItem.class}</td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">{classItem.section}</td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">{classItem.teacher}</td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">{classItem.studentCount}</td>
                  <td className="px-2 py-2 text-sm whitespace-nowrap relative">
  <button
    onClick={() => handleEditClick(index, classItem.teacher)}
    className="text-blue-500 hover:text-blue-700"
  >
    ✏️
  </button>

  {editingRow === index && (
    <div className="absolute top-10 right-14 bg-white border shadow-md p-4 rounded-md z-10 w-60">
      <label className="block text-sm mb-2 text-gray-700 font-semibold">
        Edit Teacher Name
      </label>

      <input
        type="text"
        value={editedTeacher}
        onChange={(e) => setEditedTeacher(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex justify-between gap-2">
        <button
          onClick={() => handleSaveTeacher(classItem)}
          className="bg-[#146192] text-white px-4 py-1 rounded text-sm hover:bg-[#0f4c7a]"
        >
          Save
        </button>
        <button
          onClick={() => setEditingRow(null)} // 👈 Cancel the edit
          className="border border-gray-400 text-gray-600 px-4 py-1 rounded text-sm hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>

      {/* Mobile and Tablet View - Cards */}
  {/* Mobile and Tablet View - Cards */}
<div className="mx-4 mb-6 lg:hidden shadow-lg">
  {loading ? (
    <div className="p-4 text-center text-gray-600">Loading...</div>
  ) : (
    <div className="space-y-6">
      {Array.isArray(classes) && classes.map((classItem, index) => (
        <div key={`${classItem.class}-${classItem.section}`} className="p-4 rounded-lg border shadow-sm bg-white">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-[#146192] font-medium">Class Type</div>
            <div>{classItem.classType}</div>

            <div className="text-[#146192] font-medium">Class</div>
            <div>{classItem.class}</div>

            <div className="text-[#146192] font-medium">Section</div>
            <div>{classItem.section}</div>

            <div className="text-[#146192] font-medium">Assigned Teacher</div>
            <div>{classItem.teacher}</div>

            <div className="text-[#146192] font-medium">Number of Students</div>
            <div>{classItem.studentCount}</div>
          </div>

       {/* Edit Button */}
<div className="mt-4 text-right">
  <button
    onClick={() => handleEditClick(index, classItem.teacher)}
    className="text-blue-600 text-sm hover:text-blue-800"
  >
    ✏️ Edit
  </button>
</div>

{/* Edit Input Box */}
{editingRow === index && (
  <div className="mt-3 bg-gray-50 border rounded p-3">
    <label className="block text-sm mb-2 text-gray-700 font-semibold">
      Edit Teacher Name
    </label>
    <input
      type="text"
      value={editedTeacher}
      onChange={(e) => setEditedTeacher(e.target.value)}
      className="w-full border rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    
    {/* Save & Cancel Buttons */}
    <div className="flex justify-center gap-4">
      <button
        onClick={() => handleSaveTeacher(classItem)}
        className="bg-[#146192] text-white px-6 py-1 rounded text-sm hover:bg-[#0f4c7a]"
      >
        Save
      </button>

      <button
        onClick={() => setEditingRow(null)} // Cancel logic
        className="bg-gray-300 text-black px-6 py-1 rounded text-sm hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
)}

          <hr className="border mt-4 border-[#146192]" />
        </div>
      ))}
    </div>
  )}
</div>


      {error && <div className="text-center text-red-500">{error}</div>}
      {isModalOpen && <CreateClassModal />}
      <ToastContainer />
    </>
  );
}

export default Classes;