import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from "react";
import { School } from "lucide-react"; // Add at the top

import {
  fetchAccounts,
  fetchRevenueAndExpenses,
  fetchTeacherRequests,
  updateTeacherRequest,
  editExpense,
  deleteExpense,
  postExpense,
  postIncome,
  editIncome,
  fetchUpdatedIncomeHistoryById

} from '../../redux/accountSlice';
import Header from './layout/Header';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Accounts = ({ openHistory }) => {
  const dispatch = useDispatch();
  const { accounts, revenueAndExpenses, teacherRequests, status, error } = useSelector(
    (state) => state.accounts
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusInput, setStatusInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [selectedChartSection, setSelectedChartSection] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editFormData, setEditFormData] = useState({ purpose: '', amount: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const updatedIncomeHistoryById = useSelector(
  (state) => state.accounts.updatedIncomeHistoryById
);


  const [expandedIncomeId, setExpandedIncomeId] = useState(null);
  const [loadingIncomeId, setLoadingIncomeId] = useState(null);
  const [expenseFormData, setExpenseFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
  });

 


  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const resetIncomeForm = () => {
    setIncomeFormData({
      amount: '',
      date: '',
      purpose: '',
      source: '',
      reason: '',
      fullname: '',
      className: '',
      section: '',
      registrationNumber: '',
      organization: '',
      transactionId: '',
    });
  };

  const [incomeFormData, setIncomeFormData] = useState({

    amount: '',
    date: '',
    purpose: '',
    source: '',
    reason: '',
    fullname: '',
    className: '',
    section: '',
    registrationNumber: '',
    organization: '',
    transactionId: '',

  });

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchRevenueAndExpenses());
    dispatch(fetchTeacherRequests());
   
  }, [dispatch]);

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncomeChange = (e) => {
    const { name, value } = e.target;
    setIncomeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await dispatch(postExpense(expenseFormData)).unwrap();
      alert('Expense added successfully');
      setExpenseFormData({ title: '', amount: '', date: '', category: '' });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
      alert('Failed to add expense');
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await dispatch(postIncome(incomeFormData)).unwrap();
      alert('Income added successfully');
      setIncomeFormData({ title: '', amount: '', date: '', category: '' });
      setIsIncomeModalOpen(false);
    } catch (err) {
      console.error('Failed to add income:', err);
      alert('Failed to add income');
    }
  };

  const openEditModal = (request) => {
    setSelectedRequest(request);
    setStatusInput(request.status);
    setAmountInput(request.amount || '');
    setIsModalOpen(true);
  };

  const handleUpdateRequest = (e) => {
    e.preventDefault();
    if (statusInput === 'success' && !amountInput) {
      alert('Amount is required when the status is "success"');
      return;
    }
    dispatch(updateTeacherRequest({ requestId: selectedRequest._id, status: statusInput, amount: amountInput }));
    setIsModalOpen(false);
  };

  const handleEditExpense = (row) => {
    setEditingExpense(row);
    setEditFormData({ purpose: row.purpose, amount: row.amount });
    setEditModalOpen(true);
  };

  const submitEditExpense = async (e) => {
    e.preventDefault();
    if (!editingExpense) return;

    await dispatch(
      editExpense({
        expenseId: editingExpense._id,
        data: editFormData,
      })
    );

    setEditModalOpen(false);
    setEditingExpense(null);
  };

// 👇 Income Generated Section Data Setup
const [currentMonthData, previousMonthData] = useMemo(() => {
  const safeAccounts = Array.isArray(accounts) ? accounts : [];

  const sorted = [...safeAccounts].sort(
    (a, b) => new Date(b.monthYear) - new Date(a.monthYear)
  );

  const [current = {}, previous = {}] = sorted;

  const formatData = (item) => {
    const { monthYear, totalRevenue, totalIncome } = item || {};
    const percentage =
      totalIncome && totalIncome !== 0
        ? Math.round((totalRevenue / totalIncome) * 100)
        : 0;

    return {
      month: monthYear?.split(" ")[0] || "",
      value: totalRevenue || 0,
      percentage: Math.max(0, Math.min(percentage, 100)),
    };
  };

  return [formatData(current), formatData(previous)];
}, [accounts]);

