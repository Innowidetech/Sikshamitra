import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editExpenseById,
  fetchIncomeAndExpenses, // ✅ Make sure this fetches expenses
} from "../../redux/superAdmin/superAdminAccountsSlice";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Header from "./layout/Header";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminAccountsEditExp = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Expense ID from route

  const { expense, expenseSuccess } = useSelector(
    (state) => state.superAdminAccounts
  );

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    purpose: "",
    amount: "",
    paymentMethod: "Online",
    transactionId: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // ✅ Fetch expenses if not loaded
  useEffect(() => {
    if (!expense.length) {
      dispatch(fetchIncomeAndExpenses());
    }
  }, [dispatch, expense.length]);

  // ✅ Pre-fill form with expense data by ID
  useEffect(() => {
    if (expense.length && id) {
      const foundExpense = expense.find((item) => item._id === id);
      if (foundExpense) {
        setFormData({
          name: foundExpense.name || "",
          date: foundExpense.date?.substring(0, 10) || "",
          purpose: foundExpense.purpose || "",
          amount: foundExpense.amount || "",
          paymentMethod: foundExpense.paymentMethod || "Online",
          transactionId: foundExpense.transactionId || "",
        });
      }
    }
  }, [expense, id]);

  // ✅ Show toast on success
  useEffect(() => {
    if (formSubmitted && expenseSuccess) {
      toast.success("Expense updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        name: "",
        date: "",
        purpose: "",
        amount: "",
        paymentMethod: "Online",
        transactionId: "",
      });

      setFormSubmitted(false); // Reset submit state
    }
  }, [expenseSuccess, formSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      formData.paymentMethod === "Online" &&
      (!formData.transactionId || formData.transactionId.trim() === "")
    ) {
      toast.error("Transaction ID is required for Online payment!");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be a positive number!");
      return;
    }

    const payload = {
      name: formData.name,
      date: formData.date,
      purpose: formData.purpose,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      ...(formData.paymentMethod === "Online" && {
        transactionId: formData.transactionId,
      }),
    };

    setFormSubmitted(true);
    dispatch(editExpenseById({ id, updatedData: payload }));
  };

  return (
    <div>
      <ToastContainer />
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">
          Edit Expenses
        </h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Accounts</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Edit Expenses</span>
        </h1>
        <Header />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
        <div className="bg-[#0a5a88] text-white text-lg font-semibold px-6 py-3 rounded-t-lg">
          Edit Expenses
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose *
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Purpose"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              min="0"
              step="0.01"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
            />
          </div>

          {/* Payment Method */}
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

          {/* Transaction ID - Only for Online */}
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

export default SuperAdminAccountsEditExp;
