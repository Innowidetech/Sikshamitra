import React, { useEffect, useState, useRef } from 'react';
import { Plus, X } from "lucide-react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassRatios, fetchClasses, createClass } from '../../redux/adminClasses';
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                ref={teacherInputRef}
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192] focus:border-transparent"
                placeholder="Enter teacher full name"
                required
                // autoComplete="off"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 px-4 gap-6 mx-4 lg:mx-8 mb-6">
        {/* Total */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-start h-[120px]">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-4 border-t-yellow-400 border-b-[#14629e] border-l-yellow-400 border-r-[#14629e]">
            <FaUserGraduate className="h-6 w-6 text-[#146192]" />
          </div>
          <div className="ml-4">
            <p className="md:text-xl text-[#285A87]">Total</p>
            <p className="text-center text-2xl font-semibold text-[#146192]">{classRatios?.totalStudents || 0}</p>
          </div>
        </div>

        {/* Primary (Teacher Icon) */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-start h-[120px]">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-4 border-t-yellow-400 border-b-[#14629e] border-l-yellow-400 border-r-[#14629e]">
            <FaChalkboardTeacher className="h-6 w-6 text-[#146192]" />
          </div>
          <div className="ml-4">
            <p className="md:text-xl text-[#285A87]">Primary</p>
            <p className="text-center text-2xl font-semibold text-[#146192]">{classRatios?.primaryStudents || 0}</p>
          </div>
        </div>

        {/* Secondary (Professional Icon) */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-start h-[120px]">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-full border-4 border-t-yellow-400 border-b-[#14629e] border-l-yellow-400 border-r-[#14629e]">
            <FaUserTie className="h-6 w-6 text-[#146192]" />
          </div>
          <div className="ml-4">
            <p className="md:text-xl text-[#285A87]">Secondary</p>
            <p className="text-center text-2xl font-semibold text-[#146192]">{classRatios?.secondaryStudents || 0}</p>
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
                </tr>
              </thead>
              <tbody className="bg-white">
                {Array.isArray(classes) && classes.map((classItem) => (
                  <tr key={`${classItem.class}-${classItem.section}`}>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {classItem.classType}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {classItem.class}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {classItem.section}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {classItem.teacher}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {classItem.studentCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile and Tablet View - Cards */}
      <div className="mx-8 mb-6 lg:hidden shadow-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(classes) && classes.map((classItem) => (
              <div key={`${classItem.class}-${classItem.section}`} className="p-4 rounded-lg">
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