const cards = [
  { title: "CURRENT MONTH", data: currentMonthData },
  { title: "PREVIOUS MONTH", data: previousMonthData },
];



  const handleDeleteExpense = async (row) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(row._id));
    }
  };

  const accountsArray = Array.isArray(accounts) ? accounts : [];

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  const pieChartData = {
    labels: ['Fees', 'Admission', 'Other', 'Expenses'],
    datasets: [
      {
        data: [
          accountsArray.reduce((total, acc) => total + acc.totalFeesCollected, 0),
          accountsArray.reduce((total, acc) => total + acc.totalAdmissionFees, 0),
          // accountsArray.reduce((total, acc) => total + acc.totalTransportationFees, 0),
          accountsArray.reduce((total, acc) => total + acc.otherIncome, 0),
          accountsArray.reduce((total, acc) => total + acc.totalExpenses, 0),
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#8979FF', '#2196F3'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ₹ ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const allMonths = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025',
    'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025',
    'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025',
  ];

  const expensesMap = {};
  accountsArray.forEach(item => {
    expensesMap[item.monthYear] = item.totalExpenses;
  });

  const lineChartData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Total Expenses',
        data: allMonths.map(month => expensesMap[month] || 0),
        borderColor: '#FF9F40',
        backgroundColor: '#FF9F40',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      tooltip: {
        enabled: true,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y || 0;
            return `₹ ${value.toLocaleString()}`;
          },
        },
      },
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `₹ ${value}`;
          },
        },
      },
    },
  };

  

 const handleRowClick = (incomeId) => {
  console.log("Clicked Income ID:", incomeId);

  // Always check if the key exists before accessing
  const history = updatedIncomeHistoryById?.[incomeId];
  console.log("All History for This ID:", history);

  if (expandedIncomeId === incomeId) {
    setExpandedIncomeId(null);
  } else {
    setExpandedIncomeId(incomeId);
    setLoadingIncomeId(incomeId);

    dispatch(fetchUpdatedIncomeHistoryById(incomeId))
      .unwrap()
      .then((res) => {
        console.log("Fetched history for", incomeId, ":", res);
      })
      .catch((err) => {
        console.error("Failed to fetch income history:", err);
      })
      .finally(() => setLoadingIncomeId(null));
  }
};


