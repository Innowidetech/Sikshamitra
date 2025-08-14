import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../adminStaffDashboard/layout/Header';
import { fetchStaffQueries } from '../../redux/staff/staffDashboardSlice';

const StaffQuery = ({ onSendQuery, onReplyView }) => {
  const dispatch = useDispatch();

  const {
    queriesReceived,
    queriesSent,
    queryLoading,
    queryError,
  } = useSelector((state) => state.staffDashboard);

  useEffect(() => {
    dispatch(fetchStaffQueries());
  }, [dispatch]);



  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      <Header />

      <div className="p-4 md:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 md:ml-64 py-10">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Query</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> &gt;{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Query
              </span>
            </h1>
          </div>
        </div>

        {/* ✅ Main White Box */}
        <div className="bg-white p-6 rounded-lg shadow-md md:ml-64 mx-4">
          {/* Header + Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-900">
                Contact Us for Any Query!
              </h2>
              <p className="text-sm text-gray-600">We are here for you! How can we help?</p>
            </div>
            <button
              onClick={onSendQuery}
              className="mt-4 md:mt-0 px-4 py-2 bg-[#1982C403] text-[#1982C4] border border-[#1982C4] hover:bg-[#0d8de1] hover:text-white rounded text-sm font-medium transition-all"
            >
              Send Query
            </button>
          </div>

          {/* Received Queries Table */}
          {/* Received Queries */}
          <h3 className="text-md font-semibold text-gray-800 mb-3">Received Queries</h3>

          {/* Desktop Table */}
          <div className="overflow-x-auto mb-6 hidden md:block">
            {queryLoading ? (
              <p className="text-gray-500">Loading queries...</p>
            ) : queryError ? (
              <p className="text-red-500">Error: {queryError}</p>
            ) : (
              <table className="w-full border text-sm text-left text-gray-800">
                <thead className="bg-[#01497c] text-white">
                  <tr>
                    <th className="border p-2">S.NO</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Contact</th>
                    <th className="border p-2">Email ID</th>
                    <th className="border p-2">School</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queriesReceived.length > 0 ? (
                    queriesReceived.map((query, index) => (
                      <tr key={query._id} className="hover:bg-gray-50">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{query.name}</td>
                        <td className="border p-2">{query.createdByRole}</td>
                        <td className="border p-2">{query.contact}</td>
                        <td className="border p-2">{query.email}</td>
                        <td className="border p-2">{query.schoolName}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => onReplyView({ ...query, type: 'received' })}
                            className="px-3 py-1 border border-blue-500 text-blue-600 rounded shadow-sm text-sm hover:bg-blue-50 transition"
                          >
                            Reply
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-gray-500">
                        No received queries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mb-6">
            {queriesReceived.length > 0 ? (
              queriesReceived.map((query, index) => (
                <div key={query._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  {[
                    { label: "S.NO", value: index + 1 },
                    { label: "Name", value: query.name },
                    { label: "Role", value: query.createdByRole },
                    { label: "Contact", value: query.contact },
                    { label: "Email ID", value: query.email },
                    { label: "School", value: query.schoolName }
                  ].map((item, i) => (
                    <div key={i} className="flex border-b last:border-b-0">
                      <div className="w-[40%] bg-[#01497c] text-white p-2 border-r text-sm font-medium">{item.label}</div>
                      <div className="w-[60%] p-2 text-sm">{item.value}</div>
                    </div>
                  ))}
                  <div className="flex">
                    <div className="w-[40%] bg-[#01497c] text-white p-2 border-r text-sm font-medium">Action</div>
                    <div className="w-[60%] p-2 text-sm">
                      <button
                        onClick={() => onReplyView({ ...query, type: 'received' })}
                        className="px-3 py-1 border border-blue-500 text-blue-600 rounded shadow-sm text-sm hover:bg-blue-50 transition w-full"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500 bg-white rounded-lg shadow-md">
                No received queries found.
              </div>
            )}
          </div>

          {/* Sent Queries */}
          <h3 className="text-md font-semibold text-gray-800 mb-3">Sent Queries</h3>

          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full border text-sm text-left text-gray-800">
              <thead className="bg-[#01497c] text-white">
                <tr>
                  <th className="border p-2">S.NO</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Contact</th>
                  <th className="border p-2">Email ID</th>
                  <th className="border p-2">Sent To</th>
                  <th className="border p-2">To Role</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesSent.length > 0 ? (
                  queriesSent.map((query, index) => (
                    <tr key={query._id} className="hover:bg-gray-50">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{query.name}</td>
                      <td className="border p-2">{query.contact}</td>
                      <td className="border p-2">{query.email}</td>
                      <td className="border p-2">{query.sendToName || '-'}</td>
                      <td className="border p-2">{query.sendToRole || '-'}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => onReplyView({ ...query, type: 'sent' })}
                          className="px-3 py-1 border border-blue-500 text-blue-600 rounded shadow-sm text-sm hover:bg-blue-50 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No sent queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {queriesSent.length > 0 ? (
              queriesSent.map((query, index) => (
                <div key={query._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  {[
                    { label: "S.NO", value: index + 1 },
                    { label: "Name", value: query.name },
                    { label: "Contact", value: query.contact },
                    { label: "Email ID", value: query.email },
                    { label: "Sent To", value: query.sendToName || '-' },
                    { label: "To Role", value: query.sendToRole || '-' }
                  ].map((item, i) => (
                    <div key={i} className="flex border-b last:border-b-0">
                      <div className="w-[40%] bg-[#01497c] text-white p-2 border-r text-sm font-medium">{item.label}</div>
                      <div className="w-[60%] p-2 text-sm">{item.value}</div>
                    </div>
                  ))}
                  <div className="flex">
                    <div className="w-[40%] bg-[#01497c] text-white p-2 border-r text-sm font-medium">Action</div>
                    <div className="w-[60%] p-2 text-sm">
                      <button
                        onClick={() => onReplyView({ ...query, type: 'sent' })}
                        className="px-3 py-1 border border-blue-500 text-blue-600 rounded shadow-sm text-sm hover:bg-blue-50 transition w-full"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500 bg-white rounded-lg shadow-md">
                No sent queries found.
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffQuery;
