import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAccounts,
  fetchRevenueAndExpenses,
  fetchTeacherRequests,
  updateTeacherRequest,
  editExpense,
  deleteExpense,
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

Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Accounts = () => {
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

  const pieChartRef = useRef();

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchRevenueAndExpenses());
    dispatch(fetchTeacherRequests());
  }, [dispatch]);


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


  const accountsArray = Array.isArray(accounts) ? accounts : [];

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  const pieChartData = {
    labels: ['Fees', 'Admission', 'Inventory'],
    datasets: [
      {
        data: [
          accountsArray.reduce((total, acc) => total + acc.totalFeesCollected, 0),
          accountsArray.reduce((total, acc) => total + acc.totalAdmissionFees, 0),
          accountsArray.reduce((total, acc) => total + acc.totalInventoryAmount, 0),
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
        borderWidth: 1,
      },
    ],
  };

  // Step 1: Define all 12 months in correct `monthYear` format
  const allMonths = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025',
    'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025',
    'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025',
  ];

  // Step 2: Create a map from your actual data
  const expensesMap = {};
  accountsArray.forEach(item => {
    expensesMap[item.monthYear] = item.totalExpenses;
  });

  // Step 3: Generate labels and data using all months
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
    interaction: {
      mode: 'index',
      intersect: false, // Show tooltip even if not directly over the point
    },
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
      legend: {
        display: true,
        position: 'top',
      },
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

  const handleDeleteExpense = async (row) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(row._id));
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      // Dispatch the delete action for teacher requests
      await dispatch(deleteTeacherRequest(requestId)); // Assume `deleteTeacherRequest` is correctly implemented in Redux
    }
  };

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
        <button className="bg-[#146192] text-white px-4 py-2 rounded">+ Add Revenue</button>
        <button className="bg-[#146192] text-white px-4 py-2 rounded">+ Add Expense</button>
      </div>

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
            <li>
              <span className="inline-block w-3 h-3 bg-[#2196F3] rounded-full mr-2"></span>
              Inventory - ₹{accountsArray.reduce((total, acc) => total + acc.totalInventoryAmount, 0)}
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
          {/* Reusable Card Component */}
          {['currentMonth', 'previousMonth'].map((key, index) => {
            const value = revenueAndExpenses?.[key]?.amount || 0;
            const month = revenueAndExpenses?.[key]?.month || '';
            const percentage = revenueAndExpenses?.[key]?.percentage || 0; // 0–100 expected

            return (
              <div
                key={key}
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
                      strokeDasharray={`${percentage}, 100`}
                      d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/icons/teacher-icon.svg" alt="icon" className="w-6 h-6" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-left">
                  <p className="text-sm text-[#146192] font-semibold">
                    {key === 'currentMonth' ? 'CURRENT MONTH' : 'PREVIOUS MONTH'}
                  </p>
                  <p className="text-xs text-gray-500">{month}</p>
                  <p className="text-2xl font-bold text-[#146192]">₹{value}</p>
                </div>
              </div>
            );
          })}
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
        <div className="overflow-x-auto mt-8 ">
          <h2 className="text-xl font-medium text-[#146192] mb-2">Revenue Table</h2>

          {/* Filters (Optional — Add if needed, like you did for Teacher Requests) */}
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
                {revenueAndExpenses.revenue?.length > 0 ? (
                  revenueAndExpenses.revenue.map((rev) => (
                    <tr key={rev._id} className="text-center border-b hover:bg-gray-50">
                      <td className="p-2 border">
                        {new Date(rev.createdAt).toISOString().split("T")[0]}
                      </td>
                      <td className="p-2 border">
                        {rev.purpose} {rev.itemName ? `(${rev.itemName})` : ''}
                      </td>
                      <td className="p-2 border">₹{rev.amount}</td>
                      <td className="p-2 border">
                        {rev.paymentDetails?.razorpayOrderId?.slice(6) || '-'}
                      </td>
                      <td className="p-2 border">
                        {rev.studentId?.studentProfile?.fullname || '-'}
                      </td>
                      <td className="p-2 border">{rev.class || '-'}</td>
                      <td className="p-2 border">{rev.section || '-'}</td>
                      <td className="p-2 border">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-lg"
                          onClick={() => handleEditExpense(rev)}
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No revenue records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
