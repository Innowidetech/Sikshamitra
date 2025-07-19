import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './layout/Header';
import { fetchRequestedBooks } from '../../redux/student/bookSlice';

const BorrowingHistory = () => {
  const dispatch = useDispatch();

const bookState = useSelector((state) => state.book || {});
const {
  requestedBooks = [],
  requestedBooksLoading,
  requestedBooksError,
} = bookState;


console.log("Redux requestedBooks:", requestedBooks);
console.log("Loading:", requestedBooksLoading);
console.log("Error:", requestedBooksError);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchRequestedBooks());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      issued: 'text-green-600',
      requested: 'text-blue-600',
      rejected: 'text-red-600',
      returned: 'text-black',
    };
    return colors[status?.toLowerCase()] || 'text-black';
  };

 const filteredBooks = (requestedBooks || []).filter(({ book }) => {
  if (!book) return false;
  const lower = searchTerm.toLowerCase();
  return (
    book.bookName?.toLowerCase().includes(lower) ||
    book.author?.toLowerCase().includes(lower) ||
    book.subject?.toLowerCase().includes(lower)
  );
});


  return (
    <div className=" px-4 ">
     {/* Page Heading – Desktop & Tablet */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Borrowing History</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Borrowing History</span>
    </h1>
  </div>
  <Header />
</div>

      {/* Search Input */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4 pt-10">
        <input
          type="text"
          placeholder="Search book, author or category"
          className="border border-gray-400 rounded-md px-4 py-2 w-full md:w-[400px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-[#146192] text-white px-4 py-2 rounded hover:bg-[#0f4e75]">
            Borrowing History
          </button>
          <button className="border border-[#146192] text-[#146192] px-4 py-2 rounded hover:bg-[#f0f8ff]" >
            Class Books
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6">
        {requestedBooksLoading ? (
          <p>Loading borrowing history...</p>
        ) : requestedBooksError ? (
          <p className="text-red-500">Error: {requestedBooksError}</p>
        ) : filteredBooks.length === 0 ? (
          <p>No borrowing records found.</p>
        ) : (
          <table className="min-w-full border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr className="border border-gray-300">
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Book ID</th>
                <th className="px-4 py-2 border">Book Name</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Borrow Date</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Fine</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(({ _id, book, status, createdAt, fine }, index) => (
                <tr key={_id || index} className="border border-gray-300">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{book?._id || 'N/A'}</td>
                  <td className="px-4 py-2 border">{book?.bookName || 'N/A'}</td>
                  <td className="px-4 py-2 border">{book?.subject || 'N/A'}</td>
                  <td className={`px-4 py-2 border font-semibold ${getStatusColor(status)}`}>
                    {status || 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 border">-</td>
                  <td className="px-4 py-2 border">{fine ? `₹${fine}` : '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BorrowingHistory;
