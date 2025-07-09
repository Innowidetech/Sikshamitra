// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchQueries, fetchConnects } from '../../redux/parent/querySlice';
// import Header from './layout/Header';
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';

// const Query = ({ setActiveTab, setSelectedQueryId }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { queries, connects, loading, error } = useSelector((state) => state.query);
//   const [socket, setSocket] = useState(null); // Socket.IO Client state

//   useEffect(() => {
//     // Fetching queries and connects from the redux store
//     dispatch(fetchQueries());
//     dispatch(fetchConnects());

//     // Socket.IO Client Connection with transport options
//     const socketInstance = io('https://sikshamitra.onrender.com', {
//       transports: ['websocket', 'polling'], // Using both transports to avoid connection issues
//     });

//     // Error handling for socket connection issues
//     socketInstance.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       alert('Error connecting to the server!');
//     });

//     setSocket(socketInstance);

//     // Cleanup on component unmount
//     return () => {
//       if (socketInstance) {
//         socketInstance.disconnect();
//       }
//     };
//   }, [dispatch]);

//   // Function to handle joining meetings
//   const handleJoinMeeting = (meetingLink) => {
//     if (socket) {
//       socket.emit('join-meeting', meetingLink); // Emit join meeting event
//       alert(`You have joined the meeting: ${meetingLink}`);
//     }
//   };

//   // Received and Sent Queries
//   const received = queries?.queriesReceived || [];
//   const sent = queries?.queriesSent || [];

//   return (
//     <>
//       <div className="flex justify-between items-center mx-4 mt-20 md:ml-72 flex-wrap">
//         <div>
//           <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
//           <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
//           <h1 className="mt-2 text-sm md:text-base">
//             <span>Home</span> {'>'} <span className="font-medium text-[#146192]">Connect & Queries</span>
//           </h1>
//         </div>
//         <Header />
//       </div>

//       <div className="p-4 md:p-6 min-h-screen md:ml-64">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-blue-800">Contact Us for Any Query!</h2>
//             <div className="space-x-2">
//               <button
//                 className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
//                 onClick={() => setActiveTab('queryform')}
//               >
//                 Queries
//               </button>
//               <button
//                 className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
//                 onClick={() => navigate('/meeting')}
//               >
//                 Connect
//               </button>
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mb-6">We are here to help you! How can we help?</p>

