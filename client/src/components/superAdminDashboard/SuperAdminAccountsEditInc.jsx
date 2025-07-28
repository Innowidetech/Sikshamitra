import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editIncomeById } from "../../redux/superAdmin/superAdminAccountsSlice";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminAccountsEditInc = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get ID from URL
  const { success } = useSelector((state) => state.superAdminAccounts);

  const [formData, setFormData] = useState({
    totalFees: "",
    paidAmount: "",
    dueAmount: "",
    paymentMethod: "Online",
    transactionId: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (formSubmitted && success) {
      toast.success("Income updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        totalFees: "",
        paidAmount: "",
        dueAmount: "",
        paymentMethod: "Online",
        transactionId: "",
      });
    }
  }, [success, dispatch, formSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.paymentMethod === "Online" &&
      (!formData.transactionId || formData.transactionId.trim() === "")
    ) {
      toast.error("Transaction ID is required for Online payment!");
      return;
    }

    const payload = {
      totalFees: formData.totalFees,
      paidAmount: formData.paidAmount,
      dueAmount: formData.dueAmount,
      paymentMethod: formData.paymentMethod,
    };

    if (formData.paymentMethod === "Online") {
      payload.transactionId = formData.transactionId;
    }
    setFormSubmitted(true);
    dispatch(editIncomeById({ id, updatedData: payload }));
  };

  return (
    <div>
      <ToastContainer />
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">
          Edit Income
        </h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Accounts</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Edit Income</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
        <div className="bg-[#0a5a88] text-white text-lg font-semibold px-6 py-3 rounded-t-lg">
          Edit Income
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
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
                type="number"
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

export default SuperAdminAccountsEditInc;
