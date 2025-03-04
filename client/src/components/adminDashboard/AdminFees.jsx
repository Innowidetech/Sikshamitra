import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFees,
  addFees,
  updateFees,
  clearError,
} from "../../redux/adminfees";
import { Plus } from "lucide-react";
import { LiaEditSolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminFees() {
  const dispatch = useDispatch();
  const { fees, loading, error } = useSelector(
    (state) => state.adminFees || { fees: [], loading: false, error: null }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [formData, setFormData] = useState({
    className: "",
    tutionFees: "",
    admissionFees: "",
    examFees: "",
  });

  // Generate class options from 01 to 12
  const classOptions = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return num < 10 ? `0${num}` : `${num}`;
  });

  useEffect(() => {
    // If redux is set up, dispatch the action
    if (typeof dispatch === "function") {
      dispatch(fetchFees());
    }
  }, [dispatch]);

  // Handle unauthorized access
  useEffect(() => {
    if (error === "Unauthorized access") {
      toast.error("Authentication required. Please log in again.");
      console.error("Authentication required");
    } else if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "className") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(
          updateFees({
            id: selectedFee._id,
            feeData: {
              newTutionFees: formData.tutionFees,
              newAdmissionFees: formData.admissionFees,
              newExamFees: formData.examFees,
            },
          })
        ).unwrap();
        toast.success("Fees updated successfully!");
      } else {
        await dispatch(addFees(formData)).unwrap();
        toast.success("New fees added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      // Refresh the fees list
      dispatch(fetchFees());
    } catch (err) {
      toast.error(err?.message || "Operation failed. Please try again.");
      console.error("Operation failed:", err);
    }
  };

  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setFormData({
      className: fee.className || fee.class,
      tutionFees: fee.tutionFees,
      admissionFees: fee.admissionFees,
      examFees: fee.examFees,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      className: "",
      tutionFees: "",
      admissionFees: "",
      examFees: "",
    });
    setIsEditMode(false);
    setSelectedFee(null);
    if (typeof dispatch === "function") {
      dispatch(clearError());
    }
  };

  // Use mock data if redux is not set up
  const displayFees =
    fees && fees.length > 0
      ? fees
      : [
          {
            _id: "1",
            class: "01",
            tutionFees: 100000,
            admissionFees: 8500,
            examFees: 8500,
            totalFees: 117000,
          },
          {
            _id: "2",
            class: "02",
            tutionFees: 100000,
            admissionFees: 8500,
            examFees: 8500,
            totalFees: 117000,
          },
        ];

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

      <div className="flex justify-between items-center mx-8 py-10 ">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">Fees</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Class wise Fees
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
          Add New Fees
        </button>
      </div>

      <div className="mx-8 mb-6">
        <div className="inline-block">
          <label className="md:text-lg lg:text-xl font-medium">
            Class-Wise Fees Data
          </label>
          <hr className="border-t-2 border-black mt-1" />
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
                  <th className="px-6 py-3 text-left text-lg font-medium text-[#146192] border-r">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-[#146192] border-r">
                    Tution Fees
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-[#146192] border-r">
                    Admission Fees
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-[#146192] border-r">
                    Exam Fees
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-[#146192] border-r">
                    Total Fees
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-[#146192]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {displayFees.map((fee) => (
                  <tr key={fee._id}>
                    <td className="px-6 py-4 whitespace-nowrap border-r">
                      {fee.class || fee.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r">
                      ₹
                      {typeof fee.tutionFees === "number"
                        ? fee.tutionFees.toLocaleString()
                        : fee.tutionFees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r">
                      ₹
                      {typeof fee.admissionFees === "number"
                        ? fee.admissionFees.toLocaleString()
                        : fee.admissionFees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r">
                      ₹
                      {typeof fee.examFees === "number"
                        ? fee.examFees.toLocaleString()
                        : fee.examFees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r">
                      ₹
                      {typeof fee.totalFees === "number"
                        ? fee.totalFees.toLocaleString()
                        : fee.totalFees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(fee)}
                        className="text-[#146192] hover:text-[#0f4c7a]"
                      >
                        <LiaEditSolid size={20} />
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
      <div className="mx-4 mb-6 lg:hidden shadow-lg ">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {displayFees.map((fee) => (
              <div key={fee._id} className="p-4">
                <div className="flex justify-between items-center pb-2 mb-2">
                  <div className="text-lg font-medium text-[#146192]">
                    Class {fee.class || fee.className}
                  </div>
                  <button
                    onClick={() => handleEdit(fee)}
                    className="text-[#146192] hover:text-[#0f4c7a]"
                  >
                    <LiaEditSolid size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-[#146192]">Tution fees</div>
                  <div className="text-center">-</div>
                  <div className="text-right">
                    {typeof fee.tutionFees === "number"
                      ? fee.tutionFees.toLocaleString()
                      : fee.tutionFees}
                    /-
                  </div>

                  <div className="text-[#146192]">Admission Fees</div>
                  <div className="text-center">-</div>
                  <div className="text-right">
                    {typeof fee.admissionFees === "number"
                      ? fee.admissionFees.toLocaleString()
                      : fee.admissionFees}
                    /-
                  </div>

                  <div className="text-[#146192]">Exam Fees</div>
                  <div className="text-center">-</div>
                  <div className="text-right">
                    {typeof fee.examFees === "number"
                      ? fee.examFees.toLocaleString()
                      : fee.examFees}
                    /-
                  </div>

                  <div className="text-[#146192] font-medium">Total</div>
                  <div className="text-center">-</div>
                  <div className="text-right font-medium">
                    {typeof fee.totalFees === "number"
                      ? fee.totalFees.toLocaleString()
                      : fee.totalFees}
                    /-
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
            <h2 className="text-md md:text-2xl font-semibold mb-4 border-b border-[#000000] ">
              {isEditMode ? "Edit Class-Wise Fees Data" : "Upload Class-Wise Fees Data"}
            </h2>
            <form onSubmit={handleSubmit}>
              {!isEditMode && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Class Name
                  </label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                    required
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tution Fees
                </label>
                <input
                  type="number"
                  name="tutionFees"
                  value={formData.tutionFees}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Admission Fees
                </label>
                <input
                  type="number"
                  name="admissionFees"
                  value={formData.admissionFees}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Exam Fees
                </label>
                <input
                  type="number"
                  name="examFees"
                  value={formData.examFees}
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
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-4 py-2 rounded-full hover:bg-[#0f4c7a] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isEditMode ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminFees;
