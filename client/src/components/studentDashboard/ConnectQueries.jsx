import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConnectQueries,
  fetchConnects,
} from '../../redux/student/connectQueriesSlice';
import Header from './layout/Header';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { io } from 'socket.io-client';
import { fetchProfile } from '../../redux/student/studashboardSlice';
import { ToastContainer, toast } from 'react-toastify';

const formatTime12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const ConnectQueries = ({ onOpenQueryChat, onOpenQueriesPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const student = useSelector((state) => state.studentDashboard.profile.Data);

  const {
    received,
    sent,
    connectsReceived,
    loading,
    error,
    connectsStatus,
  } = useSelector((state) => state.connectQueries);

  useEffect(() => {
    dispatch(fetchConnectQueries());
    dispatch(fetchConnects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProfile());

    const socketInstance = io('https://sikshamitra.onrender.com', {

      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to socket:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ Socket connection failed:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [dispatch]);

 const handleJoinMeeting = (connect) => {
  console.log('📦 Full Meeting Object:', connect);

  if (connect.status === 'Not Started') {
    toast.error('Meeting has not yet started.');
    return;
  } else if (connect.status === 'Expired') {
    toast.error('Meeting has expired.');
    return;
  }

  if (connect.status === 'Live') {
    const meetingLink = connect.meetingLink;
    const name = student?.studentProfile?.fullname || 'Student';
    const loggedInId = student?._id;

    // ✅ Fix: Safely extract createdBy ID
    const meetingCreatorId =
      typeof connect.createdBy === 'string'
        ? connect.createdBy
        : connect.createdBy?._id;

    const isHost = loggedInId === meetingCreatorId;
    const role = isHost ? 'Host (Student)' : 'Student';

    if (socket) {
      socket.emit('requestJoin', { meetingLink, role, name });
      if (!isHost) {
        toast.info(`Request to join meeting sent: ${meetingLink}`);
      }
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
        },
      }
    );
  }
};


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mx-4 md:mx-8 flex-wrap gap-y-4">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xl">Home</span> {'>'}
              <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Connect & Queries</span>
            </h1>
          </div>
          <Header />
        </div>

        <div className="bg-white mt-10 mx-4 md:mx-8 p-6 rounded-xl shadow-md">
          {/* Top box */}
          <div className="flex justify-between items-center flex-wrap mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1C5D99]">Contact Us for Any Query!</h2>
              <p className="text-sm text-gray-700 mt-1">We are here for you! How can we help?</p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm"
                onClick={onOpenQueriesPage}
              >
                Queries
              </button>
              <button
                className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm"
                onClick={() => navigate('/connect')}
              >
                Connect
              </button>
            </div>
          </div>

          {loading || connectsStatus === 'loading' ? (
            <p className="text-center text-blue-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {/* Meeting Table */}
              <section className="mb-6">
                <h3 className="font-medium text-sm mb-2">Ongoing / Upcoming Meetings</h3>
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-[#1C5D99] text-white">
                    <tr>
                      <th className="p-2 border">S.NO</th>
                      <th className="p-2 border">Meeting Title</th>
                      <th className="p-2 border">Start Date</th>
                      <th className="p-2 border">Start Time</th>
                      <th className="p-2 border">Hosted by</th>
                      <th className="p-2 border">Link</th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connectsReceived?.length > 0 ? (
                      connectsReceived.map((meeting, index) => (
                        <tr key={meeting._id} className="text-center">
                          <td className="p-2 border">{index + 1}</td>
                          <td className="p-2 border">{meeting.title}</td>
                          <td className="p-2 border">
                            {moment(meeting.startDate).format('DD-MM-YYYY')}
                          </td>
                          <td className="p-2 border">{formatTime12Hour(meeting.startTime)}</td>
                          <td className="p-2 border">{meeting.hostedByName}</td>
                          <td className="p-2 border">
                            <button
                              onClick={() => handleJoinMeeting(meeting)}
                              className="text-blue-600 underline"
                            >
                              Join Meeting
                            </button>
                          </td>
                          <td className="p-2 border">{meeting.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No meetings available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* Received Queries */}
          <section className="mb-6">
            <h3 className="font-medium text-sm mb-2">Received Queries</h3>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-[#1C5D99] text-white">
                <tr>
                  <th className="p-2 border">S.NO</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Email id</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {received?.length > 0 ? (
                  received.map((item, i) => (
                    <tr key={item._id} className="text-center">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.createdByRole}</td>
                      <td className="p-2 border">{item.contact}</td>
                      <td className="p-2 border">{item.email}</td>
                      <td className="p-2 border">
                       <button
  onClick={() => onOpenQueryChat(item._id, 'reply')}
   className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
>
  Reply
</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      No received queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Sent Queries */}
          <section>
            <h3 className="font-medium text-sm mb-2">Queries sent by Student</h3>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-[#1C5D99] text-white">
                <tr>
                  <th className="p-2 border">S.NO</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Email id</th>
                  <th className="p-2 border">Sent to</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {sent?.length > 0 ? (
                  sent.map((item, i) => (
                    <tr key={item._id} className="text-center">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.contact}</td>
                      <td className="p-2 border">{item.email}</td>
                      <td className="p-2 border">{item.sendTo}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => onOpenQueryChat(item._id, 'view')}
                          className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      No sent queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </>
  );
};

export default ConnectQueries;
