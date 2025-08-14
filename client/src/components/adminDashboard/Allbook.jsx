import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  fetchAllBooks,
  addBook,
  deleteBook,
  editBook,
  resetStatus,
} from '../../redux/librarySlice';
import { Upload, X, Search, BadgeCheck, BookOpenText, BookPlus } from 'lucide-react';


const Allbook = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const { allBooks, loading, addBookStatus } = useSelector((state) => state.library);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [editData, setEditData] = useState({});
  const [validationError, setValidationError] = useState(false);

  const [addBookForm, setAddBookForm] = useState({
    bookName: '',
    author: '',
    subject: '',
    edition: '',
    price: '',
    pages: '',
    noOfBooks: '',
    photo: null,
  });

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = allBooks.filter((book) =>
    book.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //   const handleDeleteBook = (bookId) => {
  //     dispatch(deleteBook(bookId));
  //   };

  const handleAddBookSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(addBookForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(addBook(formData)).then(() => {
      setShowAddBook(false);
      setAddBookForm({
        bookName: '',
        author: '',
        subject: '',
        edition: '',
        price: '',
        pages: '',
        noOfBooks: '',
        photo: null,
      });
    });
  };

  const handleEditClick = (book) => {
    setSelectedBookId(book._id);
    setEditData({
      bookName: book.bookName || "",
      author: book.author || "",
      subject: book.subject || "",
      noOfBooks: book.noOfBooks || "",
      edition: book.edition || "",
      price: book.price || "",
      pages: book.pages || "",
      availableBooks: book.availableBooks || "",  // ✅ Correct key
      photo: "", // optional
    });
    setShowEditPopup(true);
  };

  const handleDeleteBook = (bookId) => {
    toast.info(
      <div>
        Are you sure you want to delete this book?
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              dispatch(deleteBook(bookId))
                .then(() => {
                  toast.dismiss(); // Close confirmation
                  toast.success("Book deleted successfully.");
                })
                .catch(() => {
                  toast.dismiss();
                  toast.error("Failed to delete book.");
                });
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };


  return (
    <div className="flex flex-col py-10 px-4 lg:px-8">
      {/* === Header Section === */}
      <div className="inline-block">
        <h1 className="text-xl font-light text-black xl:text-[38px]">Library</h1>
        <hr className="border-t-2 border-[#146192] mt-1 w-36" />
        <h1 className="mt-2">
          <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>
          {' > '}
          <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
            Library's data
          </span>
        </h1>
      </div>

      {/* === Blue Bar === */}
      <div className="w-full bg-[#d2e7f5] border-y-2 px-4 py-2 flex flex-col lg:flex-row items-center justify-between gap-4 mt-6">
        {/* 🔍 Search Bar */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Book Name, Student Name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* 🔘 Icon Buttons */}
        <div className="flex gap-6 items-center justify-center flex-wrap">
          {/* ✅ Resolved */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveTab('resolve')}
              className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
            >
              <BadgeCheck className="text-[#146192] w-5 h-5" />
            </button>
            <span className="text-xs text-[#146192] mt-1">Resolved</span>
          </div>

          {/* 📚 All Books */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveTab('allbook')} // 👈 This triggers the Allbook component
              className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
            >
              <BookOpenText className="text-[#146192] w-5 h-5" />
            </button>
            <span className="text-xs text-[#146192] mt-1">All Books</span>

          </div>
          {/* ➕ Add Books */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowAddBook(true)}
              className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
            >
              <BookPlus className="text-[#146192] w-5 h-5" />
            </button>
            <span className="text-xs text-[#146192] mt-1">Add Books</span>
          </div>
        </div>
      </div>

    {/* === Responsive Book Display === */}
<div className="mt-6">
  {/* Mobile & Tablet View (Card Layout) */}
 {/* Mobile & Tablet View (Card Layout) */}
<div className="lg:hidden bg-[#F4F6FA] px-4 py-4">
  <h2 className="text-[18px] font-semibold text-[#1E1E1E] mb-4 border-b pb-1">
    All Books Data
  </h2>

  <div className="flex flex-col gap-6">
    {filteredBooks.map((book) => (
      <div key={book._id} className="bg-[#285A870D] rounded-xl px-6 py-5 shadow-md">
        {/* Book Cover Image */}
        <div className="w-full flex justify-center mb-4">
          <img
            src={book.photo || 'https://via.placeholder.com/100x140?text=No+Cover'}
            alt="Book"
            className="w-[85px] h-[120px] object-cover rounded-md"
          />
        </div>

        {/* Book Details */}
     {/* Book Details - Clean 2 Column Layout */}
{/* Book Details - Clean 2 Column Layout */}
<div className="text-[14px] text-gray-800 grid grid-cols-[auto,1fr] gap-y-2 gap-x-4">
  <p className="font-semibold text-[#146192]">Book ID:</p>
  <p>{book._id.slice(-6).toUpperCase()}</p>

  <p className="font-semibold text-[#146192]">Book Name:</p>
  <p>{book.bookName}</p>

  <p className="font-semibold text-[#146192]">Author Name:</p>
  <p>{book.author}</p>

  <p className="font-semibold text-[#146192]">Available Books:</p>
  <p>{book.availableBooks}</p>

  <p className="font-semibold text-[#146192]">Total Books:</p>
  <p>{book.noOfBooks}</p>

  <p className="font-semibold text-[#146192]">Subject:</p>
  <p>{book.subject}</p>

  <p className="font-semibold text-[#146192]">Edition:</p>
  <p>{book.edition}</p>

  <p className="font-semibold text-[#146192]">Price:</p>
  <p>₹{book.price}</p>

  <p className="font-semibold text-[#146192]">Pages:</p>
  <p>{book.pages}</p>
</div>

        {/* Status */}
        <div className="mt-4">
          <span className={`inline-block text-sm font-medium px-4 py-[4px] rounded-full border ${
            book.availableBooks > 0
              ? 'bg-white text-[#098934] border-[#098934]'
              : 'bg-red-100 text-red-700 border-red-400'
          }`}>
            {book.availableBooks > 0 ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => handleEditClick(book)}
            className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition"
          >
            <i className="fas fa-edit" />
          </button>
          <button
            onClick={() => handleDeleteBook(book._id)}
            className="w-9 h-9 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition"
          >
            <i className="fas fa-trash" />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


  {/* Desktop / Laptop Table View */}
  <div className="overflow-x-auto mt-6 hidden lg:block">
    {loading ? (
      <div className="text-center py-4">Loading books...</div>
    ) : (
      <table className="w-full text-sm border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">S.no</th>
            <th className="p-2 border">Book Image</th>
            <th className="p-2 border">Book ID</th>
            <th className="p-2 border">Book Name<br /><span className="text-xs text-gray-500 font-normal">Author</span></th>
            <th className="p-2 border">Available<br /><span className="text-xs text-gray-500 font-normal">Total</span></th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Edition</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Pages</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => (
            <tr key={book._id} className="border hover:bg-gray-50 transition">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <img
                  src={book.photo || 'https://via.placeholder.com/50x70?text=No+Cover'}
                  alt="Book"
                  className="w-12 h-16 object-cover mx-auto rounded-md"
                />
              </td>
              <td className="p-2 border">{book._id.slice(-6).toUpperCase()}</td>
              <td className="p-2 border">
                <div className="font-medium">{book.bookName}</div>
                <div className="text-xs text-gray-500">{book.author}</div>
              </td>
              <td className="p-2 border">
                <div>{book.availableBooks}</div>
                <div className="text-xs text-gray-500">{book.noOfBooks}</div>
              </td>
              <td className="p-2 border">{book.subject}</td>
              <td className="p-2 border">{book.edition}</td>
              <td className="p-2 border">₹{book.price}</td>
              <td className="p-2 border">{book.pages}</td>
              <td className="p-2 border">
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${book.availableBooks > 0
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                  {book.availableBooks > 0 ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="p-2 border flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEditClick(book)}
                >
                  <i className="fas fa-edit" />
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>



      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-2">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-4 relative border-2 border-blue-400">
            <h2 className="text-xl font-bold text-center text-blue-800 mb-4 border-b-2 border-blue-400 pb-2">
              Edit Book
            </h2>

            <button
              onClick={() => setShowEditPopup(false)}
              className="absolute top-2 right-3 text-red-500 text-xl hover:scale-110"
            >
              ✕
            </button>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();

                // Validation: Available Books should not exceed Total Books
                if (Number(editData.availableBooks) > Number(editData.noOfBooks)) {
                  setValidationError(true);
                  console.log(editData.availableBooks, editData.noOfBooks)
                  return;
                }
                setValidationError(false);

                const updatedForm = {
                  ...editData,
                  noOfBooks: Number(editData.noOfBooks),
                  availableBooks: Number(editData.availableBooks),
                  price: Number(editData.price),
                  pages: Number(editData.pages),
                };

                dispatch(editBook({ bookId: selectedBookId, updatedData: updatedForm }))
                  .then(() => {
                    setShowEditPopup(false);
                    dispatch(fetchAllBooks()); // 👈 refresh updated list
                    dispatch(resetStatus());
                  });
              }}

            >
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="font-semibold text-blue-800 block mb-1">Book Name:</label>
                  <input
                    type="text"
                    value={editData.bookName}
                    onChange={(e) => setEditData((prev) => ({ ...prev, bookName: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-blue-800 block mb-1">Author Name:</label>
                  <input
                    type="text"
                    value={editData.author}
                    onChange={(e) => setEditData((prev) => ({ ...prev, author: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-blue-800 block mb-1">Subject:</label>
                  <input
                    type="text"
                    value={editData.subject}
                    onChange={(e) => setEditData((prev) => ({ ...prev, subject: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-blue-800 block mb-1">No. of Books:</label>
                  <input
                    type="number"
                    value={editData.noOfBooks}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, noOfBooks: e.target.value }))
                    }
                    className={`w-full border ${validationError ? "border-red-500" : "border-gray-300"
                      } rounded px-3 py-2`}
                    required
                  />
                  {validationError && (
                    <p className="text-sm text-red-500 mt-1">
                      Available books cannot exceed total books.
                    </p>
                  )}

                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="font-semibold text-blue-800 block mb-1">Edition:</label>
                  <input
                    type="text"
                    value={editData.edition}
                    onChange={(e) => setEditData((prev) => ({ ...prev, edition: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-blue-800 block mb-1">Price:</label>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData((prev) => ({ ...prev, price: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-blue-800 block mb-1">Pages:</label>
                  <input
                    type="number"
                    value={editData.pages}
                    onChange={(e) => setEditData((prev) => ({ ...prev, pages: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">No. of Available Books</label>
                  <input
                    type="number"
                    value={editData.availableBooks}
                    onChange={(e) => setEditData((prev) => ({ ...prev, availableBooks: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Book Image */}
              <div className="col-span-1 md:col-span-2 mt-2 flex justify-start md:justify-end">
                <div className="border border-blue-400 p-3 rounded w-full md:w-[200px]">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Replace Book Image</p>

                  {editData.photo && typeof editData.photo === "object" ? (
                    <img
                      src={URL.createObjectURL(editData.photo)}
                      alt="Selected"
                      className="w-full h-[100px] object-cover mb-2 rounded"
                    />
                  ) : editData.photo ? (
                    <img
                      src={editData.photo}
                      alt="Book Preview"
                      className="w-full h-[100px] object-cover mb-2 rounded"
                    />
                  ) : null}

                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          photo: e.target.files[0],
                        }))
                      }
                      className="hidden"
                    />
                    <div className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-2 rounded flex items-center justify-center gap-2">
                      <span>📤</span> Upload File
                    </div>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="col-span-1 md:col-span-2 flex justify-end mt-5 gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* === Add Book Modal === */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#146192]">Add New Book</h2>
              <button onClick={() => setShowAddBook(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddBookSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Book Name', name: 'bookName' },
                  { label: 'Author', name: 'author' },
                  { label: 'Subject', name: 'subject' },
                  { label: 'Edition', name: 'edition' },
                  { label: 'Price', name: 'price', type: 'number' },
                  { label: 'Pages', name: 'pages', type: 'number' },
                  { label: 'No. of Books', name: 'noOfBooks', type: 'number' },
                ].map(({ label, name, type = 'text' }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-[#146192]">{label}</label>
                    <input
                      type={type}
                      value={addBookForm[name]}
                      onChange={(e) => setAddBookForm({ ...addBookForm, [name]: e.target.value })}
                      className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-[#146192]">Photo</label>
                  <input
                    type="file"
                    onChange={(e) => setAddBookForm({ ...addBookForm, photo: e.target.files[0] })}
                    className="mt-1 block w-full text-sm text-gray-500"
                    accept="image/*"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full col-span-2 bg-[#146192] text-white py-2 px-4 rounded-full hover:bg-[#0f4c7a] flex items-center justify-center gap-2"
                  disabled={addBookStatus === 'loading'}
                >
                  <Upload className="h-4 w-4" />
                  {addBookStatus === 'loading' ? 'Adding...' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Allbook;
