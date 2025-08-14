import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminQueries,
  fetchQueryById,
  fetchAdminConnects,
} from '../../redux/adminConnectQueriesSlice';
import Header from './layout/Header';
import AdminQueryChat from './AdminQueryChat';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // ✅ NEW

const socket = io(import.meta.env.VITE_BASE_URL); // ✅ NEW

const AdminConnectQuries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    receivedQueries,
    sentQueries,
    selectedQuery,
    connects = [],
    loading,
    error,
  } = useSelector((state) => state.adminConnectQueries);

  const [chatLoading, setChatLoading] = useState(false);
  const [statusChanges, setStatusChanges] = useState({});
  const [activeQueryId, setActiveQueryId] = useState(null);
  const [participants, setParticipants] = useState([]); // ✅ NEW

  const adminData = JSON.parse(localStorage.getItem('admin'));
  const loggedInId = adminData?.id || 'admin';
  const adminName = adminData?.name || 'Admin';

  console.log('🧑 LoggedIn Admin ID:', loggedInId);
  console.log('📦 Admin Data from localStorage:', adminData);

  useEffect(() => {
    dispatch(fetchAdminQueries());
    dispatch(fetchAdminConnects());
  }, [dispatch]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('participantsUpdate', (updatedList) => {
      console.log('✅ Updated Participants:', updatedList);
      setParticipants(updatedList);
    });

    return () => {
      socket.off('participantsUpdate');
    };
  }, []);

  const handleJoinMeeting = (meeting) => {
    const meetingLink = meeting.meetingLink;
    console.log('📎 Meeting Link:', meeting.meetingLink);

    const meetingCreatorId =
      typeof meeting.createdBy === 'string'
        ? meeting.createdBy
        : meeting.createdBy?._id;

    const isHost = loggedInId === meetingCreatorId;

    console.log('📋 Meeting Created By:', meeting.createdBy);
    console.log('✅ Meeting Creator ID:', meetingCreatorId);
    console.log('🧭 LoggedIn ID:', loggedInId);
    console.log('🎯 isHost:', isHost);

    const role = isHost ? 'Host (Admin)' : 'Admin';
    const name = adminName;

    if (isHost) {
      socket.emit('join-meeting', meetingLink);
      socket.emit('participantsUpdate', [
        {
          userId: loggedInId,
          fullname: adminName,
          role: 'Host',
        },
      ]);
    }

    navigate(
      isHost
        ? `/host/${encodeURIComponent(meetingLink)}`
        : `/test/${encodeURIComponent(meetingLink)}`,
      {
        state: {
          meetingId: meetingLink,
          role,
          name,
          meetingLink,
        },
      }
    );
  };

  const handleOpenChat = async (id) => {
    setChatLoading(true);
    await dispatch(fetchQueryById(id));
    setActiveQueryId(id);
    setChatLoading(false);
  };

  if (activeQueryId && selectedQuery) {
    return (
      <AdminQueryChat
        query={selectedQuery}
        onBack={() => {
          setActiveQueryId(null);
        }}
      />
    );
  }

  if (chatLoading) {
    return <div className="p-6 text-center text-blue-600 font-medium">Opening chat...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mx-4 md:mx-8 mb-6 flex-wrap gap-y-4">
        <div>
          <h1 className="text-2xl font-light xl:text-[38px] text-black">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] w-[150px]" />
          <p className="mt-2 text-gray-600">
            Home › <span className="font-medium text-[#146192]">Connect & Queries</span>
          </p>
        </div>
        <Header />
      </div>

      <div className="mx-4 md:mx-8 mt-6 bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center flex-wrap gap-y-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#146192]">Contact Us for Any Query!</h2>
            <p className="text-sm text-gray-700">We are here for you! How can we help?</p>
          </div>
          <div className="flex gap-3">
            <button
              className="bg-[#146192] text-white px-6 py-2 rounded-md"
              onClick={() => navigate('/admin/connectqueries/queries')}
            >
              Queries
            </button>
            <button
              className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm"
              onClick={() => navigate('/adminconnectpage')}
            >
              Connect
            </button>
          </div>
        </div>

        {/* ✅ Participants Block */}
        {participants.length > 0 && (
          <div className="mt-6 mb-4 p-4 border rounded bg-gray-50">
            <h3 className="text-md font-bold text-[#146192] mb-2">Participants In Call</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {participants.map((p, i) => (
                <div
                  key={i}
                  className="bg-black text-white w-24 h-24 flex items-center justify-center rounded border-2 border-white text-xl"
                >
                  {p.fullname?.[0] || '?'}
                </div>
              ))}
            </div>
          </div>
        )}

    {/* Meetings Section */}
