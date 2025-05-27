import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdatedIncomeHistory } from '../../redux/accountSlice'; // Update path as needed

const AccountHistory = () => {
  const dispatch = useDispatch();

  const {
    updatedIncomeHistory: history,
    status,
    errorIncomeHistory: error,
  } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchUpdatedIncomeHistory());
  }, [dispatch]);

  const loading = status === 'loading';

  const extractInfo = (item) => {
    const { previousData, updatedData, incomeId, updatedAt } = item;

    // Get name from various possible fields
    const name =
      previousData.fullname ||
      previousData.studentId?.studentProfile?.fullname ||
      `${previousData.studentDetails?.firstName || ''} ${previousData.studentDetails?.lastName || ''}`.trim();

    // Get class & section
    const className =
      previousData.class ||
      previousData.studentId?.studentProfile?.class ||
      previousData.studentDetails?.classToJoin ||
      'N/A';

    const section =
      previousData.section ||
      previousData.studentId?.studentProfile?.section ||
      'N/A';

    return {
      date: updatedAt,
      purpose: previousData.purpose || 'N/A',
      amount: `${previousData.amount} → ${updatedData.amount}`,
      transactionId: incomeId,
      name,
      className,
      section
    };
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-[#146192]">Updated Income History</h1>

      {loading && <p>Loading updated history...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && history.length === 0 && (
        <p>No updated income history available.</p>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Purpose</th>
                <th className="border px-4 py-2 text-left">Amount</th>
                <th className="border px-4 py-2 text-left">Transaction ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Class</th>
                <th className="border px-4 py-2 text-left">Section</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const data = extractInfo(item);
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{new Date(data.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{data.purpose}</td>
                    <td className="border px-4 py-2">₹{data.amount}</td>
                    <td className="border px-4 py-2">{data.transactionId}</td>
                    <td className="border px-4 py-2">{data.name || 'N/A'}</td>
                    <td className="border px-4 py-2">{data.className}</td>
                    <td className="border px-4 py-2">{data.section}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountHistory;
