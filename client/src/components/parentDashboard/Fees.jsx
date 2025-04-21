import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeesReceipts, fetchChildren, payFees } from '../../redux/parent/feesSlice';
import { FaMoneyBillWave, FaSpinner, FaDownload, FaTimes } from 'react-icons/fa';
import Header from './layout/Header';
import { jsPDF } from 'jspdf';

function Fees() {
  const dispatch = useDispatch();
  const { feesReceipts, children, loading, error } = useSelector((state) => state.fees);

  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Fees');
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    dispatch(fetchFeesReceipts());
    dispatch(fetchChildren());
  }, [dispatch]);

  const filteredReceipts = feesReceipts.filter((receipt) => {
    let matches = true;
    if (studentName && receipt.studentId.studentProfile.fullname !== studentName) {
      matches = false;
    }
    if (date && new Date(receipt.createdAt).toLocaleDateString() !== date) {
      matches = false;
    }
    return matches;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <h3>Error: {error}</h3>
      </div>
    );
  }

  const downloadPDF = (receipt) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor('#146192');
    doc.text('ShikshaMitra School', 105, 20, null, null, 'center');

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('Fee Receipt', 105, 30, null, null, 'center');

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    const spacing = 10;
    let y = 45;

    doc.text(`Date:`, 20, y);
    doc.text(new Date(receipt.createdAt).toLocaleDateString(), 60, y);
    y += spacing;

    doc.text(`Transaction ID:`, 20, y);
    doc.text(receipt.transactionId || 'N/A', 60, y);
    y += spacing;

    doc.text(`Student Name:`, 20, y);
    doc.text(receipt.studentId.studentProfile.fullname, 60, y);
    y += spacing;

    doc.text(`Class:`, 20, y);
    doc.text(receipt.studentId.class?.name || 'N/A', 60, y);
    y += spacing;

    doc.text(`Amount Paid:`, 20, y);
    doc.text(`$${receipt.amount}`, 60, y);
    y += spacing;

    doc.text(`Pending Fees:`, 20, y);
    doc.text(`$${receipt.pendingAmount}`, 60, y);
    y += spacing;

    doc.text(`Payment Status:`, 20, y);
    doc.text(receipt.paymentDetails.status, 60, y);
    y += spacing * 2;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your payment.', 105, y, null, null, 'center');

    const filename = `Receipt_${receipt.studentId.studentProfile.fullname}_${new Date(receipt.createdAt).toLocaleDateString()}.pdf`;
    doc.save(filename);
  };

  const openPaymentForm = (receipt) => {
    setSelectedReceipt(receipt);
    setAmount(receipt.amount);
    setPurpose('Fees');
    setShowForm(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(payFees());
    setShowForm(false);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mx-4 mt-20 md:ml-72 flex-wrap">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Fees</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192]">Fees</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Fees Icon Heading */}
      <div className="flex items-center mx-4 my-4 md:ml-72">
        <FaMoneyBillWave className="text-[#146192] mr-2" size={26} />
        <h1 className="text-xl font-semibold text-[#121313]">Fees Details</h1>
      </div>

      {/* Filters & Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mx-4 md:ml-72 my-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192] w-full sm:w-auto"
          >
            <option value="">Student Name</option>
            {children.map((child) => (
              <option key={child._id} value={child.studentProfile.fullname}>
                {child.studentProfile.fullname}
              </option>
            ))}
          </select>

          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192] w-full sm:w-auto"
          >
            <option value="">Date</option>
            {[...new Set(feesReceipts.map((r) => new Date(r.createdAt).toLocaleDateString()))].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => openPaymentForm(filteredReceipts[0])}
          className="bg-[#146192] text-white px-6 py-2 rounded-lg hover:bg-[#0a4e6f] w-full sm:w-auto"
        >
          Pay Now
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block mx-4 md:ml-64 bg-white p-4 rounded-lg overflow-x-auto">
        <table className="w-full table-auto border border-gray-600 text-sm">
          <thead className="bg-[#1461924F] text-[#146192]">
            <tr>
              {["Date", "Student Name", "Amount", "Pending Fees", "Payment Status", "Transaction ID", "Receipt Download"].map((col, i) => (
                <th key={i} className={`text-center font-semibold border-b border-black ${i < 6 ? 'border-r' : ''} py-3 px-2`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((receipt) => (
              <tr key={receipt._id}>
                <td className="text-center border-black border-r py-2 px-2">{new Date(receipt.createdAt).toLocaleDateString()}</td>
                <td className="text-center border-black border-r py-2 px-2">{receipt.studentId.studentProfile.fullname}</td>
                <td className="text-center border-black border-r py-2 px-2">${receipt.amount}</td>
                <td className="text-center border-black border-r py-2 px-2">${receipt.pendingAmount}</td>
                <td className="text-center border-black border-r py-2 px-2">{receipt.paymentDetails.status}</td>
                <td className="text-center border-black border-r py-2 px-2">{receipt.transactionId || 'N/A'}</td>
                <td className="text-center py-2 px-2">
                  <button
                    className="bg-[#146192] text-white px-3 py-1 rounded hover:bg-[#0a4e6f]"
                    onClick={() => downloadPDF(receipt)}
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden mx-4 flex flex-col gap-4">
        {filteredReceipts.map((receipt) => (
          <div key={receipt._id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm text-sm">
            <div className="mb-1"><strong>Date:</strong> {new Date(receipt.createdAt).toLocaleDateString()}</div>
            <div className="mb-1"><strong>Student:</strong> {receipt.studentId.studentProfile.fullname}</div>
            <div className="mb-1"><strong>Amount:</strong> ${receipt.amount}</div>
            <div className="mb-1"><strong>Pending:</strong> ${receipt.pendingAmount}</div>
            <div className="mb-1"><strong>Status:</strong> {receipt.paymentDetails.status}</div>
            <div className="mb-1"><strong>Transaction ID:</strong> {receipt.transactionId || 'N/A'}</div>
            <button
              className="mt-3 bg-[#146192] text-white px-4 py-2 rounded w-full hover:bg-[#0a4e6f]"
              onClick={() => downloadPDF(receipt)}
            >
              <FaDownload className="inline mr-2" /> Download Receipt
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl mb-4">Pay Fees</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Student Name</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                >
                  <option value="">Select Student</option>
                  {children.map((child) => (
                    <option key={child._id} value={child.studentProfile.fullname}>
                      {child.studentProfile.fullname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700">Amount</label>
                <input
                  className="w-full p-2 border rounded-lg"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700">Purpose</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                >
                  <option value="Fees">Fees</option>
                  <option value="Inventory">Inventory</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#146192] text-white px-6 py-2 rounded-lg">
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fees;
