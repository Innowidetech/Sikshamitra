import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Header from './layout/Header';
import { fetchBooks, requestBook, clearRequestStatus } from '../../redux/student/bookSlice'; // Adjust path
import { useNavigate } from 'react-router-dom';

const subjectColors = [
  'bg-[#003b5b]',
  'bg-[#013A63]',
  'bg-[#01497C]',
  'bg-[#014F86]',
  'bg-[#2A6F97]',
  'bg-[#2C7DA0]',
  'bg-[#61A5C2]',
  'bg-[#61A5C2]',
  'bg-[#89C2D9]',
  'bg-[#A9D6E5]'
];

const BookRequest = ({ onNavigateBorrowingHistory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: books, loading, error, requestStatus, requestError } = useSelector(state => state.book);

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [requestedBookName, setRequestedBookName] = useState('');
  const [requestedBookId, setRequestedBookId] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Close modal & clear status
  const closeModal = () => {
    setModalOpen(false);
    setRequestedBookName('');
    setRequestedBookId(null);
    dispatch(clearRequestStatus());
  };

  // When request API succeeds or fails
  useEffect(() => {
    if (requestStatus === 'success') {
      setModalOpen(true);
    }
    if (requestStatus === 'failed') {
      alert(`Failed to request book: ${requestError}`);
      dispatch(clearRequestStatus());
    }
  }, [requestStatus, requestError, dispatch]);

  // Filter books by subject & search term
  const uniqueSubjects = ['All', ...Array.from(new Set(books.map(b => b.subject).filter(Boolean)))];
  const filteredBooks = books.filter(book => {
    const subjectMatch = selectedSubject === 'All' || (book.subject?.toLowerCase() === selectedSubject.toLowerCase());
    const searchMatch =
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return subjectMatch && searchMatch;
  });

  const handleRequestClick = (book) => {
    // if (!book.availability) return;
    setRequestedBookName(book.bookName);
    setRequestedBookId(book._id);
    dispatch(requestBook(book._id));
  };

  return (
    <div className=" px-4  relative">
      {/* Header & Breadcrumb */}
      {/* Page Heading – Desktop & Tablet (md and above) */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Book Request</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Book Request</span>
    </h1>
  </div>

  {/* Right: Header Icons (or anything else) */}
  <Header />
</div>


      {/* Search and Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-20">
        <div className="flex items-center w-full md:w-[400px] border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search book, author or category"
            className="w-full px-4 py-2 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FaSearch className="mx-3 text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 border border-[#285A87] text-[#285A87] rounded-md"
            onClick={onNavigateBorrowingHistory}
          >
            Borrowing History
          </button>
          <button className="px-4 py-2 bg-[#285A87] text-white rounded-md">Class Books</button>
        </div>
      </div>

      {/* Subjects */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-4">Browse by Subject</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {uniqueSubjects.map((subject, index) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-3 rounded-md text-white text-sm w-full min-h-[60px] 
                ${subjectColors[index % subjectColors.length]} 
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
            {filteredBooks.length > 0 ? (
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
                        book.availableBooks>0 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                      }`}
                    >
                      {book.availableBooks>0 ? "Available" : "Unavailable"}
                    </span>
                    <button
                      className={`w-full py-2 rounded-md text-white ${
                        book.availableBooks>0
                          ? (requestStatus === 'loading' && requestedBookId === book._id
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-[#003b5b] hover:bg-[#002f48]')
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={book.availableBooks<=0 || (requestStatus === 'loading' && requestedBookId === book._id)}
                      onClick={() => handleRequestClick(book)}
                    >
                      {requestStatus === 'loading' && requestedBookId === book._id
                        ? 'Requesting...'
                        : 'Request a book'}
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

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-md p-6 w-[280px] text-center relative"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Request Sent!</h3>
            <p className="mb-4">
              You have successfully requested: <strong>{requestedBookName}</strong>
            </p>
            <button
              className="bg-[#003b5b] text-white px-4 py-2 rounded hover:bg-[#002f48]"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRequest;