<div className="bg-white rounded-md shadow border mt-6">
  <h2 className="text-lg font-semibold px-4 pt-4 text-[#1f4f82]">
    Ongoing / Upcoming Meetings
  </h2>

  {/* 👉 Desktop/Table View */}
  <table className="hidden sm:table min-w-full border-collapse text-sm text-[#333] mt-2">
    <thead>
      <tr className="bg-[#1f4f82] text-white text-left">
        <th className="px-4 py-2 border">S.NO</th>
        <th className="px-4 py-2 border">Meeting Title</th>
        <th className="px-4 py-2 border">Date</th>
        <th className="px-4 py-2 border">Time</th>
        <th className="px-4 py-2 border">Hosted by</th>
        <th className="px-4 py-2 border">Link</th>
        <th className="px-4 py-2 border">Status</th>
      </tr>
    </thead>
    <tbody>
      {connects?.length > 0 ? (
        connects.map((meeting, index) => {
          const meetingDate = meeting?.startDate ? new Date(meeting.startDate) : null;
          const formattedDate =
            meetingDate &&
            `${String(meetingDate.getDate()).padStart(2, '0')}-${String(
              meetingDate.getMonth() + 1
            ).padStart(2, '0')}-${meetingDate.getFullYear()}`;

          const formattedTime = meeting.startTime
            ? new Date(`1970-01-01T${meeting.startTime}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : '-';

          const allStatuses = meeting.connect?.map((c) => c.status).filter(Boolean);
          const uniqueStatuses = [...new Set(allStatuses)];
          const meetingId = meeting._id;
          const selectedStatus =
            statusChanges[meetingId] || (uniqueStatuses.length === 1 ? uniqueStatuses[0] : null);

          let statusDisplay = <span className="text-gray-400">-</span>;

          if (selectedStatus) {
            statusDisplay = (
              <select
                className="border rounded-md px-2 py-1 text-sm bg-white shadow-sm cursor-pointer"
                value={selectedStatus}
                onChange={(e) => {
                  setStatusChanges((prev) => ({
                    ...prev,
                    [meetingId]: e.target.value,
                  }));
                }}
              >
                <option value="Accepted">Accepted</option>
                <option value="Pending">Pending</option>
                <option value="Denied">Denied</option>
              </select>
            );
          }

          return (
            <tr key={meeting._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{meeting.title}</td>
              <td className="px-4 py-2 border">{formattedDate || '-'}</td>
              <td className="px-4 py-2 border">{formattedTime}</td>
              <td className="px-4 py-2 border">{meeting.hostedByName}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleJoinMeeting(meeting)}
                  className="text-blue-600 underline"
                >
                  Join
                </button>
              </td>
              <td className="px-4 py-2 border">{statusDisplay}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-4 text-gray-500">
            No meetings found.
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* 👉 Mobile View Cards */}
  <div className="block sm:hidden mt-4 space-y-4 px-4 pb-4">
    {connects?.length > 0 ? (
      connects.map((meeting, index) => {
        const meetingDate = meeting?.startDate ? new Date(meeting.startDate) : null;
        const formattedDate =
          meetingDate &&
          `${String(meetingDate.getDate()).padStart(2, '0')}-${String(
            meetingDate.getMonth() + 1
          ).padStart(2, '0')}-${meetingDate.getFullYear()}`;

        const formattedTime = meeting.startTime
          ? new Date(`1970-01-01T${meeting.startTime}`).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '-';

        const allStatuses = meeting.connect?.map((c) => c.status).filter(Boolean);
        const uniqueStatuses = [...new Set(allStatuses)];
        const meetingId = meeting._id;
        const selectedStatus =
          statusChanges[meetingId] || (uniqueStatuses.length === 1 ? uniqueStatuses[0] : null);

        return (
          <div key={meeting._id} className="border rounded-md shadow overflow-hidden">
            {[
              ['Meeting Title', meeting.title],
              ['Date', formattedDate || '-'],
              ['Time', formattedTime],
              ['Hosted by', meeting.hostedByName],
              [
                'Link',
                <span
                  className="text-blue-600 underline cursor-pointer break-all"
                  onClick={() => handleJoinMeeting(meeting)}
                >
                  Join
                </span>,
              ],
              [
                'Status',
                selectedStatus ? (
                  <select
                    className="border rounded-md px-2 py-1 text-sm w-full shadow-sm"
                    value={selectedStatus}
                    onChange={(e) =>
                      setStatusChanges((prev) => ({
                        ...prev,
                        [meetingId]: e.target.value,
                      }))
                    }
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Pending">Pending</option>
                    <option value="Denied">Denied</option>
                  </select>
                ) : (
                  <span className="text-gray-400">-</span>
                ),
              ],
            ].map(([label, value], i) => (
              <div key={i} className="flex">
                <div className="w-1/2 bg-[#146192E8] text-white font-semibold text-sm p-2 border">
                  {label}
                </div>
                <div className="w-1/2 text-sm p-2 border break-words">{value}</div>
              </div>
            ))}
          </div>
        );
      })
    ) : (
      <p className="text-center text-gray-500">No meetings found.</p>
    )}
  </div>
</div>

        
{/* Queries */}
{loading ? (
  <p className="text-center text-gray-500">Loading queries...</p>
) : error ? (
  <p className="text-center text-red-500">{error}</p>
) : (
  <>
    <div className="mb-8 mt-6">
      <h3 className="text-md font-semibold text-[#333] mb-2">Received Queries</h3>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#146192] text-white">
            <tr>
              <th className="py-2 px-3 border">S.NO</th>
              <th className="py-2 px-3 border">Name</th>
              <th className="py-2 px-3 border">Role</th>
              <th className="py-2 px-3 border">Contact</th>
              <th className="py-2 px-3 border">Email ID</th>
              <th className="py-2 px-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {receivedQueries.length > 0 ? (
              receivedQueries.map((item, idx) => (
                <tr key={item._id} className="text-center border">
                  <td className="py-2 px-3 border">{idx + 1}</td>
                  <td className="py-2 px-3 border">{item.name}</td>
                  <td className="py-2 px-3 border capitalize">{item.createdByRole}</td>
                  <td className="py-2 px-3 border">{item.contact}</td>
                  <td className="py-2 px-3 border">{item.email}</td>
                  <td className="py-2 px-3 border">
                    <button
                      disabled={chatLoading}
                      onClick={() => handleOpenChat(item._id)}
                      className={`px-4 py-1 rounded ${
                        chatLoading ? 'bg-gray-400' : 'bg-white hover:bg-blue-600 shadow-lg'
                      } text-[#1982C4]`}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No received queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

   <div className="block md:hidden space-y-4 px-2">
  {receivedQueries.length > 0 ? (
    receivedQueries.map((item) => {
      const rows = [
        ['Name', item.name],
        ['Role', item.createdByRole],
        ['Contact', item.contact],
        ['Email ID', item.email],
        [
          'Action',
          <button
            disabled={chatLoading}
            onClick={() => handleOpenChat(item._id)}
            className={`w-full py-1 rounded ${
              chatLoading
                ? "bg-gray-400"
                : "bg-white hover:bg-blue-600"
            } text-[#1982C4] shadow-lg text-sm font-medium`}
          >
            Reply
          </button>,
        ],
      ];

      return (
        <div key={item._id} className="border rounded-md shadow overflow-hidden">
          {rows.map(([label, value], idx) => (
            <div key={idx} className="flex">
              <div className="w-1/2 bg-[#146192E8] text-white font-semibold text-sm p-2 border">
                {label}
              </div>
              <div className="w-1/2 text-sm p-2 border break-words">{value}</div>
            </div>
          ))}
        </div>
      );
    })
  ) : (
    <p className="text-center py-4 text-gray-500">No received queries found.</p>
  )}
</div>

</div>
  

         <div className="mt-6">
  <h3 className="text-md font-semibold text-[#333] mb-2">Queries Sent by Admin</h3>

  {/* Desktop Table View */}
  <div className="hidden md:block">
    <table className="w-full text-sm border-collapse">
      <thead className="bg-[#146192] text-white">
        <tr>
          <th className="py-2 px-3 border">S.NO</th>
          <th className="py-2 px-3 border">Name</th>
          <th className="py-2 px-3 border">Contact</th>
          <th className="py-2 px-3 border">Email ID</th>
          <th className="py-2 px-3 border">Members</th>
          <th className="py-2 px-3 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {sentQueries.length > 0 ? (
          sentQueries.map((item, idx) => (
            <tr key={item._id} className="text-center border">
              <td className="py-2 px-3 border">{idx + 1}</td>
              <td className="py-2 px-3 border">{item.name}</td>
              <td className="py-2 px-3 border">{item.contact}</td>
              <td className="py-2 px-3 border">{item.email}</td>
              <td className="py-2 px-3 border">{item.sendToName}</td>
              <td className="py-2 px-3 border">
                <button
                  onClick={() => handleOpenChat(item._id)}
                  className="bg-white text-[#1982C4] px-4 py-1 rounded hover:bg-blue-600 shadow-lg"
                >
                  View
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4 text-gray-500">
              No sent queries found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile Card View */}
 {/* Mobile View */}
<div className="block md:hidden space-y-4 px-2">
  {sentQueries.length > 0 ? (
    sentQueries.map((item) => {
      const rows = [
        ['Name', item.name],
        ['Contact', item.contact],
        ['Email ID', item.email],
        ['Members', item.sendToName],
        [
          'Action',
          <button
            onClick={() => handleOpenChat(item._id)}
            className="w-full py-1 rounded bg-white hover:bg-blue-600 text-[#1982C4] shadow-lg text-sm font-medium"
          >
            View
          </button>,
        ],
      ];

      return (
        <div key={item._id} className="border rounded-md shadow overflow-hidden">
          {rows.map(([label, value], idx) => (
            <div key={idx} className="flex">
              <div className="w-1/2 bg-[#146192E8] text-white font-semibold text-sm p-2 border">
                {label}
              </div>
              <div className="w-1/2 text-sm p-2 border break-words">{value}</div>
            </div>
          ))}
        </div>
      );
    })
  ) : (
    <p className="text-center py-4 text-gray-500">No sent queries found.</p>
  )}
</div>

</div>

          </>
        )}
        
      </div>
    </div>
  );
};

export default AdminConnectQuries;
