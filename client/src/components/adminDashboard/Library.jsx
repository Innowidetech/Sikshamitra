import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLibraryRequests,
  updateBookRequest,
  clearUpdateStatus,
} from "../../redux/librarySlice";

function Library() {
  const dispatch = useDispatch();
  const { requests, loading, error, updateStatus, updateError } = useSelector(
    (state) => state.library
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState("");

  // Holds local inputs for updating status, dates, fine per request ID
  const [statusInputs, setStatusInputs] = useState({});

  // Toast visibility
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    dispatch(fetchLibraryRequests());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSection, selectedBookId, selectedRegistrationId]);

  // Show toast when updateStatus changes to success
  useEffect(() => {
    if (updateStatus === "succeeded") {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        dispatch(clearUpdateStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus, dispatch]);

  const classes = useMemo(
    () =>
      [...new Set(requests.map((r) => r.requestedBy.studentProfile.class))].sort(),
    [requests]
  );
  const sections = useMemo(
    () =>
      [...new Set(requests.map((r) => r.requestedBy.studentProfile.section))].sort(),
    [requests]
  );
  const bookIds = useMemo(
    () => [...new Set(requests.map((r) => r.book._id))].sort(),
    [requests]
  );
  const registrationIds = useMemo(
    () =>
      [...new Set(requests.map((r) => r.requestedBy.studentProfile.registrationNumber))].sort(),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      return (
        (selectedClass === "" || req.requestedBy.studentProfile.class === selectedClass) &&
        (selectedSection === "" || req.requestedBy.studentProfile.section === selectedSection) &&
        (selectedBookId === "" || req.book._id === selectedBookId) &&
        (selectedRegistrationId === "" ||
          req.requestedBy.studentProfile.registrationNumber === selectedRegistrationId)
      );
    });
  }, [requests, selectedClass, selectedSection, selectedBookId, selectedRegistrationId]);

  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Handle input changes for status, dueOn, returnedOn, fine fields
  const handleStatusChange = (requestId, field, value) => {
    setStatusInputs((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value,
      },
    }));

    // Auto update immediately on input change, except if status is empty
    if (field === "status" && value === "") {
      // Do nothing if status is cleared
      return;
    }

    // Prepare update payload from current and previous data
    const prevInput = statusInputs[requestId] || {};
    const payload = {
      requestId,
      status: field === "status" ? value : prevInput.status || "",
      dueOn: field === "dueOn" ? value : prevInput.dueOn || null,
      returnedOn: field === "returnedOn" ? value : prevInput.returnedOn || null,
      fine:
        field === "fine"
          ? Number(value)
          : prevInput.fine
          ? Number(prevInput.fine)
          : 0,
    };

    // Only dispatch if status is present (mandatory)
    if (!payload.status) return;

    dispatch(updateBookRequest(payload));
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded px-4 py-2 text-sm bg-white shadow"
        >
          <option value="">Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border rounded px-4 py-2 text-sm bg-white shadow"
        >
          <option value="">Section</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          className="border rounded px-4 py-2 text-sm bg-white shadow"
        >
          <option value="">Book ID</option>
          {bookIds.map((bid) => (
            <option key={bid} value={bid}>
              {bid}
            </option>
          ))}
        </select>

        <select
          value={selectedRegistrationId}
          onChange={(e) => setSelectedRegistrationId(e.target.value)}
          className="border rounded px-4 py-2 text-sm bg-white shadow"
        >
          <option value="">Registration ID</option>
          {registrationIds.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-sm text-blue-600">
            <span>📚</span>
            <span>All Books</span>
          </button>
          <button className="flex items-center space-x-1 text-sm text-blue-600">
            <span>➕</span>
            <span>Add Books</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <h2 className="text-lg font-semibold mb-4">Issued Books Data</h2>
      <div className="overflow-auto">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              {[
                "S.No",
                "Book name (Book ID)",
                "Student Name (Registration No.)",
                "Class",
                "Sec",
                "Issue Date / Return on date",
                "Due Date",
                "Contact Info (Email / Phone)",
                "Fine amt",
                "Status",
              ].map((head) => (
                <th key={head} className="px-4 py-2 border">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center p-4">
                  No data found.
                </td>
              </tr>
            )}
            {paginatedData.map((req, idx) => {
              const input = statusInputs[req._id] || {};
              return (
                <tr key={req._id} className="border-t">
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-2 border">
                    {req.book.bookName} ({req.book._id})
                  </td>
                  <td className="px-4 py-2 border">
                    {req.requestedBy.studentProfile.fullname} (
                    {req.requestedBy.studentProfile.registrationNumber})
                  </td>
                  <td className="px-4 py-2 border">
                    {req.requestedBy.studentProfile.class}
                  </td>
                  <td className="px-4 py-2 border">
                    {req.requestedBy.studentProfile.section}
                  </td>
                  <td className="px-4 py-2 border">
                    {req.borrowedOn
                      ? new Date(req.borrowedOn).toLocaleDateString()
                      : "-"}{" "}
                    <br />
                    {req.returnedOn
                      ? new Date(req.returnedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {req.dueOn ? new Date(req.dueOn).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    <div>{req.parentInfo.parentEmail || "-"}</div>
                    <div>
                      {req.parentInfo.fatherPhoneNumber ||
                        req.parentInfo.motherPhoneNumber ||
                        "-"}
                    </div>
                  </td>
                  <td className="px-4 py-2 border">₹{req.fine || 0}</td>
                  <td className="px-4 py-2 border">
                    {/* Status select */}
                    <select
                      value={input.status ?? req.status ?? ""}
                      onChange={(e) =>
                        handleStatusChange(req._id, "status", e.target.value)
                      }
                      className="w-full mb-1 text-sm border rounded"
                    >
                      <option value="">Select status</option>
                      <option value="requested">Requested</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="issued">Issued</option>
                      <option value="returned">Returned</option>
                    </select>

                    {/* Conditional inputs based on status */}
                    {(input.status === "issued" || req.status === "issued") && (
                      <input
                        type="date"
                        className="w-full mb-1 text-sm border rounded"
                        value={
                          input.dueOn || (req.dueOn ? req.dueOn.slice(0, 10) : "")
                        }
                        onChange={(e) =>
                          handleStatusChange(req._id, "dueOn", e.target.value)
                        }
                        placeholder="Due Date"
                      />
                    )}

                    {(input.status === "returned" || req.status === "returned") && (
                      <>
                        <input
                          type="date"
                          className="w-full mb-1 text-sm border rounded"
                          value={
                            input.returnedOn ||
                            (req.returnedOn ? req.returnedOn.slice(0, 10) : "")
                          }
                          onChange={(e) =>
                            handleStatusChange(req._id, "returnedOn", e.target.value)
                          }
                          placeholder="Returned On"
                        />
                        <input
                          type="date"
                          className="w-full mb-1 text-sm border rounded"
                          value={
                            input.dueOn || (req.dueOn ? req.dueOn.slice(0, 10) : "")
                          }
                          onChange={(e) =>
                            handleStatusChange(req._id, "dueOn", e.target.value)
                          }
                          placeholder="Due Date"
                        />
                        <input
                          type="number"
                          min="0"
                          className="w-full mb-1 text-sm border rounded"
                          value={input.fine ?? req.fine ?? 0}
                          onChange={(e) =>
                            handleStatusChange(req._id, "fine", e.target.value)
                          }
                          placeholder="Fine Amount"
                        />
                      </>
                    )}

                    {/* Removed Update button as per request */}

                    {updateError && (
                      <p className="text-xs text-red-500 mt-1">{updateError}</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-sm text-gray-500"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`w-8 h-8 text-sm border rounded ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-sm text-gray-500"
        >
          Next
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out"
          style={{ zIndex: 1000 }}
        >
          Update successful!
        </div>
      )}

      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s forwards;
        }
      `}</style>
    </div>
  );
}

export default Library;
