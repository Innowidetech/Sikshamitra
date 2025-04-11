import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLibrary,
  fetchAllBooks,
  addBook,
  issueBook,
  deleteBook,
  setSearchQuery,
  resetStatus,
} from "../../redux/librarySlice";
import {
  Search,
  BookMinus,
  BookPlus,
  X,
  Upload,
  Trash2,
  Grid as GridIcon,
} from "lucide-react";

function Library() {
  const dispatch = useDispatch();
  const {
    filteredBooks,
    allBooks = [],
    loading,
    error,
    addBookStatus,
    issueBookStatus,
    deleteBookStatus,
  } = useSelector((state) => state.library);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [showIssueBook, setShowIssueBook] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);

  const [addBookForm, setAddBookForm] = useState({
    bookName: "",
    author: "",
    subject: "",
    edition: "",
    price: "",
    pages: "",
    photo: null,
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setSearchQuery(value));
  };

  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    dispatch(addBook(addBookForm));
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

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">
            Library
          </h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>
            {" > "}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Library's data
            </span>
          </h1>
        </div>
        <div className="grid md:flex gap-6">
          <button
            onClick={() => setShowAllBooks(true)}
            className="bg-[#146192] text-white text-xs md:text-lg lg:px-4 px-1 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#0f4c7a] transition-colors"
          >
            <BookMinus className="h-4 w-4" />
            All Books
          </button>
          <button
            onClick={() => setShowAddBook(true)}
            className="bg-[#146192] text-white text-xs md:text-lg md:px-4 px-1 py-2 rounded-md flex items-center gap-2 hover:bg-[#0f4c7a] transition-colors"
          >
            <BookPlus className="h-4 w-4" />
            Add Books
          </button>
        </div>
      </div>

      <div className="mx-8 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by Book Name, Student Name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setShowIssueBook(true)}
          className="bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0f4c7a] transition-colors"
        >
          Issue Book
        </button>
      </div>

      {showAllBooks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-center items-center relative w-full">
                <h2 className="text-2xl font-semibold text-[#146192]">
                  All Books
                </h2>
                <button
                  onClick={() => setShowAllBooks(false)}
                  className="absolute right-0 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-4">Loading books...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allBooks.map((book) => (
                    <div
                      key={book._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex p-4">
                        {/* Left: Image */}
                        <div className="w-2/3 h-full flex justify-center items-center">
                          <img
                            src={
                              book.photo ||
                              "https://via.placeholder.com/150x200?text=No+Cover"
                            }
                            alt={book.bookName}
                            className="object-cover rounded-lg h-full"
                          />
                        </div>

                        {/* Middle: Book Details */}
                        <div className="w-2/3 px-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">Book Name:</div>
                            <div className="text-sm">{book.bookName}</div>

                            <div className="text-sm">Author:</div>
                            <div className="text-sm text-gray-600">
                              {book.author}
                            </div>

                            <div className="text-sm">Subject:</div>
                            <div className="text-sm text-gray-600">
                              {book.subject}
                            </div>

                            <div className="text-sm">Edition:</div>
                            <div className="text-sm text-gray-600">
                              {book.edition}
                            </div>

                            <div className="text-sm">Price:</div>
                            <div className="text-sm text-[#146192]">
                              ₹{book.price}
                            </div>

                            <div className="text-sm">Pages:</div>
                            <div className="text-sm text-gray-600">
                              {book.pages}
                            </div>
                          </div>
                        </div>

                        {/* Right: Availability & Delete Button */}
                        <div className="w-1/3 flex flex-col justify-between">
                          {/* Availability */}
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className={`px-2 py-0.5 text-sm rounded-full ${
                                book.availability
                                  ? " border border-green-400 text-green-800"
                                  : "border border-red-500 text-red-800"
                              }`}
                            >
                              {book.availability
                                ? "Available"
                                : "Not Available"}
                            </span>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="mt-auto w-full bg-red-500 text-white text-sm py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <input
                    type="text"
                    value={addBookForm.author}
                    onChange={(e) =>
                      setAddBookForm({ ...addBookForm, author: e.target.value })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={addBookForm.price}
                    onChange={(e) =>
                      setAddBookForm({ ...addBookForm, price: e.target.value })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={addBookForm.pages}
                    onChange={(e) =>
                      setAddBookForm({ ...addBookForm, pages: e.target.value })
                    }
                    className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                  className="w-full bg-[#146192] text-white py-2 px-4 rounded-md hover:bg-[#0f4c7a] transition-colors flex items-center justify-center gap-2"
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

      <div className="mx-8 mb-6 hidden lg:block">
        <div className="bg-white rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y border-2">
              <thead style={{ fontFamily: "Poppins" }}>
                <tr>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Book ID
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Issued By
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Student ID
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Student Name
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Book Name
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Class
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Section
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Issued Date
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192] border-r">
                    Due Date
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-[#146192]">
                    Return Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {!Array.isArray(filteredBooks) || filteredBooks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-2 py-4 text-center text-gray-500"
                    >
                      No library data available
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm border-r">
                        {book._id || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.issuedBy || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.issuedTo?.studentProfile?.registrationNumber ||
                          "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.issuedTo?.studentProfile?.fullname || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.bookName || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.issuedTo?.studentProfile?.class || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.issuedTo?.studentProfile?.section || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.issuedOn
                          ? new Date(book.issuedOn).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm border-r">
                        {book.dueDate
                          ? new Date(book.dueDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2 text-sm">
                        {book.returnedDate
                          ? new Date(book.returnedDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mx-4 mb-6 lg:hidden shadow-lg">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {!Array.isArray(filteredBooks) || filteredBooks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No library data available
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div key={book._id} className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-[#146192]">Book ID</div>
                    <div className="text-center">-</div>
                    <div className="text-xs text-right">
                      {book._id || "N/A"}
                    </div>

                    <div className="text-[#146192]">Issued By</div>
                    <div className="text-center">-</div>
                    <div className="text-right">{book.issuedBy || "N/A"}</div>

                    <div className="text-[#146192]">Student ID</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.issuedTo?.studentProfile?.registrationNumber ||
                        "N/A"}
                    </div>

                    <div className="text-[#146192]">Student Name</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.issuedTo?.studentProfile?.fullname || "N/A"}
                    </div>

                    <div className="text-[#146192]">Book Name</div>
                    <div className="text-center">-</div>
                    <div className="text-right">{book.bookName || "N/A"}</div>

                    <div className="text-[#146192]">Class</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.issuedTo?.studentProfile?.class || "N/A"}
                    </div>

                    <div className="text-[#146192]">Section</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.issuedTo?.studentProfile?.section || "N/A"}
                    </div>

                    <div className="text-[#146192]">Issued Date</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.issuedOn
                        ? new Date(book.issuedOn).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div className="text-[#146192]">Due Date</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.dueDate
                        ? new Date(book.dueDate).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div className="text-[#146192]">Return Date</div>
                    <div className="text-center">-</div>
                    <div className="text-right">
                      {book.returnedDate
                        ? new Date(book.returnedDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <hr className="border mt-4 border-[#146192]" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Library;
