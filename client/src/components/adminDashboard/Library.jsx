import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import {
  fetchLibrary,
  fetchAllBooks,
  addBook,
  issueBook,
  deleteBook,
  setSearchQuery,
  resetStatus,
  updateFineAmount,
  updateBookRequestStatus,
  editBook,
  resolveBookRequest,
} from "../../redux/librarySlice";
import {
  Search,
  BookOpenText,
  BookPlus,
  X,
  Upload,
  Trash2,
  Grid as GridIcon,
  BadgeCheck,
   Pencil, 
} from "lucide-react";
import { FiEdit } from "react-icons/fi";

function Library({ setActiveTab }) {

  const dispatch = useDispatch();
  const {
    filteredBooks,
    allBooks = [],
    loading,
    error,
    addBookStatus,
    issueBookStatus,
    deleteBookStatus,
    requests,
  } = useSelector((state) => state.library);

 

  const [searchTerm, setSearchTerm] = useState("");
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [showIssueBook, setShowIssueBook] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
   const [bookData, setBookData] = useState(null);
   const [showEditPopup, setShowEditPopup] = useState(false);

const [editData, setEditData] = useState({});
const [selectedBookId, setSelectedBookId] = useState(null);

const [activeDueBoxId, setActiveDueBoxId] = useState(null);


const navigate = useNavigate();

  


const [isEditingFine, setIsEditingFine] = useState(false);
// const fineAmount = useSelector((state) => state.library.fineAmount); // ✅ define first




const [selectedDueDates, setSelectedDueDates] = useState({});
const [loadingBooks, setLoadingBooks] = useState(false);

const [activeIssuedRow, setActiveIssuedRow] = useState(null);
const [selectedStatus, setSelectedStatus] = useState({});
const [dueDates, setDueDates] = useState({});




  const fineAmount = useSelector((state) => state.library.fineAmount);
const updateFineStatus = useSelector((state) => state.library.updateFineStatus);

const [editMode, setEditMode] = useState(false);
const [editedFine, setEditedFine] = useState(fineAmount); // Now fineAmount is defined

  







useEffect(() => {
  setEditedFine(fineAmount);
}, [fineAmount]);



  const [addBookForm, setAddBookForm] = useState({
  bookName: "",
  author: "",
  subject: "",
  edition: "",
  price: "",
  pages: "",
  noOfBooks: "",
  photo: null, // ✅ must be `photo`
});

  const [issueBookForm, setIssueBookForm] = useState({
    bookId: "",
    studentRegNo: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(fetchLibrary());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (addBookStatus === "succeeded") {
      setShowAddBook(false);
      dispatch(fetchAllBooks());
      setAddBookForm({
        bookName: "",
        author: "",
        subject: "",
        edition: "",
        price: "",
        pages: "",
        photo: null,
      });
      dispatch(resetStatus());
    }
  }, [addBookStatus, dispatch]);

  useEffect(() => {
    if (issueBookStatus === "succeeded") {
      setShowIssueBook(false);
      dispatch(fetchLibrary());
      setIssueBookForm({
        bookId: "",
        studentRegNo: "",
        dueDate: "",
      });
      dispatch(resetStatus());
    }
  }, [issueBookStatus, dispatch]);

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://sikshamitra.onrender.com/api/admin/library", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBookData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingBooks(false);
    }
  };

  fetchBooks();
}, []);



useEffect(() => {
  if (
    !requests.some(
      r => r && r._id === activeIssuedRow && selectedStatus[r._id] === "issued"
    )
  ) {
    setActiveIssuedRow(null);
  }
}, [requests, selectedStatus]);


