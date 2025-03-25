import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeesReceipts, fetchChildren, payFees } from '../../redux/parent/feesSlice'; // Import the actions
import { FaMoneyBillWave, FaSpinner, FaDownload } from 'react-icons/fa';
import Header from './layout/Header';
import { jsPDF } from 'jspdf'; // Import jsPDF

function Fees() {
  const dispatch = useDispatch();
  const { feesReceipts, children, loading, error } = useSelector((state) => state.fees);

  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');

  // Dispatch actions on component mount
  useEffect(() => {
    dispatch(fetchFeesReceipts());
    dispatch(fetchChildren());
  }, [dispatch]);

  // Filter feesReceipts based on selected values
  const filteredReceipts = feesReceipts.filter((receipt) => {
    let matches = true;

    // Filter by Student Name
    if (studentName && receipt.studentId.studentProfile.fullname !== studentName) {
      matches = false;
    }

    // Filter by Date (if selected)
    if (date && new Date(receipt.createdAt).toLocaleDateString() !== date) {
      matches = false;
    }

    return matches;
  });

  // Display a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  // Display error message if there is an error
  if (error) {
    return (
      <div className="text-red-500 text-center">
        <h3>Error: {error}</h3>
      </div>
    );
  }

  // Function to download the fees table as a PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Fee Receipts', 20, 20);

    doc.setFontSize(12);
    doc.text('Date', 20, 40);
    doc.text('Student Name', 50, 40);
    doc.text('Amount', 120, 40);
    doc.text('Pending Fees', 160, 40);
    doc.text('Payment Status', 200, 40);
    doc.text('Transaction ID', 250, 40);

    let yOffset = 50;

    // Loop through the filtered receipts and add them to the PDF
    filteredReceipts.forEach((receipt) => {
      doc.text(new Date(receipt.createdAt).toLocaleDateString(), 20, yOffset);
      doc.text(receipt.studentId.studentProfile.fullname, 50, yOffset);
      doc.text(`$${receipt.amount}`, 120, yOffset);
      doc.text(`$${receipt.pendingAmount}`, 160, yOffset);
      doc.text(receipt.paymentDetails.status, 200, yOffset);
      doc.text(receipt.transactionId || 'N/A', 250, yOffset);

      yOffset += 10; // Move to the next row
    });

    // Save the PDF
    doc.save('fee_receipts.pdf');
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Fees</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Fees</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Fees Heading with Icon below the header */}
      <div className="flex justify-between items-center mx-8 my-4">
        <div className="flex items-center">
          <FaMoneyBillWave className="text-[#146192] mr-2" size={30} /> {/* Icon for Fees */}
          <h1 className="text-xl font-semibold text-[#121313]">Fees Details</h1>
        </div>
      </div>

      {/* Pay Now Button placed above the dropdowns */}
      <div className="flex justify-end mx-8 my-4">
        <button
          className="bg-[#146192] text-white px-6 py-2 rounded-lg hover:bg-[#0a4e6f]"
          onClick={() => dispatch(payFees())} // Assuming `payFees` is an action for paying the fees
        >
          Pay Now
        </button>
      </div>

      {/* Dropdowns for Student and Date */}
      <div className="flex justify-end space-x-4 mx-8 my-4">
        {/* Student Name Dropdown */}
        <div className="flex items-center text-sm text-[#146192]">
          <select
            id="student-dropdown"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="px-4 py-2 rounded-lg w-36 border border-[#00000091]"
          >
            <option value="">Student Name</option>
            {children.map((child) => (
              <option key={child._id} value={child.studentProfile.fullname}>
                {child.studentProfile.fullname}
              </option>
            ))}
          </select>
        </div>

        {/* Date Dropdown */}
        <div className="flex items-center text-sm text-[#146192]">
          <select
            id="date-dropdown"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-lg w-36 border border-[#00000091]"
          >
            <option value="">Date</option>
            {feesReceipts
              .map((receipt) => new Date(receipt.createdAt).toLocaleDateString())
              .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
              .map((uniqueDate) => (
                <option key={uniqueDate} value={uniqueDate}>
                  {uniqueDate}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Fee Receipts Table */}
      <div className="my-8 mx-8">
        <div className="overflow-x-auto bg-white p-4 rounded-lg">
          <table className="w-full table-auto border border-gray-600">
            <thead className="bg-[#1461924F] text-sm text-[#146192]">
              <tr>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Date</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Student Name</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Amount</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Pending Fees</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Payment Status</th>
                <th className="text-center font-semibold border-b border-black border-r py-4 px-4">Transaction ID</th> {/* Added Transaction ID column */}
                <th className="text-center font-semibold border-b border-black py-2 px-4">Receipt Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((receipt) => (
                <tr key={receipt._id}>
                  <td className="text-center border-black border-r py-2 px-4">{new Date(receipt.createdAt).toLocaleDateString()}</td>
                  <td className="text-center border-black border-r py-2 px-4">{receipt.studentId.studentProfile.fullname}</td>
                  <td className="text-center border-black border-r py-2 px-4">${receipt.amount}</td>
                  <td className="text-center border-black border-r py-2 px-4">${receipt.pendingAmount}</td>
                  <td className="text-center border-black border-r py-2 px-4">{receipt.paymentDetails.status}</td>
                  <td className="text-center border-black border-r py-2 px-4">{receipt.transactionId || 'N/A'}</td> {/* Display Transaction ID */}
                  <td className="text-center py-2 px-4">
                    <button
                      className="bg-[#146192] text-white px-4 py-1 rounded hover:bg-[#0a4e6f]"
                      onClick={downloadPDF} // Call downloadPDF function when clicked
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Fees;