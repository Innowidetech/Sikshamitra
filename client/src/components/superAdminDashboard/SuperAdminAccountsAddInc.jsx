import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIncome,
  resetIncomeStatus,
} from "../../redux/superAdmin/superAdminAccountsSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./layout/Header";

const SuperAdminAccountsAddInc = () => {
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.superAdminAccounts);

  const [formData, setFormData] = useState({
    schoolCode: "",
    schoolName: "",
    principalName: "",
    totalFees: "",
    paidAmount: "",
    dueAmount: "",
    paymentMethod: "Online",
    transactionId: "",
  });

  useEffect(() => {
    if (success) {
      toast.success("Income added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData({
        schoolCode: "",
        schoolName: "",
        principalName: "",
        totalFees: "",
        paidAmount: "",
        dueAmount: "",
        paymentMethod: "Online",
        transactionId: "",
      });

      dispatch(resetIncomeStatus());
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addIncome(formData));
  };

  return (
    <div>
      <ToastContainer />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">
            Add Income
          </h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {">"}{" "}
            <span className="font-medium text-[#146192]">Accounts</span> {">"}{" "}
            <span className="font-medium text-[#146192]">Add Income </span>
          </h1>
        </div>

        <Header />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
        <div className="bg-[#0a5a88] text-white text-lg font-semibold px-6 py-3 rounded-t-lg">
          Income Form
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "School Code *",
              name: "schoolCode",
              placeholder: "Enter a Valid School Code",
            },
            {
              label: "School Name *",
              name: "schoolName",
              placeholder: "School",
            },
            {
              label: "Principal Name *",
              name: "principalName",
              placeholder: "Principal",
            },
            {
              label: "Total Fees *",
              name: "totalFees",
              placeholder: "Total Fees",
            },
            {
              label: "Paid Amount *",
              name: "paidAmount",
              placeholder: "Paid Amount",
            },
            {
              label: "Due Amount *",
              name: "dueAmount",
              placeholder: "Due Amount",
            },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {formData.paymentMethod === "Online" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID *
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                placeholder="Transaction ID"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10 pb-6">
          <button
            type="submit"
            className="bg-[#0a5a88] text-white px-10 py-3 rounded-md text-sm font-medium hover:bg-[#084d74] transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminAccountsAddInc;
