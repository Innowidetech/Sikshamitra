import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLibrary } from '../../redux/librarySlice';
import { Search, BadgeCheck, BookOpenText, BookPlus } from 'lucide-react';

const ResolvePage = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const { requests: bookRequestsWithParents, loading } = useSelector((state) => state.library);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchLibrary());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = bookRequestsWithParents?.filter((req) =>
    (req.status === 'returned' || req.status === 'rejected') &&
    (req.book?.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     req.requestedBy?.studentProfile?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="flex flex-col py-10">
        <div className="inline-block mx-8">
          <h1 className="text-xl font-light text-black xl:text-[38px]">Library</h1>
          <hr className="border-t-2 border-[#146192] mt-1 w-36" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> {' > '}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Resolved Books Data
            </span>
          </h1>
        </div>

        {/* 🔍 Search + Icons */}
        <div className="w-full bg-[#d2e7f5] border-y-2 px-4 py-2 flex flex-col lg:flex-row items-center justify-between gap-4 mt-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Book Name, Registration No..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-6 items-center justify-center flex-wrap">
            <div className="flex flex-col items-center">
              <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100">
                <BadgeCheck className="text-[#146192] w-5 h-5" />
              </button>
              <span className="text-xs text-[#146192] mt-1">Resolved</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveTab('allbook')}
                className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
              >
                <BookOpenText className="text-[#146192] w-5 h-5" />
              </button>
              <span className="text-xs text-[#146192] mt-1">All Books</span>
            </div>

            {/* <div className="flex flex-col items-center">
              <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100">
                <BookPlus className="text-[#146192] w-5 h-5" />
              </button>
              <span className="text-xs text-[#146192] mt-1">Add Books</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* ✅ Desktop/Laptop View */}
      <div className="hidden lg:block px-6 mt-6">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-[#f2faff] text-[#146192] font-semibold">
            <tr>
              <th className="border p-2">S.no</th>
              <th className="border p-2">Book name</th>
              <th className="border p-2">Student Name<br />(Reg No.)</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Sec</th>
              <th className="border p-2">Issue Date<br />Return Date</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Email-ID</th>
              <th className="border p-2">Contact no.</th>
              <th className="border p-2">Fine amt</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests?.map((req, index) => {
              const student = req.requestedBy?.studentProfile;
              const email = req.requestedBy?.userId?.email;
              const contact =
                req.parentInfo?.fatherPhoneNumber || req.parentInfo?.motherPhoneNumber || '-';

              return (
                <tr key={req._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{req.book?.bookName || '-'}</td>
                  <td className="border p-2">
                    {student?.fullname || '-'} <br />({student?.registrationNumber || '-'})
                  </td>
                  <td className="border p-2">{student?.class || '-'}</td>
                  <td className="border p-2">{student?.section || '-'}</td>
                  <td className="border p-2">
                    {req.borrowedOn?.slice(0, 10) || '-'} <br />
                    {req.returnedOn?.slice(0, 10) || '-'}
                  </td>
                  <td className="border p-2">{req.dueOn?.slice(0, 10) || '-'}</td>
                  <td className="border p-2">{email || '-'}</td>
                  <td className="border p-2">{contact}</td>
                  <td className="border p-2">₹{req.fine || 0}</td>
                  <td className="border p-2">{req.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile & Tablet View */}
      <div className="lg:hidden px-4 space-y-6 mt-6">
        {filteredRequests?.map((req, index) => {
          const student = req.requestedBy?.studentProfile;
          const email = req.requestedBy?.userId?.email;
          const contact =
            req.parentInfo?.fatherPhoneNumber || req.parentInfo?.motherPhoneNumber || '-';

          return (
            <div
              key={req._id}
              className="bg-[#f2faff] border border-[#cce0f4] p-4 rounded shadow-sm"
            >
              <h2 className="text-md font-semibold text-[#146192] mb-2">Resolved Data</h2>
              <div className="text-sm space-y-1">
                <div><span className="font-semibold text-[#146192]">Book Name:</span> {req.book?.bookName}</div>
                <div><span className="font-semibold text-[#146192]">Book ID:</span> {req.book?._id}</div>
                <div><span className="font-semibold text-[#146192]">Student name:</span> {student?.fullname}</div>
                <div><span className="font-semibold text-[#146192]">Registration No:</span> {student?.registrationNumber}</div>
                <div><span className="font-semibold text-[#146192]">Class:</span> {student?.class}</div>
                <div><span className="font-semibold text-[#146192]">Section:</span> {student?.section}</div>
                <div><span className="font-semibold text-[#146192]">Issue Date:</span> {req.borrowedOn?.slice(0, 10) || '-'}</div>
                <div><span className="font-semibold text-[#146192]">Return on -Date:</span> {req.returnedOn?.slice(0, 10) || '-'}</div>
                <div><span className="font-semibold text-[#146192]">Due Date:</span> {req.dueOn?.slice(0, 10) || '-'}</div>
                <div><span className="font-semibold text-[#146192]">Email-ID:</span> {email}</div>
                <div><span className="font-semibold text-[#146192]">Contact No:</span> +91-{contact?.slice(-10)}</div>
                <div><span className="font-semibold text-[#146192]">Fine Amount:</span> ₹{req.fine}</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#146192]">Status:</span>
                  <span className="bg-white border px-2 py-1 rounded text-sm">{req.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ResolvePage;
