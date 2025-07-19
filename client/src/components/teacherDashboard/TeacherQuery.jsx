import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherQueries,
  fetchTeacherConnects,
  updateTeacherConnectStatus,
} from '../../redux/teacher/teacherQuerySlice';
import { fetchTeacherProfile } from '../../redux/teacher/aboutSlice';
import Header from './layout/Header';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';

const TeacherQuery = ({ setActiveTab, setSelectedQueryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const { loading, queriesSent, queriesReceived, connects, error } =
    useSelector((state) => state.teacherQuery);
  const { teacherProfile } = useSelector((state) => state.about);
  const teacherId = teacherProfile?.Data?._id;

  useEffect(() => {
    dispatch(fetchTeacherProfile());
    dispatch(fetchTeacherQueries());
    dispatch(fetchTeacherConnects());
  }, [dispatch]);

  useEffect(() => {
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
      console.log('✅ Socket connected:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ Socket error:', err.message);
    });

    socketInstance.on('joinAccepted', ({ meetingLink }) => {
      toast.success('✅ Join request accepted!');
      navigate(`/test/${encodeURIComponent(meetingLink)}`, {
        state: {
          meetingLink,
          name: teacherProfile?.Data?.fullname || 'Teacher',
          role: 'Teacher',
        },
      });
    });

    socketInstance.on('joinDenied', () => {
      toast.error('❌ Join request denied.');
    });

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, [teacherProfile, navigate]);

  const handleReplyClick = (id) => {
    if (setSelectedQueryId && setActiveTab) {
      setSelectedQueryId(id);
      setActiveTab('replyteacherquery', id);
    }
  };

  const handleStatusChange = (connectId, newStatus) => {
    dispatch(updateTeacherConnectStatus({ id: connectId, status: newStatus }))
      .unwrap()
      .then(() => dispatch(fetchTeacherConnects()));
  };

  const handleJoinMeeting = (connect) => {
    const { status, meetingLink } = connect;

    if (status === 'Not Started') {
      toast.error('Meeting has not started yet.');
      return;
    }

    if (status === 'Expired') {
      toast.error('Meeting has expired.');
      return;
    }

    const name = teacherProfile?.Data?.fullname || 'Teacher';
    const userId = teacherProfile?.Data?._id;
    const isHost = connect.createdBy === userId;
    const role = isHost ? 'Host (Teacher)' : 'Teacher';

    if (socket) {
      if (!isHost) {
        socket.emit('requestJoin', {
          meetingLink,
          userId,
          fullname: name,
          role,
        });
        toast.info('📨 Join request sent. Awaiting host approval.');
      }

      navigate(
        isHost
          ? `/host/${encodeURIComponent(meetingLink)}`
          : `/test/${encodeURIComponent(meetingLink)}`,
        {
          state: {
            meetingLink,
            name,
            role,
          },
        }
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mx-4 md:ml-72 flex-wrap">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192]">Connect & Queries</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="p-4 md:p-6 min-h-screen md:ml-64">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">Contact us for any Query!</h2>
            <div className="space-x-2">
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                onClick={() => setActiveTab?.('teacherqueryform')}
              >
                Queries
              </button>
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                onClick={() => navigate('/teacher-meeting')}
              >
                Connect
              </button>
            </div>
          </div>

          {loading && <p className="text-blue-600 mb-4">Loading...</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Connect Table */}
          <h3 className="font-semibold text-gray-700 mb-2">Upcoming / Ongoing Meetings</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Meeting Title</th>
                  <th className="border px-3 py-2">Meeting Link</th>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Time</th>
                  <th className="border px-3 py-2">Hosted By</th>
                  <th className="border px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {connects?.length > 0 ? (
                  connects
                    .filter((connect) => {
                      const isInvited =
                        Array.isArray(connect.connect) &&
                        connect.connect.some((c) => c.attendant === teacherId);
                      const isCreator = connect.createdBy === teacherId;
                      return isInvited || isCreator;
                    })
                    .map((connect, idx) => {
                      const myConnection = Array.isArray(connect.connect)
                        ? connect.connect.find((c) => c.attendant === teacherId)
                        : null;
                      const currentStatus = myConnection?.status || connect.status || 'Pending';
                      const canEditStatus = !!myConnection;

                      return (
                        <tr key={connect._id} className="text-center">
                          <td className="border px-3 py-2">{idx + 1}</td>
                          <td className="border px-3 py-2">{connect.title}</td>
                          <td className="border px-3 py-2 text-blue-700 underline">
                            <button onClick={() => handleJoinMeeting(connect)}>
                              Join
                            </button>
                          </td>
                          <td className="border px-3 py-2">
                            {new Date(connect.startDate || connect.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border px-3 py-2">
                            {connect.startTime
                              ? `${connect.startTime} - ${connect.endTime}`
                              : 'N/A'}
                          </td>
                          <td className="border px-3 py-2 capitalize">
                            {connect.hostedByName} ({connect.hostedByRole})
                          </td>
                          <td className="border px-3 py-2">
                            {canEditStatus ? (
                              <select
                                className="text-sm border rounded px-2 py-1"
                                value={currentStatus}
                                onChange={(e) =>
                                  handleStatusChange(connect._id, e.target.value)
                                }
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Denied">Denied</option>
                              </select>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No meetings scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Queries Received */}
          <h3 className="font-semibold text-gray-700 mb-2">Received Queries</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Contact</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesReceived?.length > 0 ? (
                  queriesReceived.map((query, idx) => (
                    <tr key={query._id} className="text-center">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{query.name}</td>
                      <td className="border px-3 py-2">{query.createdByRole}</td>
                      <td className="border px-3 py-2">{query.contact}</td>
                      <td className="border px-3 py-2">{query.email}</td>
                      <td className="border px-3 py-2">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                          onClick={() => handleReplyClick(query._id)}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No received queries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Queries Sent */}
          <h3 className="font-semibold text-gray-700 mb-2">Queries Sent by Teacher</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Contact</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Sent To</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesSent?.length > 0 ? (
                  queriesSent.map((query, idx) => (
                    <tr key={query._id} className="text-center">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{query.name}</td>
                      <td className="border px-3 py-2">{query.contact}</td>
                      <td className="border px-3 py-2">{query.email}</td>
                      <td className="border px-3 py-2">{query.sendToName}</td>
                      <td className="border px-3 py-2">{query.sendToRole}</td>
                      <td className="border px-3 py-2">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                          onClick={() => handleReplyClick(query._id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No sent queries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherQuery;
