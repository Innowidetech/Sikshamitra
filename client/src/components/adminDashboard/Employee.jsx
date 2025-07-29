import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  addEmployee,
  editEmployee,
} from '../../redux/adminEmployee';
import {
  Edit,
  PlusCircle,
  FileDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Header from '../../components/adminDashboard/layout/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Employee = () => {
  const dispatch = useDispatch();
  const { staffList, loading } = useSelector((state) => state.adminEmployee);
  const employees = staffList || []; // Prevent error if staffList undefined
  const pdfRef = useRef();

  const [filters, setFilters] = useState({
    name: '',
    role: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    employeeRole: '',
    department: '',
    salary: '',
    isActive: 'true',
    isEdit: false,
    staffId: null,
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = formData.isEdit
      ? editEmployee({ staffId: formData.staffId, staffData: formData })
      : addEmployee(formData);

    dispatch(action).then(() => {
      dispatch(fetchEmployees());
      setShowModal(false);
    });
  };

  const openEditModal = (emp) => {
    setFormData({
      name: emp.name,
      email: emp.userId?.email || '',
      password: '',
      mobileNumber: emp.userId?.mobileNumber || '',
      employeeRole: emp.employeeRole,
      department: emp.department,
      salary: emp.salary,
      isActive: emp.userId?.isActive ? 'true' : 'false',
      isEdit: true,
      staffId: emp._id,
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      mobileNumber: '',
      employeeRole: '',
      department: '',
      salary: '',
      isActive: 'true',
      isEdit: false,
      staffId: null,
    });
    setShowModal(true);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(filters.name.toLowerCase()) &&
    emp.employeeRole?.toLowerCase().includes(filters.role.toLowerCase())
  );

  const exportPDFWithHTML = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('employees.pdf');
    });
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center mx-8 pt-10">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Staff</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Staff</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Content Section */}
      <div className="p-4 bg-white">
        {/* Filters & Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by Staff name..."
              className="border p-2 rounded text-sm w-60"
            />
            <input
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              placeholder="Search by Staff Role..."
              className="border p-2 rounded text-sm w-60"
            />
            <button className="bg-[#146192] text-white px-6 py-2 rounded text-sm">
              SEARCH
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportPDFWithHTML}
              className="text-sm text-[#146192] font-semibold underline"
            >
              Export PDF
            </button>
            <button
              onClick={openAddModal}
              className="bg-[#146192] text-white px-4 py-2 text-sm rounded"
            >
              Add Staff
            </button>
          </div>
        </div>

        {/* Employees Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div ref={pdfRef} className="overflow-x-auto border">
            <table className="min-w-full text-sm border">
              <thead className="bg-[#f5f8fa] text-gray-700 font-medium">
                <tr>
                  <th className="border px-2 py-2">S.no</th>
                  <th className="border px-2 py-2">Staff Name</th>
                  <th className="border px-2 py-2">Staff Department</th>
                  <th className="border px-2 py-2">Wage/Salary</th>
                  <th className="border px-2 py-2">E-mail ID</th>
                  <th className="border px-2 py-2">Mobile Number</th>
                  <th className="border px-2 py-2">Employee Role</th>
                  <th className="border px-2 py-2">Edit</th>
                  <th className="border px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp._id} className="text-center">
                    <td className="border px-2 py-2">{index + 1}</td>
                    <td className="border px-2 py-2">{emp.name}</td>
                    <td className="border px-2 py-2">{emp.department}</td>
                    <td className="border px-2 py-2">₹{emp.salary}</td>
                    <td className="border px-2 py-2">{emp.userId?.email}</td>
                    <td className="border px-2 py-2">{emp.userId?.mobileNumber}</td>
                    <td className="border px-2 py-2">{emp.employeeRole}</td>
                    <td className="border px-2 py-2">
                      <button onClick={() => openEditModal(emp)}>
                        <Edit className="text-blue-600 h-4 w-4" />
                      </button>
                    </td>
                    <td className="border px-2 py-2">
                      {emp.userId?.isActive === false ? (
                        <span className="flex items-center justify-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded shadow-md w-full max-w-4xl"
            >
              <div className="bg-[#146192] text-white px-6 py-3 rounded-t flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {formData.isEdit ? 'Edit Employee' : 'Add Staff details'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Name"
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email-ID"
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleFormChange}
                  placeholder="Mobile Number"
                  className="border p-2 rounded w-full"
                  required
                />
                {!formData.isEdit && (
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Password"
                    className="border p-2 rounded w-full"
                    required
                  />
                )}
                <input
                  type="text"
                  name="employeeRole"
                  value={formData.employeeRole}
                  onChange={handleFormChange}
                  placeholder="Staff Role"
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                  placeholder="Salary"
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  placeholder="Department"
                  className="border p-2 rounded w-full"
                  required
                />
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex justify-center px-6 pb-6">
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Employee;