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
  const { received, sent, connectsReceived, loading, error, connectsStatus } = useSelector((state) => state.connectQueries);

  useEffect(() => {
    dispatch(fetchConnectQueries());
    dispatch(fetchConnects());
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

      const meetingCreatorId = typeof connect.createdBy === 'string'
        ? connect.createdBy
        : connect.createdBy?._id;

      const isHost = loggedInId === meetingCreatorId;
      const role = isHost ? 'Host (Student)' : 'Student';

      if (socket) {
        socket.emit('requestJoin', { meetingLink, role, name });
        if (!isHost) toast.info(`Request to join meeting sent: ${meetingLink}`);
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
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4">
        {/* Header */}
        <div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
          <div>
            <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Connect & Queries</h1>
            <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
            <h1 className="mt-1 text-sm sm:text-base">
              <span>Home</span> {">"}{" "}
              <span className="font-medium text-[#146192]">Connect & Queries</span>
            </h1>
          </div>
          <Header />
        </div>

        <div className="bg-white mt-8 md:mt-20 mx-4 md:mx-8 p-6 rounded-xl shadow-md">
          {/* Top Section */}
          <div className="flex justify-between items-center flex-wrap mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1C5D99]">Contact Us for Any Query!</h2>
              <p className="text-sm text-gray-700 mt-1">We are here for you! How can we help?</p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm" onClick={onOpenQueriesPage}>
                Queries
              </button>
              <button className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm" onClick={() => navigate('/connect')}>
                Connect
              </button>
            </div>
          </div>

          {/* Meetings Section */}
          <section className="mb-6">
            <h3 className="font-medium text-sm mb-2">Ongoing / Upcoming Meetings</h3>

            {/* Desktop Table */}
            <div className="hidden md:block">
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
                        <td className="p-2 border">{moment(meeting.startDate).format('DD-MM-YYYY')}</td>
                        <td className="p-2 border">{formatTime12Hour(meeting.startTime)}</td>
                        <td className="p-2 border">{meeting.hostedByName}</td>
                        <td className="p-2 border">
                          <button onClick={() => handleJoinMeeting(meeting)} className="text-blue-600 underline">
                            Join Meeting
                          </button>
                        </td>
                        <td className="p-2 border">{meeting.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">No meetings available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden ">
              {connectsReceived?.map((meeting, index) => (
                <div
                  key={meeting._id}
                  className="border border-[#0000004D] rounded-lg overflow-hidden shadow mb-4"
                >
                  <div className="flex">
                    <div className="w-1/2 bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">Meeting Title</div>
                    <div className="w-1/2 p-2 border border-[#0000004D]">{meeting.title}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">Date</div>
                    <div className="w-1/2 p-2 border border-[#0000004D]">{moment(meeting.startDate).format('DD-MM-YYYY')}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">Time</div>
                    <div className="w-1/2 p-2 border border-[#0000004D]">{formatTime12Hour(meeting.startTime)}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">Hosted by</div>
                    <div className="w-1/2 p-2 border border-[#0000004D]">{meeting.hostedByName}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">Link</div>
                    <div className="w-1/2 p-2 border border-[#0000004D]">
                      <span
                        className="text-blue-600 underline cursor-pointer"
                        onClick={() => handleJoinMeeting(meeting)}
                      >
                        {meeting.meetingLink}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">Status</div>
                    <div className="w-1/2 p-2 border border-[#0000004D]">{meeting.status}</div>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* Received Queries Section */}
          <section className="mb-6">
            <h3 className="font-medium text-sm mb-2">Received Queries</h3>

            {/* Desktop Table */}
            <div className="hidden md:block">
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
                  {received?.map((item, i) => (
                    <tr key={item._id} className="text-center">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.createdByRole}</td>
                      <td className="p-2 border">{item.contact}</td>
                      <td className="p-2 border">{item.email}</td>
                      <td className="p-2 border">
                        <button onClick={() => onOpenQueryChat(item._id, 'reply')} className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Reply</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            {/* Mobile Card View - Styled Like Image */}
            <div className="block md:hidden">
              {received?.map((item, index) => (
                <div
                  key={item._id}
                  className="rounded-lg overflow-hidden mb-4 shadow bg-white border border-[#0000004D]"
                >
                  <div className="grid grid-cols-2 text-sm">
                    {/* Label column */}
                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Name
                    </div>
                    <div className="p-2 border border-[#0000004D]">{item.name}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Role
                    </div>
                    <div className="p-2 border border-[#0000004D]">{item.createdByRole}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Contact
                    </div>
                    <div className="p-2 border border-[#0000004D]">{item.contact}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Email id
                    </div>
                    <div className="p-2 border border-[#0000004D] break-words">{item.email}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Action
                    </div>
                    <div className="p-2 border border-[#0000004D]">
                      <button
                        onClick={() => onOpenQueryChat(item._id, 'reply')}
                        className="text-[#1982C4] font-medium bg-white px-3 py-1 rounded shadow"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sent Queries Section */}
          <section>
            <h3 className="font-medium text-sm mb-2">Queries sent by Student</h3>

            {/* Desktop Table */}
            <div className="hidden md:block">
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
                  {sent?.map((item, i) => (
                    <tr key={item._id} className="text-center">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.contact}</td>
                      <td className="p-2 border">{item.email}</td>
                      <td className="p-2 border">{item.sendTo}</td>
                      <td className="p-2 border">
                        <button onClick={() => onOpenQueryChat(item._id, 'view')} className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden">
              {sent?.map((item, index) => (
                <div
                  key={item._id}
                  className="rounded-lg overflow-hidden mb-4 shadow bg-white border border-[#0000004D]"
                >
                  <div className="grid grid-cols-2 text-sm">
                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Name
                    </div>
                    <div className="p-2 border border-[#0000004D]">{item.name}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Contact
                    </div>
                    <div className="p-2 border border-[#0000004D]">{item.contact}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Email
                    </div>
                    <div className="p-2 border border-[#0000004D] break-words">{item.email}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Sent To
                    </div>
                    <div className="p-2 border border-[#0000004D]">{item.sendTo}</div>

                    <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                      Action
                    </div>
                    <div className="p-2 border border-[#0000004D]">
                      <button
                        onClick={() => onOpenQueryChat(item._id, 'view')}
                        className="bg-white text-blue-600 font-medium px-3 py-1 rounded shadow hover:bg-gray-100"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>
        </div>
      </div>
    </>
  );
};

export default ConnectQueries;
