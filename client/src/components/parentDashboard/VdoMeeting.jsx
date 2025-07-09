// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useLocation } from 'react-router-dom';

// const VdoMeeting = () => {
//   const location = useLocation();
//   const { meetingId = 'sample-meeting-id', name = 'Ravi', role = 'attendant' } = location.state || {};

//   const [socket, setSocket] = useState(null);
//   const localVideoRef = useRef(null);
//   const [localStream, setLocalStream] = useState(null);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [isMicOn, setIsMicOn] = useState(false);
//   const [isApproved, setIsApproved] = useState(role === 'host');
//   const [joinRequests, setJoinRequests] = useState([]);
//   const [error, setError] = useState(null);
//   const [waitingMsg, setWaitingMsg] = useState('Waiting for host approval...');
//   const [showWaitingPopup, setShowWaitingPopup] = useState(role !== 'host');

//   useEffect(() => {
//     const socketInstance = io('https://sikshamitra.onrender.com', {
//       transports: ['websocket'],
//       reconnection: true,
//       auth: { token: localStorage.getItem('token') },
//     });

//     setSocket(socketInstance);

//     socketInstance.on('connect', () => {
//       console.log(`Connected as ${role}`);

//       if (role === 'host') {
//         socketInstance.emit('host-join', { meetingId, name });

//         socketInstance.on('pending-join-requests', (requests) => {
//           setJoinRequests(requests);
//         });

//         socketInstance.on('new-join-request', (request) => {
//           setJoinRequests((prev) => [...prev, request]);
//         });
//       } else {
//         socketInstance.emit('join-request', { meetingId, name });
//       }
//     });

//     socketInstance.on('join-approved', async () => {
//       console.log('Join approved');
//       setIsApproved(true);
//       setShowWaitingPopup(false);
//       setWaitingMsg('');

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setLocalStream(stream);
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         setIsCameraOn(true);
//         setIsMicOn(true);

//         socketInstance.emit('join-meeting', { meetingId });
//       } catch (err) {
//         console.error('Media error:', err);
//         setError('Unable to access camera or microphone.');
//       }
//     });

//     socketInstance.on('join-denied', () => {
//       setError('❌ Your request to join was denied.');
//       setShowWaitingPopup(false);
//       setWaitingMsg('');
//     });

//     if (role === 'host') {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           setLocalStream(stream);
//           if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//           setIsCameraOn(true);
//           setIsMicOn(true);
//         })
//         .catch((err) => {
//           console.error('Media error:', err);
//           setError('Unable to access camera or microphone.');
//         });
//     }

//     return () => {
//       socketInstance.disconnect();
//       localStream?.getTracks().forEach((track) => track.stop());
//     };
//   }, [role, meetingId, name]);

//   const handleApproval = (userId, accept) => {
//     socket.emit('respond-join-request', {
//       meetingId,
//       userId,
//       accept,
//     });
//     setJoinRequests((prev) => prev.filter((req) => req.userId !== userId));
//   };

//   const toggleCamera = () => {
//     const videoTrack = localStream?.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsCameraOn(videoTrack.enabled);
//     }
//   };

//   const toggleMic = () => {
//     const audioTrack = localStream?.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsMicOn(audioTrack.enabled);
//     }
//   };

//   const raiseHand = () => {
//     socket?.emit('raise-hand', { name });
//     alert('✋ Hand raised');
//   };

//   const endCall = () => {
//     localStream?.getTracks().forEach((track) => track.stop());
//     socket?.disconnect();
//     alert('You left the meeting');
//     window.location.href = '/';
//   };

//   if (error) {
//     return <div className="flex items-center justify-center h-screen bg-black text-white p-4">{error}</div>;
//   }

//   return (
//     <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white">
//       {/* Popup: Waiting for host approval */}
//       {showWaitingPopup && role !== 'host' && !isApproved && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white text-black rounded-lg p-6 shadow-lg max-w-sm text-center">
//             <h2 className="text-xl font-semibold mb-2">⏳ Waiting for Host</h2>
//             <p className="mb-4">Your request to join has been sent.</p>
//             <p>Please wait while the host approves your request.</p>
//           </div>
//         </div>
//       )}

//       <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500">
//         {localStream && isCameraOn ? (
//           <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full bg-purple-600 flex items-center justify-center relative">
//             <svg className="w-24 h-24 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11l-4 4z" />
//             </svg>
//             <span className="absolute left-4 bottom-4 text-white text-sm">© {name}</span>
//           </div>
//         )}
//       </div>

//       {/* Controls */}
//       {isApproved && (
//         <div className="absolute bottom-0 w-full bg-black bg-opacity-90 p-3 flex justify-center gap-6 text-white text-xl">
//           <button onClick={toggleCamera} title="Toggle Camera">
//             <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
//           </button>
//           <button onClick={toggleMic} title="Toggle Mic">
//             <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
//           </button>
//           {role !== 'host' && (
//             <button onClick={raiseHand} title="Raise Hand">
//               <i className="fas fa-hand-paper"></i>
//             </button>
//           )}
//           <button onClick={endCall} title="End Call" className="bg-red-600 p-2 rounded-full">
//             <i className="fas fa-phone-slash"></i>
//           </button>
//           <button title="Participants">
//             <i className="fas fa-users"></i>
//           </button>
//           <button title="Chat">
//             <i className="fas fa-comment-dots"></i>
//           </button>
//         </div>
//       )}

//       {/* Host: Join Requests Panel */}
//       {role === 'host' && joinRequests.length > 0 && (
//         <div className="absolute top-4 right-4 bg-white text-black p-4 rounded shadow-md w-[300px]">
//           <h3 className="font-bold mb-2">Join Requests</h3>
//           {joinRequests.map((req) => (
//             <div key={req.userId} className="flex justify-between items-center mb-2">
//               <span>{req.name}</span>
//               <div>
//                 <button onClick={() => handleApproval(req.userId, true)} className="text-green-600 mr-2">
//                   Accept
//                 </button>
//                 <button onClick={() => handleApproval(req.userId, false)} className="text-red-600">
//                   Deny
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VdoMeeting;
