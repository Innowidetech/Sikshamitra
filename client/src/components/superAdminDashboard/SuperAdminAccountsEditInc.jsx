import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncomeAndExpenses,
  editIncomeById,
} from "../../redux/superAdmin/superAdminAccountsSlice";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./layout/Header";

const SuperAdminAccountsEditInc = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { income, success, loading } = useSelector(
    (state) => state.superAdminAccounts
  );
  const selectedIncome = income.find((item) => item._id === id);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    totalFees: "",
    paidAmount: "",
    dueAmount: "",
    paymentMethod: "Online",
    transactionId: "",
  });

  // Fetch accounts if not already loaded
  useEffect(() => {
    if (!income.length) {
      dispatch(fetchIncomeAndExpenses());
    }
  }, [dispatch, income.length]);

  // Populate form when income found
  useEffect(() => {
    if (selectedIncome) {
      setFormData({
        totalFees: selectedIncome.totalFees || "",
        paidAmount: selectedIncome.paidAmount || "",
        dueAmount: selectedIncome.dueAmount || "",
        paymentMethod: selectedIncome.paymentMethod || "Online",
        transactionId: selectedIncome.transactionId || "",
      });
    }
  }, [selectedIncome]);

  // Show toast on successful update
  useEffect(() => {
    if (formSubmitted && success) {
      toast.success("Income updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormSubmitted(false);
    }
  }, [success, formSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "totalFees" || name === "paidAmount") {
        const total =
          parseFloat(name === "totalFees" ? value : updated.totalFees) || 0;
        const paid =
          parseFloat(name === "paidAmount" ? value : updated.paidAmount) || 0;
        updated.dueAmount = total - paid;
      }

      return updated;
    });
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

      <div className="flex items-center justify-between">
        <div>
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
        <Header />
      </div>

      {!selectedIncome && !loading ? (
        <p className="mt-10 text-red-600 text-center">
          Income record not found!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md mt-6"
        >
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
                  readOnly={name === "dueAmount"}
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
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SuperAdminAccountsEditInc;