const allRevenueData = [
  ...(revenueAndExpenses.income || []).map((rev) => ({
    id: rev._id,
    date: new Date(rev.createdAt).toISOString().split("T")[0],
    purpose: rev.purpose === 'Other' ? rev.reason : rev.purpose,
    amount: rev.amount,
    transactionId: rev.paymentDetails?.razorpayOrderId?.slice(6) || 'Cash',
    name: rev.studentId?.studentProfile?.fullname +
      (rev.studentId?.studentProfile?.registrationNumber
        ? ` (${rev.studentId.studentProfile.registrationNumber})`
        : ''),
    className: rev.class || '-',
    section: rev.section || '-',
    originalData: rev,
  })),

  ...(revenueAndExpenses.otherIncome || []).map((rev) => ({
    id: rev._id,
    date: new Date(rev.date).toISOString().split("T")[0],
    purpose: rev.purpose === 'Other' ? rev.reason : rev.purpose,
    amount: rev.amount,
    transactionId: rev.transactionId || 'Cash',
    name: rev.fullname +
      (rev.source === 'student'
        ? ` (${rev.registrationNumber})`
        : ` (${rev.organization})`),
    className: rev.class || '-',
    section: rev.section || '-',
    originalData: rev,
  })),

  ...(revenueAndExpenses.admissions || []).map((rev) => ({
    id: rev._id,
    date: new Date(rev.createdAt).toISOString().split("T")[0],
    purpose: 'New Admission',
    amount: rev.studentDetails.admissionFees,
    transactionId: rev.paymentDetails?.razorpayOrderId?.slice(6) || '-',
    name: `${rev.studentDetails.firstName} ${rev.studentDetails.lastName}`,
    className: rev.studentDetails.classToJoin || '-',
    section: '-',
    originalData: rev,
  })),
];






  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Accounts</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-xl">
            <span className="text-base xl:text-[17px]">Home</span> {'>'}{' '}
            <span className="text-base xl:text-[17px] font-medium text-[#146192]">Accounts</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={() => setIsIncomeModalOpen(true)} className="bg-[#146192] text-white px-4 py-2 rounded">+Add Income</button>


        {/* Modal */}
        {/* Modal */}
        {isIncomeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-lg font-semibold">Add Income</h2>
                <button
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="text-red-500 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddIncome} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={incomeFormData.amount}
                      onChange={handleIncomeChange}
                      placeholder="eg. ₹300"
                      className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Date</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={incomeFormData.date}
                      onChange={handleIncomeChange}
                      className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Purpose</label>
                    <select
                      name="purpose"
                      value={incomeFormData.purpose}
                      onChange={handleIncomeChange}
                      className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                      required
                    >
                      <option value="">Select Purpose</option>
                      <option value="Fees">Fees</option>
                      {/* <option value="Transportation">Transportation</option> */}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Source of Income</label>
                    <select
                      name="source"
                      value={incomeFormData.source}
                      onChange={handleIncomeChange}
                      className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="student">Student</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Reason field (if purpose is "Other") */}
                {incomeFormData.purpose === "Other" && (
                  <div>
                    <label className="block text-sm mb-1">Reason</label>
                    <textarea
                      name="reason"
                      value={incomeFormData.reason}
                      onChange={handleIncomeChange}
                      rows="2"
                      placeholder="Optional"
                      className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                    />
                  </div>
                )}

                {/* Student fields (if source is "student") */}
                {incomeFormData.source === "student" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Name of Student</label>
                        <input
                          type="text"
                          name="fullname"
                          value={incomeFormData.fullname}
                          onChange={handleIncomeChange}
                          placeholder="Enter Name"
                          className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Class</label>
                        <input
                          type="text"
                          name="className"
                          value={incomeFormData.className}
                          onChange={handleIncomeChange}
                          className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Section</label>
                        <input
                          type="text"
                          name="section"
                          value={incomeFormData.section}
                          onChange={handleIncomeChange}
                          className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Registration No.</label>
                        <input
                          type="text"
                          name="registrationNumber"
                          value={incomeFormData.registrationNumber}
                          onChange={handleIncomeChange}
                          className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Transaction ID</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={incomeFormData.transactionId}
                          onChange={handleIncomeChange}
                          className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Other source fields (if source is "other") */}
                {incomeFormData.source === "other" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Name</label>
                      <input
                        type="text"
                        name="fullname"
                        value={incomeFormData.fullname}
                        onChange={handleIncomeChange}
                        placeholder="Enter Name"
                        className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Organization Name</label>
                      <input
                        type="text"
                        name="organization"
                        value={incomeFormData.organization}
                        onChange={handleIncomeChange}
                        placeholder="Enter Organization"
                        className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Transaction ID</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={incomeFormData.transactionId}
                        onChange={handleIncomeChange}
                        className="w-full border rounded px-3 py-2 bg-[#1461921A]"
                      />
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={resetIncomeForm}
                    className="text-blue-600 px-4 py-2 border border-blue-600 rounded"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        <button className="bg-[#146192] text-white px-4 py-2 rounded" onClick={() => setIsAddModalOpen(true)}>
          + Add Expense
        </button>
      </div>
      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-start border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold border-b-2 border-primary">Add Expenses</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-red-500 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={expenseFormData.date}
                    onChange={handleExpenseChange}
                    className="w-full px-3 py-2 border rounded bg-blue-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={expenseFormData.amount}
                    onChange={handleExpenseChange}
                    className="w-full px-3 py-2 border rounded bg-blue-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <input
                    type="number"
                    name="classs"
                    value={expenseFormData.classs}
                    onChange={handleExpenseChange}
                    className="w-full px-3 py-2 border rounded bg-blue-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={expenseFormData.section}
                    onChange={handleExpenseChange}
                    className="w-full px-3 py-2 border rounded bg-blue-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={expenseFormData.purpose}
                  onChange={handleExpenseChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded bg-blue-50"
                  required
                ></textarea>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setExpenseFormData({ date: '', amount: '', classs: '', section: '', purpose: '' })}
                  className="px-4 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <div
          className={`p-4 rounded-xl shadow-md cursor-pointer border-2 transition-all duration-200 ${selectedChartSection === 'revenue' ? 'bg-blue-50 border-blue-500' : 'bg-white border-transparent'
            }`}
          onClick={() => setSelectedChartSection((prev) => (prev === 'revenue' ? null : 'revenue'))}
        >
          <h3 className="font-semibold text-left mb-2 text-[#1f2d3d] text-2xl ">Yearly Revenue:</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>

          <ul className="mt-4 space-y-1 text-sm px-4">
            <li>
              <span className="inline-block w-3 h-3 bg-[#4CAF50] rounded-full mr-2"></span>
              Fees - ₹{accountsArray.reduce((total, acc) => total + acc.totalFeesCollected, 0)}
            </li>
            <li>
              <span className="inline-block w-3 h-3 bg-[#FFC107] rounded-full mr-2"></span>
              Admission - ₹{accountsArray.reduce((total, acc) => total + acc.totalAdmissionFees, 0)}
            </li>
            {/* <li>
              <span className="inline-block w-3 h-3 bg-[#FF928A] rounded-full mr-2"></span>
              Transportation - ₹{accountsArray.reduce((total, acc) => total + acc.totalTransportationFees, 0)}
            </li> */}
            <li>
              <span className="inline-block w-3 h-3 bg-[#8979FF] rounded-full mr-2"></span>
              Other - ₹{accountsArray.reduce((total, acc) => total + acc.otherIncome, 0)}
            </li>
            <li>
              <span className="inline-block w-3 h-3 bg-[#2196F3] rounded-full mr-2"></span>
              Total Expenses - ₹{accountsArray.reduce((total, acc) => total + acc.totalExpenses, 0)}
            </li>

          </ul>
        </div>

        {/* Monthly Expenses Line Chart */}
        <div
          className={`p-4 rounded-xl shadow-md cursor-pointer border-2 transition-all duration-200 ${selectedChartSection === 'expenses' ? 'bg-blue-50 border-blue-500' : 'bg-white border-transparent'
            }`}
          onClick={() => setSelectedChartSection((prev) => (prev === 'expenses' ? null : 'expenses'))}
        >
          <h3 className="font-semibold text-left text-[#1f2d3d]  mb-2 text-2xl">Monthly Expenses</h3>
          <div className="h-64 ">
            <Line data={lineChartData} options={lineChartOptions} />

          </div>
        </div>
      </div>

     <div className="mt-6">
  <h2 className="font-semibold text-lg border-b-2 border-[#146192] inline-block mb-4">
    Income Generated
  </h2>

  <div className="flex flex-col sm:flex-row gap-4">
    {cards.map(({ title, data }, idx) => (
      <div
        key={idx}
        className="flex-1 bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
      >
        {/* Circular progress */}
        <div className="relative w-16 h-16">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-yellow-400"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${data.percentage}, 100`}
              d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <School className="w-6 h-6 text-[#146192]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-left">
          <p className="text-sm text-[#146192] font-semibold">{title}</p>
          <p className="text-xs text-gray-500">{data.month}</p>
          <p className="text-2xl font-bold text-[#146192]">₹{data.value}</p>
        </div>
      </div>
    ))}
  </div>
</div>




      {/* Expenses Table */}
      <div className="overflow-x-auto mt-8 ">
        {selectedChartSection === 'expenses' && (
          <div className="  p-4">
            <h2 className="text-xl font-medium text-[#146192] mb-2"> School Expenses</h2>

            {/* Optional Filters */}
            <div className="flex flex-wrap gap-4 justify-end mb-2">
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>Purpose</option>
                {/* Add dynamic purpose options */}
              </select>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>Class</option>
                {/* Add dynamic class options */}
              </select>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>Section</option>
                {/* Add dynamic section options */}
              </select>
            </div>

            <div className="overflow-auto rounded-xl shadow-md">
              <table className="min-w-full text-sm">
                <thead className="bg-[#146192] text-white">
                  <tr className="text-center">
                    <th className="p-2 border">DATE</th>
                    <th className="p-2 border">EXPENSES</th>
                    <th className="p-2 border">AMOUNT</th>
                    <th className="p-2 border">CLASS</th>
                    <th className="p-2 border">SECTION</th>
                    <th className="p-2 border">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueAndExpenses.expenses?.length > 0 ? (
                    revenueAndExpenses.expenses.map((row) => (
                      <tr key={row._id} className="text-center border-b hover:bg-gray-50">
                        <td className="p-2 border">
                          {new Date(row.date).toISOString().split('T')[0]}
                        </td>
                        <td className="p-2 border">{row.purpose}</td>
                        <td className="p-2 border">₹{row.amount}</td>
                        <td className="p-2 border">{row.class || '-'}</td>
                        <td className="p-2 border">{row.section || '-'}</td>
                        <td className="p-2 border">
                          <div className="flex justify-center gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-lg"
                              onClick={() => handleEditExpense(row)}
                            >
                              ✏️
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 text-lg"
                              onClick={() => handleDeleteExpense(row)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">
                        No expense records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

     {selectedChartSection === 'revenue' && (
  <div className="overflow-x-auto mt-8">
    <h2 className="text-xl font-medium text-[#146192] mb-2">School Income</h2>

    {/* Filters */}
    <div className="flex flex-wrap gap-4 justify-end mb-2">
      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
        <option>Purpose</option>
      </select>
      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
        <option>Class</option>
      </select>
      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
        <option>Section</option>
      </select>
    </div>

  {/* Revenue Table */}
{/* Revenue Table */}
<div className="overflow-auto rounded-xl shadow-md">
  <table className="min-w-full text-sm">
    <thead className="bg-[#146192] text-white">
      <tr className="text-center">
        <th className="p-2 border">DATE</th>
        <th className="p-2 border">PURPOSE</th>
        <th className="p-2 border">AMOUNT</th>
        <th className="p-2 border">TRANSACTION ID</th>
        <th className="p-2 border">NAME</th>
        <th className="p-2 border">CLASS</th>
        <th className="p-2 border">SECTION</th>
        <th className="p-2 border">EDIT</th>
      </tr>
    </thead>

   <tbody>
  {allRevenueData.length === 0 ? (
    <tr>
      <td colSpan="8" className="p-4 text-center text-gray-500">
        No revenue records available.
      </td>
    </tr>
  ) : (
    allRevenueData.map((rev) => {
      const incomeId = rev.originalData?._id;
      const historyData = updatedIncomeHistoryById?.[incomeId] || [];
      const isExpanded = expandedIncomeId === incomeId;
      const isLoading = loadingIncomeId === incomeId;

      return (
        <React.Fragment key={incomeId}>
          {/* Main Revenue Row */}
          <tr
            onClick={() => handleRowClick(incomeId)}
            className="cursor-pointer hover:bg-gray-100 text-center"
          >
            <td className="p-2 border">{rev.date}</td>
            <td className="p-2 border">{rev.purpose}</td>
            <td className="p-2 border">₹{rev.amount}</td>
            <td className="p-2 border">{rev.transactionId}</td>
            <td className="p-2 border">{rev.name}</td>
            <td className="p-2 border">{rev.className}</td>
            <td className="p-2 border">{rev.section}</td>
            <td className="p-2 border">
              <button
                className="text-blue-600 hover:text-blue-800 text-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditData(rev.originalData);
                  setIsEditOpen(true);
                }}
              >
                ✏️
              </button>
            </td>
          </tr>

          {/* Expanded History Row(s) */}
          {isExpanded &&
            (isLoading ? (
              <tr>
                <td colSpan="8" className="text-center p-3 text-sm text-gray-500">
                  Loading history...
                </td>
              </tr>
            ) : historyData.length > 0 ? (
              historyData.map((entry, index) => (
                <tr
                  key={index}
                  className="text-center text-sm text-gray-700 bg-gray-400"
                > 
                  {/* <td className="p-2 border"> */}
                   <td className="p-2">
                    {new Date(entry.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 ">{entry.previousData?.purpose || "-"}</td>
                  <td className="p-2 ">₹{entry.previousData?.amount || "-"}</td>
                  <td className="p-2 ">
                    {entry.previousData?.paymentDetails?.razorpayOrderId || "-"}
                  </td>
                  <td className="p-2 ">{rev.name}</td>
                  <td className="p-2 ">{entry.previousData?.class || "-"}</td>
                  <td className="p-2 ">{entry.previousData?.section || "-"}</td>
                  <td className="p-2  italic text-gray-500">-</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-3 text-sm italic text-gray-500 bg-gray-50">
                  No update history found.
                </td>
              </tr>
            ))}
        </React.Fragment>
      );
    })
  )}
</tbody>

  </table>
</div>

  </div>
)}

{/* Edit Modal */}
{isEditOpen && editData && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-2">
    <div className="bg-white p-6 rounded shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-center text-[#262626]">Edit Income</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editData.reasonForEdit?.trim()) {
            alert("Reason For Edit is required.");
            return;
          }
          await dispatch(editIncome({ incomeId: editData._id, incomeData: editData }));
          setIsEditOpen(false);
        }}
      >
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.date?.substring(0, 10)}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Purpose</label>
              <input
                type="text"
                name="purpose"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.purpose}
                onChange={(e) => setEditData({ ...editData, purpose: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={
                  editData.transactionId ||
                  editData.paymentDetails?.razorpayOrderId ||
                  ''
                }
                onChange={(e) => setEditData({ ...editData, transactionId: e.target.value })}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 px-2">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.fullname || editData.studentId?.studentProfile?.fullname || ''}
                onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Class</label>
              <input
                type="text"
                name="class"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.class}
                onChange={(e) => setEditData({ ...editData, class: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Section</label>
              <input
                type="text"
                name="section"
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.section}
                onChange={(e) => setEditData({ ...editData, section: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Reason For Edit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reasonForEdit"
                required
                className="w-full border px-3 py-2 rounded bg-[#1461921A]"
                value={editData.reasonForEdit || ''}
                onChange={(e) => setEditData({ ...editData, reasonForEdit: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setIsEditOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#146192] text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      {/* Teacher Requests Table */}
      <div className="overflow-x-auto mt-8  ">
        <h2 className="text-xl font-medium text-[#146192] mb-2">Expenses Requests</h2>
        {/* Table Header Filters (Optional, if you already have them elsewhere skip this) */}
        <div className="flex flex-wrap gap-4 justify-end mb-2">
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>Item Name</option>
            {/* Add dynamic item filter options if needed */}
          </select>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>Class</option>
            {/* Add dynamic class filter options */}
          </select>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>Section</option>
            {/* Add dynamic section filter options */}
          </select>
        </div>

        {/* Teacher Requests Table */}
        <div className="overflow-auto rounded-xl shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-[#146192] text-white">
              <tr className="text-center">
                <th className="p-2 border">ITEM NAME</th>
                <th className="p-2 border">EXPENSES</th>
                <th className="p-2 border">CLASS</th>
                <th className="p-2 border">SECTION</th>
                <th className="p-2 border">AMOUNT</th>
                <th className="p-2 border">STATUS</th>
                <th className="p-2 border">EDIT</th>
              </tr>
            </thead>
            <tbody>
              {teacherRequests.map((request) => (
                <tr key={request._id} className="text-center border-b hover:bg-gray-50">
                  <td className="p-2 border">{request.item || '-'}</td>
                  <td className="p-2 border">{request.purpose}</td>
                  <td className="p-2 border">{request.class}</td>
                  <td className="p-2 border">{request.section}</td>
                  <td className="p-2 border">₹{request.amount}</td>
                  <td className="p-2 border">
                    <span className={`font-semibold ${request.status === 'success' ? 'text-green-500' : 'text-yellow-600'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-lg"
                      onClick={() => openEditModal(request)}
                    >
                      <i className="fas fa-edit" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-1/3">
            <h3 className="font-medium text-xl mb-4">Edit Teacher Request</h3>
            <form onSubmit={handleUpdateRequest}>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">Status</label>
                <select
                  id="status"
                  className="w-full px-4 py-2 mt-2 border rounded-md"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              {statusInput === 'success' && (
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-gray-700">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    className="w-full px-4 py-2 mt-2 border rounded-md"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                  />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 mr-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#146192] text-white px-4 py-2 rounded-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xl">Edit Expenses</h3>
              <button
                className="text-red-500 text-2xl font-bold"
                onClick={() => setEditModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={submitEditExpense}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1 ">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[#1461921A] rounded-md"
                    value={editFormData.date}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-[#1461921A] rounded-md"
                    value={editFormData.amount}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Class</label>
                  <select
                    className="w-full px-4 py-2 bg-[#1461921A] rounded-md"
                    value={editFormData.class}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, class: e.target.value })
                    }
                  >
                    <option value="">Select Class</option>
                    {[...Array(12).keys()].map((num) => (
                      <option key={num} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Section</label>
                  <select
                    className="w-full px-4 py-2 bg-[#1461921A] rounded-md"
                    value={editFormData.section}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, section: e.target.value })
                    }
                  >
                    <option value="">Select Section</option>
                    {['A', 'B', 'C', 'D'].map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Purpose</label>
                <textarea
                  className="w-full px-4 py-2 bg-[#1461921A] rounded-md"
                  rows={3}
                  value={editFormData.purpose}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, purpose: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-6 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Accounts;