import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../../redux/parent/expensesSlice';
import Header from './layout/Header';
import { FaMoneyBillWave, FaCheck, FaTimes, FaDownload, FaSpinner } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

function Expenses() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.expenses);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const students = [
    ...new Set(
      expenses.map((exp) => {
        const fullname =
          exp?.studentId?.studentProfile?.fullname ||
          exp?.studentId?.fullname ||
          exp?.fullname ||
          'Unknown';
        return fullname;
      })
    ),
  ];

  const transactionIds = selectedStudent
    ? expenses
        .filter(exp => {
          const fullname = exp?.studentId?.studentProfile?.fullname || '';
          return fullname === selectedStudent;
        })
        .map(exp => exp?.paymentDetails?.razorpayOrderId || 'Cash')
        .filter((v, i, a) => a.indexOf(v) === i)
    : expenses
        .map(exp => exp?.paymentDetails?.razorpayOrderId || 'Cash')
        .filter((v, i, a) => a.indexOf(v) === i);

  const dates = selectedTransactionId
    ? expenses
        .filter(exp => (exp?.paymentDetails?.razorpayOrderId || 'Cash') === selectedTransactionId)
        .map(exp => new Date(exp.createdAt).toLocaleDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
    : selectedStudent
    ? expenses
        .filter(exp => {
          const fullname = exp?.studentId?.studentProfile?.fullname || '';
          return fullname === selectedStudent;
        })
        .map(exp => new Date(exp.createdAt).toLocaleDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
    : expenses
        .map(exp => new Date(exp.createdAt).toLocaleDateString())
        .filter((v, i, a) => a.indexOf(v) === i);

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
    setSelectedTransactionId('');
    setSelectedDate('');
  };

  const handleTransactionIdChange = (e) => {
    setSelectedTransactionId(e.target.value);
    setSelectedDate('');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const fullname = expense?.studentId?.studentProfile?.fullname || '';
    const transactionId = expense?.paymentDetails?.razorpayOrderId || 'Cash';
    const matchesStudent = !selectedStudent || fullname === selectedStudent;
    const matchesTransactionId = !selectedTransactionId || transactionId === selectedTransactionId;
    const matchesDate = !selectedDate || new Date(expense.createdAt).toLocaleDateString() === selectedDate;
    return matchesStudent && matchesTransactionId && matchesDate;
  });

  const handleDownloadReceipt = (expense) => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Receipt for Payment', 20, 30);
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      let yOffset = 40;
      const headers = ['Date', 'Student Name', 'Purpose', 'Amount', 'Payment Status', 'Transaction ID'];
      const columnWidths = [20, 30, 30, 25, 35, 40];

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      headers.forEach((header, index) => {
        doc.text(header, 20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yOffset);
      });

      yOffset += 5;
      doc.setLineWidth(0.2);
      doc.line(20, yOffset, 190, yOffset);
      yOffset += 5;

      const transactionId = expense?.paymentDetails?.razorpayOrderId || 'Cash';

      const rowData = [
        new Date(expense.createdAt).toLocaleDateString(),
        expense?.studentId?.studentProfile?.fullname || 'Unknown',
        expense.purpose,
        `$${expense.amount}`,
        expense?.paymentDetails?.status === 'success' ? 'Verified' : 'Pending',
        transactionId,
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      rowData.forEach((data, index) => {
        doc.text(data, 20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yOffset);
      });

      yOffset += 10;
      doc.setLineWidth(0.2);
      doc.line(20, yOffset, 190, yOffset);

      yOffset += 15;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('For inquiries, contact: info@institution.com', 20, yOffset);
      doc.text('Phone: +123 456 7890', 20, yOffset + 5);

      const filename = `${transactionId}_receipt_${rowData[1].replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('An error occurred while generating the receipt.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mx-4 md:mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-black xl:text-[38px]">Expenses</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[120px] md:w-[150px]" />
          <h1 className="mt-2 text-sm md:text-xl">
            <span className="xl:text-[17px]">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] font-medium text-[#146192]">Expenses</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-8 my-4 space-y-4 md:space-y-0  ">
        <div className="flex items-center">
          <FaMoneyBillWave className="text-[#146192] mr-2" size={30} />
          <h1 className="text-lg md:text-xl font-semibold text-[#121313]">Expenses Details</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select value={selectedStudent} onChange={handleStudentChange} className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192]">
            <option value="">Student Name</option>
            {students.map((studentName) => (
              <option key={studentName} value={studentName}>{studentName}</option>
            ))}
          </select>
          <select value={selectedTransactionId} onChange={handleTransactionIdChange} className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192]">
            <option value="">Transaction Id</option>
            {transactionIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          <select value={selectedDate} onChange={handleDateChange} className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192]">
            <option value="">Date</option>
            {dates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="my-8 mx-4 md:mx-8">
        {loading ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin text-yellow-500" size={24} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No matching expenses found.</div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto bg-white p-4 rounded-lg  md:ml-64">
              <table className="w-full table-auto border border-gray-600 ">
                <thead className="bg-[#1461924F] text-sm text-[#146192]">
                  <tr>
                    {['Date', 'Student Name', 'Purpose', 'Amount', 'Payment Status', 'Transaction ID', 'Receipt Download'].map((header, idx) => (
                      <th key={idx} className="text-center font-semibold border-b border-black border-r py-4 px-4">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td className="text-center border-black border-r py-2 px-4">{new Date(expense.createdAt).toLocaleDateString()}</td>
                      <td className="text-center border-black border-r py-2 px-4">{expense?.studentId?.studentProfile?.fullname || 'Unknown'}</td>
                      <td className="text-center border-black border-r py-2 px-4">{expense.purpose}</td>
                      <td className="text-center border-black border-r py-2 px-4">{expense.amount}</td>
                      <td className="text-center border-black border-r py-2 px-4">
                        <div className="flex justify-center items-center">
                          {expense?.paymentDetails?.status === 'success' ? (
                            <>
                              <FaCheck className="text-green-600 mr-2" /> Verified
                            </>
                          ) : (
                            <>
                              <FaTimes className="text-red-600 mr-2" /> Pending
                            </>
                          )}
                        </div>
                      </td>
                      <td className="text-center border-black border-r py-2 px-4">
                        {expense?.paymentDetails?.razorpayOrderId || 'Cash'}
                      </td>
                      <td className="text-center py-2 px-4">
                        <button onClick={() => handleDownloadReceipt(expense)} className="flex items-center px-4 py-2 bg-[#146192] text-white rounded-lg">
                          <FaDownload className="mr-2" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden space-y-6">
              {filteredExpenses.map((expense) => (
                <div key={expense._id} className="border rounded-lg overflow-hidden shadow-md">
                  {[
                    ['Date', new Date(expense.createdAt).toLocaleDateString()],
                    ['Student Name', expense?.studentId?.studentProfile?.fullname || 'Unknown'],
                    ['Purpose', expense.purpose],
                    ['Amount', expense.amount],
                    ['Payment Status', expense?.paymentDetails?.status === 'success' ? '✔ Verified' : '⨉ Pending'],
                    ['Transaction ID', expense?.paymentDetails?.razorpayOrderId || 'Cash'],
                  ].map(([label, value], i) => (
                    <div key={i} className={`flex justify-between px-4 py-2 text-sm ${i % 2 === 0 ? 'bg-[#d5e7f0]' : 'bg-white'}`}>
                      <span className="font-medium text-[#146192]">{label}</span>
                      <span className="text-right">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center bg-[#d5e7f0] px-4 py-2">
                    <span className="font-medium text-[#146192]">Receipt Download</span>
                    <button onClick={() => handleDownloadReceipt(expense)} className="text-[#146192] flex items-center">
                      <FaDownload className="mr-2" /> <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Expenses;