useEffect(() => {
  if (
    !Array.isArray(requests) ||
    !requests.some(r => r && r._id && selectedStatus[r._id] === "issued")
  ) {
    setActiveIssuedRow(null);
  }
}, [requests, selectedStatus]);



  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setSearchQuery(value));
  };

  const handleAddBookSubmit = (e) => {
  e.preventDefault();

  const formattedBookData = {
    ...addBookForm,
    price: Number(addBookForm.price),
    pages: Number(addBookForm.pages),
    noOfBooks: Number(addBookForm.noOfBooks),
  };

  dispatch(addBook(formattedBookData))
    .unwrap()
    .then((res) => {
      console.log("✅ Book added:", res);
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
    })
    .catch((err) => {
      console.error("❌ Add book error:", err);
      alert(err);
    });
};


  const handleIssueBookSubmit = async (e) => {
    e.preventDefault();
    const selectedBook = allBooks.find(
      (book) => book._id === issueBookForm.bookId
    );
    if (selectedBook) {
      dispatch(
        issueBook({
          bookId: selectedBook._id,
          studentRegNo: issueBookForm.studentRegNo,
          dueDate: issueBookForm.dueDate,
        })
      );
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(bookId));
    }
  };

  const handleRequestStatusChange = (requestId) => {
  const status = selectedStatus[requestId];
  const dueOn = selectedDueDates[requestId];

  if (!status) {
    alert("Please select a status");
    return;
  }

  if (status === "issued" && !dueOn) {
    alert("Due date is required to issue a book.");
    return;
  }

  const payload = {
    requestId,
    status,
    ...(status === "issued" ? { dueOn } : {}),
  };

  dispatch(updateBookRequestStatus(payload));
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

  const handleSave = () => {
    if (editedFine === "" || isNaN(editedFine)) return alert("Enter a valid amount");
    dispatch(updateFineAmount(Number(editedFine)));
    setEditMode(false);
  };


  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <>
     <div className="flex flex-col py-10">
  {/* === Header Section === */}
  <div className="inline-block mx-8">
    <h1 className="text-xl font-light text-black xl:text-[38px]">
      Library
    </h1>
    <hr className="border-t-2 border-[#146192] mt-1 w-36" />

    <h1 className="mt-2">
      <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>
      {" > "}
      <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
        Library's data
      </span>
    </h1>
  </div>

  {/* === Blue Bar Below Header === */}
   <div className="w-full bg-[#d2e7f5] border-y-2  px-4 py-2 flex flex-col lg:flex-row items-center justify-between gap-4 mt-6">
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
      {/* <div className="flex flex-col items-center">
        <button
          onClick={() => setShowAllBooks(true)}
          className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
        >
          <BookOpenText className="text-[#146192] w-5 h-5" />
        </button>
        <span className="text-xs text-[#146192] mt-1">All Books</span>
      </div> */}

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


        {/* <button
          onClick={() => setShowIssueBook(true)}
          className="bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0f4c7a] transition-colors"
        >
          Issue Book
        </button> */}
      </div>

   {showAllBooks && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
    <div className="bg-white rounded-3xl w-full max-w-7xl">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#146192]">
          All Books Data
        </h2>
        <button onClick={() => setShowAllBooks(false)}>
          <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Table */}
      <div className="p-6 overflow-auto">
        {loading ? (
          <div className="text-center py-4">Loading books...</div>
        ) : (
          <table className="w-full text-sm border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S.no</th>
                <th className="p-2 border">Book Image</th>
                <th className="p-2 border">Book ID</th>
                <th className="p-2 border">
                  <div>Book Name</div>
                  <div className="text-xs font-normal text-gray-500">Author Name</div>
                </th>
                <th className="p-2 border">
                  <div>Available Books</div>
                  <div className="text-xs font-normal text-gray-500">Total Books</div>
                </th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Edition</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Pages</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {allBooks.map((book, index) => (
                <tr key={book._id} className="border hover:bg-gray-50 transition">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    <img
                      src={book.photo || "https://via.placeholder.com/50x70?text=No+Cover"}
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
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                        book.availableBooks > 0
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {book.availableBooks > 0 ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="p-2 border flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
    setSelectedBookId(book._id);
    setEditData({
      bookName: book.bookName || '',
      author: book.author || '',
      subject: book.subject || '',
      noOfBooks: book.noOfBooks || '',
      edition: book.edition || '',
      price: book.price || '',
      pages: book.pages || '',
    });
    setShowEditPopup(true);
  }}
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
  </div>
)}


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
              onChange={(e) => setEditData((prev) => ({ ...prev, noOfBooks: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
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



      {showAddBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#146192]">
                Add New Book
              </h2>
              <button
                onClick={() => setShowAddBook(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddBookSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Book Name
                  </label>
                  <input
                    type="text"
                    value={addBookForm.bookName}
                    onChange={(e) =>
                      setAddBookForm({
                        ...addBookForm,
                        bookName: e.target.value,
                      })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Author
                  </label>
                  <input
                    type="text"
                    value={addBookForm.author}
                    onChange={(e) =>
                      setAddBookForm({ ...addBookForm, author: e.target.value })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={addBookForm.subject}
                    onChange={(e) =>
                      setAddBookForm({
                        ...addBookForm,
                        subject: e.target.value,
                      })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Edition
                  </label>
                  <input
                    type="text"
                    value={addBookForm.edition}
                    onChange={(e) =>
                      setAddBookForm({
                        ...addBookForm,
                        edition: e.target.value,
                      })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Price
                  </label>
                  <input
                    type="number"
                    value={addBookForm.price}
                    onChange={(e) =>
                      setAddBookForm({ ...addBookForm, price: e.target.value })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={addBookForm.pages}
                    onChange={(e) =>
                      setAddBookForm({ ...addBookForm, pages: e.target.value })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
                    required
                  />
                </div>

                <div>
  <label className="block text-sm font-medium text-[#146192]">
    No. of Books
  </label>
  <input
    type="number"
    value={addBookForm.noOfBooks}
    onChange={(e) =>
      setAddBookForm({ ...addBookForm, noOfBooks: e.target.value })
    }
    className="mt-1 p-2 border block w-full rounded-md border-[#146192] shadow-sm"
    required
  />
</div>

                <div>
                  <label className="block text-sm font-medium text-[#146192]">
                    Photo
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      onChange={(e) =>
                        setAddBookForm({
                          ...addBookForm,
                          photo: e.target.files[0],
                        })
                      }
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#146192] file:text-white hover:file:bg-[#0f4c7a]"
                      accept="image/*"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#146192] text-white py-2 px-4 rounded-full hover:bg-[#0f4c7a] transition-colors flex items-center justify-center gap-2 "
                  disabled={addBookStatus === "loading"}
                >
                  <Upload className="h-4 w-4" />
                  {addBookStatus === "loading" ? "Adding..." : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIssueBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#146192]">
                Issue Book
              </h2>
              <button
                onClick={() => setShowIssueBook(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleIssueBookSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Book Name
                </label>
                <select
                  value={issueBookForm.bookId}
                  onChange={(e) =>
                    setIssueBookForm({
                      ...issueBookForm,
                      bookId: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="">Select a book</option>
                  {allBooks.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.bookName} - {book.author}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student Registration No.
                </label>
                <input
                  type="text"
                  value={issueBookForm.studentRegNo}
                  onChange={(e) =>
                    setIssueBookForm({
                      ...issueBookForm,
                      studentRegNo: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={issueBookForm.dueDate}
                  onChange={(e) =>
                    setIssueBookForm({
                      ...issueBookForm,
                      dueDate: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#146192] text-white py-2 px-4 rounded-md hover:bg-[#0f4c7a] transition-colors"
                  disabled={issueBookStatus === "loading"}
                >
                  {issueBookStatus === "loading" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowIssueBook(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
<div className="mx-8 mb-6">
  <div className="bg-white rounded-lg overflow-hidden">
    {/* Header + Fine Box */}
    <div className="flex justify-between items-center px-4 pt-4 pb-2">
      <h2 className="text-xl font-semibold text-gray-700">Library Books Data</h2>
   <div className="bg-[#FDEAEA] text-[#000000] px-4 py-2 rounded-md shadow text-sm flex items-center gap-2">
        Fine amount per day
        {editMode ? (
          <>
            <input
              type="number"
              value={editedFine}
              onChange={(e) => setEditedFine(e.target.value)}
              className="w-16 ml-2 px-1 border border-gray-300 rounded"
            />
          <button
  onClick={() => {
    dispatch(updateFineAmount(Number(editedFine)))
      .then(() => dispatch(fetchLibrary())); // ✅ fetch latest fineAmount
    setEditMode(false);
  }}
  className="text-green-600 font-bold ml-1"
>
  Save
</button>

            <button onClick={() => setEditMode(false)} className="text-red-500 ml-1">
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="font-bold ml-1">₹{fineAmount}</span>
            <button onClick={() => {
              setEditedFine(fineAmount);
              setEditMode(true);
            }} className="ml-2">
              <FiEdit className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  {loading ? (
  <div className="p-4 text-center text-gray-600">Loading...</div>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y border-2 text-sm">
      <thead style={{ fontFamily: "Poppins" }}>
        <tr className="bg-[#ECF4FF] text-[#146192]">
          <th className="px-2 py-2 border">S.no</th>
          <th className="px-2 py-2 border">Book name<br/>(Book ID)</th>
          <th className="px-2 py-2 border">Student Name<br/>(Registration No.)</th>
          <th className="px-2 py-2 border">Class</th>
          <th className="px-2 py-2 border">Sec</th>
          <th className="px-2 py-2 border">Issue Date<br/>Return on date</th>
          <th className="px-2 py-2 border">Due Date</th>
          <th className="px-2 py-2 border">Email-ID</th>
          <th className="px-2 py-2 border">Contact no.</th>
          <th className="px-2 py-2 border">Fine amt</th>
          <th className="px-2 py-2 border">Status</th>
        </tr>
      </thead>
    <tbody className="bg-white divide-y">
  {requests
    ?.filter((book) => {
      const currentStatus = selectedStatus[book._id] || book.status;
      // ✅ Don't render row if fine = 0 and returned
      if (book.fine === 0 && currentStatus === "returned") return false;
      // ✅ Don't render row if fine > 0 and already resolved
      if (book.fine > 0 && currentStatus === "returned" && book.resolved) return false;

      return book &&
        book._id &&
        book.book &&
        book.requestedBy &&
        book.requestedBy.userId &&
        book.requestedBy.studentProfile;
    })
    .map((book, idx) => {
      const student = book?.requestedBy?.studentProfile || {};
      const parentInfo = book?.parentInfo || {};
      const email = book?.requestedBy?.userId?.email || parentInfo?.parentEmail || "-";
      const contactNo = parentInfo?.fatherPhoneNumber || parentInfo?.motherPhoneNumber || "-";
      const currentStatus = selectedStatus[book._id] || book.status;

      return (
        <tr key={book._id}>
          <td className="px-2 py-2 border text-center">{idx + 1}</td>
          <td className="px-2 py-2 border text-center">
            {book.book?.bookName || "-"} <br />({book.book?._id || "-"})
          </td>
          <td className="px-2 py-2 border text-center">
            {student?.fullname || "-"} <br />({student?.registrationNumber || "-"})
          </td>
          <td className="px-2 py-2 border text-center">{student?.class || "-"}</td>
          <td className="px-2 py-2 border text-center">{student?.section || "-"}</td>
          <td className="px-2 py-2 border text-center">
            {book.borrowedOn ? new Date(book.borrowedOn).toLocaleDateString() : "-"} <br />
            {book.returnedOn ? new Date(book.returnedOn).toLocaleDateString() : "-"}
          </td>
          <td className="px-2 py-2 border text-center">
            {book.dueOn ? new Date(book.dueOn).toLocaleDateString() : "-"}
          </td>
          <td className="px-2 py-2 border text-center">{email}</td>
          <td className="px-2 py-2 border text-center">{contactNo}</td>
          <td className="px-2 py-2 border text-center">₹{book.fine || 0}</td>
          <td className="px-2 py-2 border text-center relative">
            <div className="relative inline-block w-36">
              <select
                className="w-full appearance-none border border-gray-300 px-3 py-1.5 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-6 bg-white text-gray-700"
                value={currentStatus}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStatus({ ...selectedStatus, [book._id]: value });

                  if (value === "issued") {
                    setActiveIssuedRow(book._id);
                  } else {
                    setActiveIssuedRow(null);
                    dispatch(updateBookRequestStatus({ requestId: book._id, status: value }))
                      .then(() => dispatch(fetchLibrary()));
                  }
                }}
              >
                <option value="requested">Requested</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="issued">Issued</option>
                <option value="returned">Returned</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Issued Due Date Setter */}
            {currentStatus === "issued" && (
              <>
                {activeIssuedRow === book._id ? (
                  <div className="absolute mt-2 right-0 -translate-x-20 bg-white border border-blue-400 p-3 rounded shadow z-50 w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Due Date*
                    </label>
                    <input
                      type="date"
                      value={dueDates[book._id] || ""}
                      onChange={(e) =>
                        setDueDates({ ...dueDates, [book._id]: e.target.value })
                      }
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                    <button
                      onClick={() => {
                        if (!dueDates[book._id]) return alert("Please enter due date.");
                        dispatch(
                          updateBookRequestStatus({
                            requestId: book._id,
                            status: "issued",
                            dueOn: dueDates[book._id],
                          })
                        ).then(() => {
                          dispatch(fetchLibrary());
                          setActiveIssuedRow(null);
                        });
                      }}
                      className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setActiveIssuedRow(null)}
                      className="absolute top-1 right-2 text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveIssuedRow(book._id)}
                    className="mt-2 text-blue-600 underline text-xs"
                  >
                    Set / Change Due Date
                  </button>
                )}
              </>
            )}

            {/* ✅ Show Resolve button when returned + fine > 0 + not resolved */}
            {currentStatus === "returned" &&
 book.fine > 0 &&
 !book.resolved && (
   <button
     onClick={() => {
       dispatch(resolveBookRequest(book._id)).then(() => dispatch(fetchLibrary()));
     }}
     className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
   >
     Resolve
   </button>
)}

            {/* ✅ Show Resolved label if already resolved */}
           {currentStatus === "returned" &&
 book.fine > 0 &&
 book.resolved && (
   <div className="mt-1 text-green-700 font-semibold text-sm">Resolved</div>
)}

          </td>
        </tr>
      );
    })}
</tbody>

    </table>
  </div>
)}

  </div>
</div>

    </>
  );
}

export default Library;
