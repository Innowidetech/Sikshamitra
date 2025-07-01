import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeesReceipts,
  fetchChildren,
  clearError,
  clearPaymentSuccess,
} from '../../redux/parent/feesSlice';
import { FaMoneyBillWave, FaDownload, FaTimes } from 'react-icons/fa';
import Header from './layout/Header';
import { jsPDF } from 'jspdf';

function Fees() {
  const dispatch = useDispatch();
  const { feesReceipts, children, loading, error, paymentSuccess } = useSelector((state) => state.fees);

  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Fees');
  const [itemName, setItemName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchFeesReceipts());
    dispatch(fetchChildren());
  }, [dispatch]);

  useEffect(() => {
    if (paymentSuccess) {
      dispatch(fetchFeesReceipts());
      dispatch(clearPaymentSuccess());
    }
  }, [paymentSuccess, dispatch]);

  // Load Razorpay SDK script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !amount || !purpose || !className || !section) {
      alert('Please fill all required fields.');
      return;
    }
    if (purpose === 'Other' && !itemName.trim()) {
      alert("Please provide a reason for 'Other' payments.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet.');
      return;
    }

    try {
      // Create order on backend
      const orderRes = await fetch('https://sikshamitra.onrender.com/api/parent/payFee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          studentName,
          amount: parseFloat(amount),
          purpose,
          className,
          section,
          ...(purpose === 'Other' && { reason: itemName.trim() }),
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || 'Failed to create order');
        return;
      }

      const options = {
        key: orderData.key || 'rzp_test_N2JZTugUiv8bEs', // your Razorpay key
        amount: orderData.newExpense.amount * 100 || amount * 100, // amount in paise
        currency: 'INR',
        name: 'ShikshaMitra School',
        description: purpose,
        order_id: orderData.newExpense.paymentDetails.razorpayOrderId || orderData.newExpense.paymentDetails.razorpayOrderId,
        handler: async (response) => {
//           console.log("🔍 Sending for verification:", {
//   razorpayOrderId: response.razorpay_order_id,
//   razorpayPaymentId: response.razorpay_payment_id,
//   razorpaySignature: response.razorpay_signature,
// });

const verifyRes = await fetch('https://sikshamitra.onrender.com/api/parent/verifyFeePayment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature,
  }),
});

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.message) {
            alert('✅ Payment successful and verified!');
            dispatch(fetchFeesReceipts());
          } else {
            alert('❌ Payment verification failed');
          }
        },
        prefill: {
          name: selectedStudent.studentProfile.fullname,
          email: selectedStudent.studentProfile.email || '',
          contact: selectedStudent.studentProfile.mobile || '',
        },
        theme: { color: '#146192' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // Reset form
      setShowForm(false);
      setAmount('');
      setPurpose('Fees');
      setItemName('');
      setStudentName('');
      setSelectedStudent(null);
      setClassName('');
      setSection('');
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed.');
    }
  };

  // Filter receipts by student and date
  const filteredReceipts = feesReceipts.filter((r) => {
    if (studentName && r.studentId.studentProfile.fullname !== studentName) return false;
    if (date && new Date(r.createdAt).toLocaleDateString() !== date) return false;
    return true;
  });

  // Generate PDF receipt
  const downloadPDF = (receipt) => {
    const doc = new jsPDF();
    doc.setFontSize(22).setTextColor('#146192').text('ShikshaMitra School', 105, 20, null, null, 'center');
    doc.setFontSize(16).setTextColor(40).text('Fee Receipt', 105, 30, null, null, 'center');
    doc.setLineWidth(0.5).line(20, 35, 190, 35);
    doc.setFontSize(12).setTextColor(0);

    let y = 45;
    const spacing = 10;
    const lines = [
      ['Date:', new Date(receipt.createdAt).toLocaleDateString()],
      ['Transaction ID:', receipt.transactionId || 'N/A'],
      ['Student Name:', receipt.studentId.studentProfile.fullname],
      ['Class:', receipt.class],
      ['Amount Paid:', `₹${receipt.amount}`],
      ['Pending Fees:', `₹${receipt.pendingAmount || 0}`],
      ['Payment Status:', receipt.paymentDetails.status],
    ];
    lines.forEach(([label, value]) => {
      doc.text(label, 20, y);
      doc.text(value.toString(), 60, y);
      y += spacing;
    });
    doc.setFontSize(10).setTextColor(100).text('Thank you for your payment.', 105, y + spacing, null, null, 'center');
    doc.save(`Receipt_${receipt.studentId.studentProfile.fullname}_${new Date(receipt.createdAt).toLocaleDateString()}.pdf`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mx-4 mt-20 md:ml-72 flex-wrap">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Fees</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {'>'} <span className="font-medium text-[#146192]">Fees</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex items-center mx-4 my-4 md:ml-72">
        <FaMoneyBillWave className="text-[#146192] mr-2" size={26} />
        <h1 className="text-xl font-semibold text-[#121313]">Fees Details</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mx-4 md:ml-72 my-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192]"
          >
            <option value="">Student Name</option>
            {children.map((c) => (
              <option key={c._id} value={c.studentProfile.fullname}>
                {c.studentProfile.fullname}
              </option>
            ))}
          </select>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192]"
          >
            <option value="">Date</option>
            {[...new Set(feesReceipts.map((r) => new Date(r.createdAt).toLocaleDateString()))].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#146192] text-white px-6 py-2 rounded-lg hover:bg-[#0a4e6f]">
          Pay Now
        </button>
      </div>

      {paymentSuccess && <div className="text-green-600 text-center font-semibold">Payment successful!</div>}
      {error && <div className="text-red-600 text-center font-semibold">Error: {error}</div>}

      {/* Desktop Table View */}
      <div className="hidden md:block mx-4 md:ml-64 bg-white p-4 rounded-lg overflow-x-auto">
        <table className="w-full table-auto border border-gray-600 text-sm">
          <thead className="bg-[#1461924F] text-[#146192]">
            <tr>
              {['Date', 'Student', 'Amount', 'Pending', 'Status', 'Txn ID', 'Download'].map((h, i) => (
                <th key={i} className={`text-center font-semibold border-b border-black ${i < 6 ? 'border-r' : ''} py-3 px-2`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((r) => (
              <tr key={r._id}>
                <td className="text-center border-black border-r py-2 px-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="text-center border-black border-r py-2 px-2">{r.studentId.studentProfile.fullname}</td>
                <td className="text-center border-black border-r py-2 px-2">₹{r.amount}</td>
                <td className="text-center border-black border-r py-2 px-2">₹{r.pendingAmount || 0}</td>
                <td className="text-center border-black border-r py-2 px-2">{r.paymentDetails.status}</td>
                <td className="text-center border-black border-r py-2 px-2">{r.transactionId || 'N/A'}</td>
                <td className="text-center py-2 px-2">
                  <button onClick={() => downloadPDF(r)} className="bg-[#146192] text-white px-3 py-1 rounded hover:bg-[#0a4e6f]">
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mx-4 flex flex-col gap-4">
        {filteredReceipts.map((r) => (
          <div key={r._id} className="bg-white border-gray-300 rounded-lg p-4 shadow-sm text-sm">
            <div className="mb-1">
              <strong>Date:</strong> {new Date(r.createdAt).toLocaleDateString()}
            </div>
            <div className="mb-1">
              <strong>Student:</strong> {r.studentId.studentProfile.fullname}
            </div>
            <div className="mb-1">
              <strong>Amount:</strong> ₹{r.amount}
            </div>
            <div className="mb-1">
              <strong>Pending:</strong> ₹{r.pendingAmount || 0}
            </div>
            <div className="mb-1">
              <strong>Status:</strong> {r.paymentDetails.status}
            </div>
            <div className="mb-2">
              <strong>Txn ID:</strong> {r.transactionId || 'N/A'}
            </div>
            <button
              onClick={() => downloadPDF(r)}
              className="bg-[#146192] text-white rounded px-4 py-2 text-center w-full"
            >
              <FaDownload /> Download Receipt
            </button>
          </div>
        ))}
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handlePaymentSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg"
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
              aria-label="Close form"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-semibold text-[#146192] mb-4 text-center">Pay Fees</h2>

            <label className="block mb-2 font-medium text-gray-700">
              Select Student <span className="text-red-600">*</span>
            </label>
            <select
              value={studentName}
              onChange={(e) => {
                const selected = children.find((c) => c.studentProfile.fullname === e.target.value);
                setStudentName(e.target.value);
                setSelectedStudent(selected || null);
                setClassName(selected?.class || '');
                setSection(selected?.section || '');
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            >
              <option value="">-- Select Student --</option>
              {children.map((child) => (
                <option key={child._id} value={child.studentProfile.fullname}>
                  {child.studentProfile.fullname}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-medium text-gray-700">
              Class <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              placeholder="Class"
            />

            <label className="block mb-2 font-medium text-gray-700">
              Section <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              placeholder="Section"
            />

            <label className="block mb-2 font-medium text-gray-700">
              Amount (₹) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              placeholder="Enter amount"
            />

            <label className="block mb-2 font-medium text-gray-700">
              Purpose <span className="text-red-600">*</span>
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            >
              <option value="Fees">Fees</option>
              <option value="Other">Other</option>
            </select>

            {purpose === 'Other' && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">Reason <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required={purpose === 'Other'}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                  placeholder="Enter reason for payment"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-[#146192] hover:bg-[#0a4e6f] text-white font-semibold px-6 py-2 rounded w-full"
            >
              Pay Now
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Fees;






// // Updated complete Fees.jsx with Razorpay integration
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchFeesReceipts,
//   fetchChildren,
//   clearError,
//   clearPaymentSuccess,
//   verifyPayment,
// } from '../../redux/parent/feesSlice';
// import { FaMoneyBillWave, FaDownload, FaTimes } from 'react-icons/fa';
// import Header from './layout/Header';
// import { jsPDF } from 'jspdf';

// function Fees() {
//   const dispatch = useDispatch();
//   const { feesReceipts, children, error, paymentSuccess } = useSelector((state) => state.fees);

//   const [studentName, setStudentName] = useState('');
//   const [date, setDate] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [amount, setAmount] = useState('');
//   const [purpose, setPurpose] = useState('Fees');
//   const [itemName, setItemName] = useState('');
//   const [className, setClassName] = useState('');
//   const [section, setSection] = useState('');
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   useEffect(() => {
//     dispatch(fetchFeesReceipts());
//     dispatch(fetchChildren());
//   }, [dispatch]);

//   useEffect(() => {
//     if (paymentSuccess) {
//       dispatch(fetchFeesReceipts());
//       dispatch(clearPaymentSuccess());
//     }
//   }, [paymentSuccess, dispatch]);

//   const handleOnlinePayment = async (e) => {
//     e.preventDefault();

//     if (!selectedStudent || !selectedStudent.studentProfile.fullname || !amount || !purpose || !className || !section) {
//       alert("Please fill all required fields.");
//       return;
//     }
//     if (purpose === 'Other' && !itemName.trim()) {
//       alert("Please provide a reason for 'Other' payments.");
//       return;
//     }

//     const payload = {
//       studentName: selectedStudent.studentProfile.fullname,
//       amount: parseFloat(amount),
//       purpose,
//       className,
//       section,
//     };

//     if (purpose === 'Other') payload.reason = itemName.trim();

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('https://sikshamitra.onrender.com/api/parent/payFee', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Payment initiation failed');

//       const options = {
//       key: "rzp_test_N2JZTugUiv8bEs",// Replace with your Razorpay test/live key
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: 'ShikshaMitra',
//         description: 'Fee Payment',
//         order_id: data.order.id,
//         handler: (response) => {
//           dispatch(verifyPayment({
//             razorpayOrderId: response.razorpay_order_id,
//             razorpayPaymentId: response.razorpay_payment_id,
//             razorpaySignature: response.razorpay_signature,
//           }));
//           setShowForm(false);
//         },
//         prefill: {
//           name: selectedStudent.studentProfile.fullname,
//         },
//         theme: { color: '#146192' },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//       rzp.on('payment.failed', function (response) {
//         alert('Payment failed: ' + response.error.description);
//       });

//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };

//   const filteredReceipts = feesReceipts.filter((receipt) => {
//     return (!studentName || receipt.studentId.studentProfile.fullname === studentName) &&
//            (!date || new Date(receipt.createdAt).toLocaleDateString() === date);
//   });

//   const downloadPDF = (receipt) => {
//     const doc = new jsPDF();
//     doc.setFontSize(22);
//     doc.text('ShikshaMitra School', 105, 20, null, null, 'center');
//     doc.setFontSize(16);
//     doc.text('Fee Receipt', 105, 30, null, null, 'center');
//     doc.line(20, 35, 190, 35);

//     let y = 45;
//     const spacing = 10;
//     const lines = [
//       [`Date:`, new Date(receipt.createdAt).toLocaleDateString()],
//       [`Transaction ID:`, receipt.transactionId || 'N/A'],
//       [`Student Name:`, receipt.studentId.studentProfile.fullname],
//       [`Class:`, receipt.class],
//       [`Amount Paid:`, `₹${receipt.amount}`],
//       [`Pending Fees:`, `₹${receipt.pendingAmount || 0}`],
//       [`Payment Status:`, receipt.paymentDetails.status],
//     ];
//     lines.forEach(([label, value]) => {
//       doc.text(label, 20, y);
//       doc.text(value, 60, y);
//       y += spacing;
//     });

//     doc.text('Thank you for your payment.', 105, y + 10, null, null, 'center');
//     const filename = `Receipt_${receipt.studentId.studentProfile.fullname}_${new Date(receipt.createdAt).toLocaleDateString()}.pdf`;
//     doc.save(filename);
//   };


//   return (
//    <div>
//   <div className="flex justify-between items-center mx-4 mt-20 md:ml-72 flex-wrap">
//     <div>
//       <h1 className="text-2xl font-light text-black xl:text-[38px]">Fees</h1>
//       <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
//       <h1 className="mt-2 text-sm md:text-base">
//         <span>Home</span> {'>'}{' '}
//         <span className="font-medium text-[#146192]">Fees</span>
//       </h1>
//     </div>
//     <Header />
//   </div>

//   <div className="flex items-center mx-4 my-4 md:ml-72">
//     <FaMoneyBillWave className="text-[#146192] mr-2" size={26} />
//     <h1 className="text-xl font-semibold text-[#121313]">Fees Details</h1>
//   </div>

//   <div className="flex flex-col md:flex-row md:justify-between md:items-center mx-4 md:ml-72 my-4 gap-4">
//     <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//       <select
//         value={studentName}
//         onChange={(e) => setStudentName(e.target.value)}
//         className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192] w-full sm:w-auto"
//       >
//         <option value="">Student Name</option>
//         {children.map((child) => (
//           <option key={child._id} value={child.studentProfile.fullname}>
//             {child.studentProfile.fullname}
//           </option>
//         ))}
//       </select>

//       <select
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         className="px-4 py-2 rounded-lg border border-[#146192] text-[#146192] w-full sm:w-auto"
//       >
//         <option value="">Date</option>
//         {[...new Set(feesReceipts.map((r) => new Date(r.createdAt).toLocaleDateString()))].map((d) => (
//           <option key={d} value={d}>{d}</option>
//         ))}
//       </select>
//     </div>

//     <button
//       onClick={() => setShowForm(true)}
//       className="bg-[#146192] text-white px-6 py-2 rounded-lg hover:bg-[#0a4e6f] w-full sm:w-auto"
//     >
//       Pay Now
//     </button>
//   </div>

//   {paymentSuccess && (
//     <div className="text-green-600 text-center font-semibold">Payment successful!</div>
//   )}
//   {error && (
//     <div className="text-red-600 text-center font-semibold">Error: {error}</div>
//   )}

//   <div className="hidden md:block mx-4 md:ml-64 bg-white p-4 rounded-lg overflow-x-auto">
//     <table className="w-full table-auto border border-gray-600 text-sm">
//       <thead className="bg-[#1461924F] text-[#146192]">
//         <tr>
//           {["Date", "Student Name", "Amount", "Pending Fees", "Payment Status", "Transaction ID", "Receipt Download"].map((col, i) => (
//             <th key={i} className={`text-center font-semibold border-b border-black ${i < 6 ? 'border-r' : ''} py-3 px-2`}>
//               {col}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {filteredReceipts.map((receipt) => (
//           <tr key={receipt._id}>
//             <td className="text-center border-black border-r py-2 px-2">{new Date(receipt.createdAt).toLocaleDateString()}</td>
//             <td className="text-center border-black border-r py-2 px-2">{receipt.studentId.studentProfile.fullname}</td>
//             <td className="text-center border-black border-r py-2 px-2">${receipt.amount}</td>
//             <td className="text-center border-black border-r py-2 px-2">${receipt.pendingAmount}</td>
//             <td className="text-center border-black border-r py-2 px-2">{receipt.paymentDetails.status}</td>
//             <td className="text-center border-black border-r py-2 px-2">{receipt.transactionId || 'N/A'}</td>
//             <td className="text-center py-2 px-2">
//               <button
//                 className="bg-[#146192] text-white px-3 py-1 rounded hover:bg-[#0a4e6f]"
//                 onClick={() => downloadPDF(receipt)}
//               >
//                 <FaDownload />
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>

//   <div className="md:hidden mx-4 flex flex-col gap-4">
//     {filteredReceipts.map((receipt) => (
//       <div key={receipt._id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm text-sm">
//         <div className="mb-1"><strong>Date:</strong> {new Date(receipt.createdAt).toLocaleDateString()}</div>
//         <div className="mb-1"><strong>Student:</strong> {receipt.studentId.studentProfile.fullname}</div>
//         <div className="mb-1"><strong>Amount:</strong> ${receipt.amount}</div>
//         <div className="mb-1"><strong>Pending:</strong> ${receipt.pendingAmount}</div>
//         <div className="mb-1"><strong>Status:</strong> {receipt.paymentDetails.status}</div>
//         <div className="mb-1"><strong>Transaction ID:</strong> {receipt.transactionId || 'N/A'}</div>
//         <button
//           className="mt-3 bg-[#146192] text-white px-4 py-2 rounded w-full hover:bg-[#0a4e6f]"
//           onClick={() => downloadPDF(receipt)}
//         >
//           <FaDownload className="inline mr-2" /> Download Receipt
//         </button>
//       </div>
//     ))}
//   </div>


//       {showForm && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl">
//             <button
//               className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
//               onClick={() => setShowForm(false)}
//             >
//               <FaTimes />
//             </button>

//             <h2 className="text-3xl font-light text-black mb-2">PAY NOW</h2>
//             <hr className="border-gray-400 mb-6" />

//             <form onSubmit={handleOnlinePayment}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm text-[#146192] mb-1">Student Name</label>
//                   <select
//                     value={studentName}
//                     onChange={(e) => {
//                       setStudentName(e.target.value);
//                       const selected = children.find(c => c.studentProfile.fullname === e.target.value);
//                       setSelectedStudent(selected);
//                       setClassName(selected?.studentProfile?.class?.name || '');
//                       setSection(selected?.studentProfile?.section || '');
//                     }}
//                     required
//                     className="w-full bg-[#E7F0F7] text-gray-600 p-2 rounded-md focus:outline-none"
//                   >
//                     <option value="">Select student</option>
//                     {children.map((child) => (
//                       <option key={child._id} value={child.studentProfile.fullname}>
//                         {child.studentProfile.fullname}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-[#146192] mb-1">Purpose</label>
//                   <select
//                     value={purpose}
//                     onChange={(e) => setPurpose(e.target.value)}
//                     required
//                     className="w-full bg-[#E7F0F7] text-gray-600 p-2 rounded-md focus:outline-none"
//                   >
//                     <option value="Fees">Fees</option>
//                     <option value="Transportation">Transportation</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-[#146192] mb-1">Amount</label>
//                   <input
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     required
//                     className="w-full bg-[#E7F0F7] text-gray-600 p-2 rounded-md"
//                   />
//                 </div>

//                 {purpose === 'Other' && (
//                   <div>
//                     <label className="block text-sm text-[#146192] mb-1">Reason</label>
//                     <input
//                       type="text"
//                       value={itemName}
//                       onChange={(e) => setItemName(e.target.value)}
//                       placeholder="Enter reason"
//                       required
//                       className="w-full bg-[#E7F0F7] text-gray-600 p-2 rounded-md"
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm text-[#146192] mb-1">Class</label>
//                   <input
//                     type="text"
//                     value={className}
//                     onChange={(e) => setClassName(e.target.value)}
//                     className="w-full bg-[#E7F0F7] text-gray-600 p-2 rounded-md"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-[#146192] mb-1">Section</label>
//                   <input
//                     type="text"
//                     value={section}
//                     onChange={(e) => setSection(e.target.value)}
//                     className="w-full bg-[#E7F0F7] text-gray-600 p-2 rounded-md"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="text-center">
//                 <button
//                   type="submit"
//                   className="bg-[#146192] text-white px-10 py-2 rounded-md hover:bg-[#0a4e6f]"
//                 >
//                   Pay Now
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Fees;