//           {/* ✅ Connect Meetings Table */}
//           <h3 className="font-semibold text-gray-700 mb-2">Ongoing / Upcoming Meetings</h3>
//           <div className="overflow-x-auto mb-6">
//             <table className="w-full text-sm border">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="border px-3 py-2">S.NO</th>
//                   <th className="border px-3 py-2">Meeting Title</th>
//                   <th className="border px-3 py-2">Date</th>
//                   <th className="border px-3 py-2">Time</th>
//                   <th className="border px-3 py-2">Hosted By</th>
//                   <th className="border px-3 py-2">Link</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {connects && connects.length > 0 ? (
//                   connects.map((connect, idx) => (
//                     <tr key={connect._id} className="text-center">
//                       <td className="border px-3 py-2">{idx + 1}</td>
//                       <td className="border px-3 py-2">{connect.title}</td>
//                       <td className="border px-3 py-2">
//                         {new Date(connect.startDate).toLocaleDateString()}
//                       </td>
//                       <td className="border px-3 py-2">
//                         {connect.startTime} - {connect.endTime}
//                       </td>
//                       <td className="border px-3 py-2 capitalize">
//                         {connect.hostedByName} ({connect.hostedByRole})
//                       </td>
//                       <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
//                         <a
//                           href={connect.meetingLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             handleJoinMeeting(connect.meetingLink);
//                           }}
//                         >
//                           {connect.meetingLink}
//                         </a>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="border px-3 py-2 text-center text-gray-500">
//                       No upcoming meetings found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ✅ Received Queries */}
//           <h3 className="font-semibold text-gray-700 mb-2">Received Queries</h3>
//           <div className="overflow-x-auto mb-6">
//             <table className="w-full text-sm border">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="border px-3 py-2">S.NO</th>
//                   <th className="border px-3 py-2">Name</th>
//                   <th className="border px-3 py-2">Role</th>
//                   <th className="border px-3 py-2">Contact</th>
//                   <th className="border px-3 py-2">Email id</th>
//                   <th className="border px-3 py-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {received.map((query, idx) => (
//                   <tr key={query._id} className="text-center">
//                     <td className="border px-3 py-2">{idx + 1}</td>
//                     <td className="border px-3 py-2">{query.name}</td>
//                     <td className="border px-3 py-2 capitalize">{query.createdByRole}</td>
//                     <td className="border px-3 py-2">{query.contact}</td>
//                     <td className="border px-3 py-2">{query.email}</td>
//                     <td className="border px-3 py-2">
//                       <button
//                         className="px-4 py-2 bg-blue-600 text-white rounded"
//                         onClick={() => setActiveTab('replypage', query._id)}
//                       >
//                         Reply
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* ✅ Sent Queries */}
//           <h3 className="font-semibold text-gray-700 mb-2">Queries Sent by Parent</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="border px-3 py-2">S.NO</th>
//                   <th className="border px-3 py-2">Name</th>
//                   <th className="border px-3 py-2">Contact</th>
//                   <th className="border px-3 py-2">Email id</th>
//                   <th className="border px-3 py-2">Sent To</th>
//                   <th className="border px-3 py-2">Role</th>
//                   <th className="border px-3 py-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sent.map((query, idx) => (
//                   <tr key={query._id} className="text-center">
//                     <td className="border px-3 py-2">{idx + 1}</td>
//                     <td className="border px-3 py-2">{query.name}</td>
//                     <td className="border px-3 py-2">{query.contact}</td>
//                     <td className="border px-3 py-2">{query.email}</td>
//                     <td className="border px-3 py-2">{query.sentToName}</td>
//                     <td className="border px-3 py-2">{query.sentToRole}</td>
//                     <td className="border px-3 py-2">
//                       <button className="px-4 py-2 bg-blue-600 text-white rounded">View</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Query;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueries, fetchConnects } from '../../redux/parent/querySlice';
import { fetchParentDetails } from '../../redux/parent/parentDashboardSlice'; // import fetchParentDetails
import Header from './layout/Header';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Query = ({ setActiveTab, setSelectedQueryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { queries, connects } = useSelector((state) => state.query);
  const { parent } = useSelector((state) => state.parent); // Get parent from Redux slice

  const [socket, setSocket] = useState(null);
  const [joinResponses, setJoinResponses] = useState([]);

  // Fetch parent details on component mount
  useEffect(() => {
    dispatch(fetchParentDetails());
  }, [dispatch]);

  // Log parent data whenever it changes
  useEffect(() => {
    console.log('🧾 Parent data from Redux:', parent);
  }, [parent]);

  useEffect(() => {
    dispatch(fetchQueries());
    dispatch(fetchConnects());

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
      console.log('✅ Connected as socket.id:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection failed:', err.message);
    });

    socketInstance.on('joinAccepted', ({ meetingLink }) => {
      alert(`🎉 Your request to join ${meetingLink} was accepted!`);
      setJoinResponses((prev) => [...prev, { meetingLink, status: 'accepted' }]);
    });

    socketInstance.on('joinDenied', ({ meetingLink }) => {
      alert(`❌ Your request to join ${meetingLink} was denied.`);
      setJoinResponses((prev) => [...prev, { meetingLink, status: 'denied' }]);
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

    else if (connect.status === 'Live') {
      const meetingLink = connect.meetingLink;
      const name = parent?.parentData.parentProfile.fatherName || parent?.parentData.parentProfile.motherName;

      const loggedInId = parent?.parentData._id || null // fallback if nested inside parent.parent
      const isHost = loggedInId === connect.createdBy;

      const role = parent ? 'Parent' : 'User';

      if (socket) {
        socket.emit('requestJoin', { meetingLink });
        if (!isHost) {
          alert(`Request to join meeting sent: ${meetingLink}`);
        }
      }

      navigate(
        isHost
          ? `/host/${encodeURIComponent(meetingLink)}`
          : `/test/${encodeURIComponent(meetingLink)}`,
        {
          state: {
            meetingId: meetingLink,
            name,
            role,
          },
        }
      );
    }

  };

  const received = queries?.queriesReceived || [];
  const sent = queries?.queriesSent || [];

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
      <div className="flex justify-between items-center mx-4 mt-20 md:ml-72 flex-wrap">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {'>'} <span className="font-medium text-[#146192]">Connect & Queries</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="p-4 md:p-6 min-h-screen md:ml-64">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">Contact Us for Any Query!</h2>
            <div className="space-x-2">
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                onClick={() => setActiveTab('queryform')}
              >
                Queries
              </button>
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                onClick={() => navigate('/meeting')}
              >
                Connect
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6">We are here to help you! How can we help?</p>

          {/* Meetings Table */}
          <h3 className="font-semibold text-gray-700 mb-2">Ongoing / Upcoming Meetings</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Meeting Title</th>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Time</th>
                  <th className="border px-3 py-2">Hosted By</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {connects && connects.length > 0 ? (
                  connects.map((connect, idx) => (
                    <tr key={connect._id} className="text-center">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{connect.title}</td>
                      <td className="border px-3 py-2">
                        {new Date(connect.startDate).toLocaleDateString()}
                      </td>
                      <td className="border px-3 py-2">
                        {connect.startTime} - {connect.endTime}
                      </td>
                      <td className="border px-3 py-2 capitalize">
                        {connect.hostedByName} ({connect.hostedByRole})
                      </td>
                      <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
                        <button
                          onClick={() => handleJoinMeeting(connect)}
                          className="text-blue-600 underline"
                        >
                          Join Meeting
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="border px-3 py-2 text-center text-gray-500">
                      No upcoming meetings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Received Queries */}
          <h3 className="font-semibold text-gray-700 mb-2">Received Queries</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Contact</th>
                  <th className="border px-3 py-2">Email id</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {received.map((query, idx) => (
                  <tr key={query._id} className="text-center">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{query.name}</td>
                    <td className="border px-3 py-2 capitalize">{query.createdByRole}</td>
                    <td className="border px-3 py-2">{query.contact}</td>
                    <td className="border px-3 py-2">{query.email}</td>
                    <td className="border px-3 py-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => setActiveTab('replypage', query._id)}
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sent Queries */}
          <h3 className="font-semibold text-gray-700 mb-2">Queries Sent by Parent</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Contact</th>
                  <th className="border px-3 py-2">Email id</th>
                  <th className="border px-3 py-2">Sent To</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sent.map((query, idx) => (
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
                        onClick={() => setActiveTab('replypage', query._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Query;
