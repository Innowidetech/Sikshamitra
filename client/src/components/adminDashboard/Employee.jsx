import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  addEmployee,
  editEmployee,
  clearError,
} from "../../redux/adminEmployee";
import { Plus, Edit, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Employee() {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector(
    (state) => state.adminEmployee
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    mobileNumber: "",
    salary: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error === "Unauthorized access") {
      toast.error("Authentication required. Please log in again.");
      console.error("Authentication required");
    } else if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (employee) => {
    setIsEditMode(true);
    setSelectedEmployeeId(employee._id);
    setFormData({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      mobileNumber: employee.mobileNumber,
      salary: employee.salary.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedEmployeeId) {
        await dispatch(
          editEmployee({
            employeeId: selectedEmployeeId,
            employeeData: formData,
          })
        ).unwrap();
        toast.success("Employee updated successfully!");
      } else {
        await dispatch(addEmployee(formData)).unwrap();
        toast.success("Employee added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      dispatch(fetchEmployees());
    } catch (err) {
      toast.error(err?.message || "Operation failed. Please try again.");
      console.error("Operation failed:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      department: "",
      mobileNumber: "",
      salary: "",
    });
    setIsEditMode(false);
    setSelectedEmployeeId(null);
    dispatch(clearError());
  };

  const filteredEmployees = employees?.employees?.filter((employee) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(search) ||
      employee.role.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search)
    );
  });

  const totalSalary = employees?.totalEmployeesSalary || 0;

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

      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[30px]">
            Employees
          </h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Employee 
            </span>
          </h1>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            resetForm();
          }}
          className="bg-[#146192] text-white text-xs md:text-lg md:px-4 px-1 py-2 rounded-md flex items-center gap-2 hover:bg-[#0f4c7a] transition-colors"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      <div className="mx-4 md:mx-8">
        {/* Search and Export Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Name, Role or Department"
                className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-[#146192]"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop and Laptop View - Table */}
      <div className="mx-8 mb-6 hidden lg:block">
        <div className="bg-white rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y border-2">
              <thead className="" style={{ fontFamily: "Poppins" }}>
                <tr>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Employee Name
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Employee Role
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Employee Department
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Mobile Number
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Salary
                  </th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-[#146192]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredEmployees?.map((employee) => (
                  <tr key={employee._id}>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {employee.name}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {employee.role}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {employee.department}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      {employee.mobileNumber}
                    </td>
                    <td className="px-2 py-2 text-sm whitespace-nowrap border-r">
                      ₹{employee.salary.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 text-sm text-center">
                      <button
                        className="text-[#146192] hover:text-[#0f4c7a]"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile and Tablet View - Cards */}
      <div className="mx-4 mb-6 lg:hidden shadow-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {filteredEmployees?.map((employee) => (
              <div key={employee._id} className="bg-white p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-[#146192]">Employee Name</div>
                  <div>{employee.name}</div>

                  <div className="text-[#146192]">Employee Role</div>
                  <div>{employee.role}</div>

                  <div className="text-[#146192]">Employee Department</div>
                  <div>{employee.department}</div>

                  <div className="text-[#146192]">Mobile Number</div>
                  <div>{employee.mobileNumber}</div>

                  <div className="text-[#146192]">Salary</div>
                  <div>₹{employee.salary.toLocaleString()}</div>

                  <div className="text-[#146192]">Action</div>
                  <div>
                    <button
                      className="text-[#146192] hover:text-[#0f4c7a]"
                      onClick={() => handleEdit(employee)}
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </div>
                <hr className="border mt-4 border-[#146192]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-md md:text-2xl font-semibold mb-4 border-b border-[#000000]">
              {isEditMode ? "Edit Employee Details" : "Add Employee Details"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Employee Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0f4c7a] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Employee;
