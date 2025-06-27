import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../redux/student/bookSlice'; // Adjust path as needed

const subjects = [
  'All', 'History', 'Math', 'Novel', 'Fiction',
  'Literature', 'Economics', 'Political', 'Geography', 'Magazine'
];

const subjectColors = [
  'bg-[#003b5b]',
  'bg-[#145DA0]',
  'bg-[#0C2D48]',
  'bg-[#2E8BC0]',
  'bg-[#1B3B6F]',
  'bg-[#5b9bbf]',
  'bg-[#5885AF]',
  'bg-[#3C6E71]',
  'bg-[#336699]',
  'bg-[#5DADE2]'
];

const BookRequest = () => {
  const dispatch = useDispatch();

  // Extract data from Redux store
  const { items: books, loading, error } = useSelector(state => state.book);

  // State to track selected subject filter
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Filter books based on selected subject
  const filteredBooks = selectedSubject === 'All'
    ? books
    : books.filter(book => 
        book.subject?.toLowerCase() === selectedSubject.toLowerCase()
      );

  return (
    <div className="pt-24 px-4 md:px-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl xl:text-[38px] font-light text-black">Book Request</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[100px] md:w-[150px]" />
          <p className="mt-2 text-sm md:text-base xl:text-[17px]">
            <span>Home</span> {'>'}
            <span className="font-medium text-[#146192] ml-1">Book Request</span>
          </p>
        </div>
      </div>

      {/* Search and Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10">
        <div className="flex items-center w-full md:w-[400px] border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search book author or category"
            className="w-full px-4 py-2 outline-none"
          />
          <FaSearch className="mx-3 text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md">Borrowing History</button>
          <button className="px-4 py-2 bg-blue-700 text-white rounded-md">Class Books</button>
        </div>
      </div>

      {/* Subjects */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-4">Browse by Subject</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {subjects.map((subject, index) => (
            <button
              key={index}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-3 rounded-md text-white text-sm w-full min-h-[60px] 
                ${subjectColors[index]} 
                ${selectedSubject === subject ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* For You Section */}
      <div className="mt-10">
        <h2 className="font-semibold text-lg mb-2">For You</h2>
        <p className="text-sm text-gray-600 mb-6">Found best book based on your preferences</p>

        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <div key={book._id} className="bg-[#f1f5f9] rounded-md p-4 flex flex-col">
                  <img
                    src={book.photo || "https://m.media-amazon.com/images/I/81lw1ZchFgL._AC_UF1000,1000_QL80_.jpg"}
                    alt={book.bookName}
                    className="w-full h-[200px] object-cover rounded"
                  />
                  <div className="mt-3 flex-1">
                    <h3 className="font-semibold text-md">{book.bookName}</h3>
                    <p className="text-xs text-gray-500 capitalize">by {book.author}</p>
                    <span className="inline-block mt-1 text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded">{book.subject}</span>
                    <ul className="text-sm mt-3 space-y-1">
                      <li>Pages: {book.pages}</li>
                      <li>Book ID: {book._id}</li>
                      <li>Price: ₹{book.price}</li>
                      <li>Edition: {book.edition}</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-block text-sm mb-2 px-2 py-0.5 rounded ${
                        book.availability ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                      }`}
                    >
                      {book.availability ? "Available" : "Unavailable"}
                    </span>
                    <button
                      className={`w-full py-2 rounded-md text-white ${
                        book.availability ? "bg-[#003b5b] hover:bg-[#002f48]" : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!book.availability}
                    >
                      Request a book
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No books available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRequest;
