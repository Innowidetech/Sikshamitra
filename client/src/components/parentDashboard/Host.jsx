// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useSocket } from '../../../src/hooks/useSocket';

// const Host = () => {
//   const { state } = useLocation();
//   const { meetingLink, name = 'Host' } = state || {};
//   const { socket, isConnected } = useSocket();

//   const [joinRequests, setJoinRequests] = useState([]);
//   const [localStream, setLocalStream] = useState(null);
//   const localVideoRef = useRef(null);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [isMicOn, setIsMicOn] = useState(false);

//   // Join meeting and handle join requests
//   useEffect(() => {
//     if (socket && isConnected && meetingLink) {
//       // Host joins the meeting room immediately
//       socket.emit('join-meeting', meetingLink);

//       // Get local media stream for host video
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           setLocalStream(stream);
//           if (localVideoRef.current) {
//             localVideoRef.current.srcObject = stream;
//           }
//           setIsCameraOn(true);
//           setIsMicOn(true);
//         })
//         .catch((err) => {
//           console.error('Error accessing media devices:', err);
//         });

//       // Listen for join requests from attendees
//       socket.on('requestJoin', ({ meetingLink: reqMeetingLink, userId, fullname }) => {
//         if (reqMeetingLink === meetingLink) {
//           setJoinRequests((prev) => [...prev, { userId, fullname }]);
//         }
//       });

//       return () => {
//         socket.off('requestJoin');
//         localStream?.getTracks().forEach((track) => track.stop());
//       };
//     }
//   }, [socket, isConnected, meetingLink, localStream]);

//   // Respond to join requests
//   const respondToJoin = (userId, accept) => {
//     if (socket && meetingLink) {
//       socket.emit('respondToJoin', { meetingLink, userId, accept });
//       setJoinRequests((prev) => prev.filter((req) => req.userId !== userId));
//     }
//   };

//   // Toggle camera
//   const toggleCamera = () => {
//     const videoTrack = localStream?.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsCameraOn(videoTrack.enabled);
//     }
//   };

//   // Toggle mic
//   const toggleMic = () => {
//     const audioTrack = localStream?.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsMicOn(audioTrack.enabled);
//     }
//   };

//   const handleDisconnect = () => {
//     socket?.disconnect();
//     localStream?.getTracks().forEach((track) => track.stop());
//   };

//   return (
//     <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white">
//       <h1 className="text-2xl font-bold mb-4">🎥 Host Page</h1>
//       <p className="mb-4">{isConnected ? '🟢 Connected as Host' : '🔴 Not Connected'}</p>

//       {/* Video feed */}
//       <div className="relative w-full max-w-4xl h-[60vh] border-4 border-blue-500 rounded-lg overflow-hidden mb-6">
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
//       <div className="mb-6 flex justify-center gap-6 text-white text-xl">
//         <button onClick={toggleCamera} title="Toggle Camera" className="bg-gray-700 p-2 rounded">
//           <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
//         </button>
//         <button onClick={toggleMic} title="Toggle Mic" className="bg-gray-700 p-2 rounded">
//           <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
//         </button>
//         <button
//           onClick={handleDisconnect}
//           disabled={!isConnected}
//           title="Disconnect Socket"
//           className="bg-red-600 p-2 rounded disabled:opacity-50"
//         >
//           <i className="fas fa-phone-slash"></i> End Call
//         </button>
//       </div>

//       {/* Join Requests Panel */}
//       {joinRequests.length > 0 && (
//         <div className="absolute top-4 right-4 bg-white text-black p-4 rounded shadow-md w-[320px] max-h-[70vh] overflow-auto">
//           <h3 className="font-bold mb-2">Join Requests</h3>
//           {joinRequests.map(({ userId, fullname }) => (
//             <div key={userId} className="flex justify-between items-center mb-2">
//               <span>{fullname || userId}</span>
//               <div>
//                 <button
//                   onClick={() => respondToJoin(userId, true)}
//                   className="text-green-600 mr-2 hover:underline"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => respondToJoin(userId, false)}
//                   className="text-red-600 hover:underline"
//                 >
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

// export default Host;


import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../../src/hooks/useSocket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Host = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { meetingLink, name = 'Host' } = state || {};
  const { socket, isConnected } = useSocket();

  const [joinRequests, setJoinRequests] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);

  // Initialize media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        setIsCameraOn(true);
        setIsMicOn(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast.error('Unable to access camera/mic. Please check permissions.');
      }
    };
    initMedia();
  }, []);

  // Socket setup
  useEffect(() => {
    if (socket && isConnected && meetingLink) {
      socket.emit('join-meeting', meetingLink);

      socket.on('requestJoin', ({ meetingLink: reqLink, userId, fullname }) => {
        if (reqLink === meetingLink) {
          setJoinRequests((prev) => [...prev, { userId, fullname }]);
        }
      });

      socket.on('chatMessage', ({ userId, text }) => {
        setMessages((prev) => [...prev, { from: userId, text }]);
      });

      socket.on('participantsUpdate', (newParticipants) => {
        setParticipants(newParticipants);
      });

      return () => {
        socket.off('requestJoin');
        socket.off('chatMessage');
        socket.off('participantsUpdate');
      };
    }
  }, [socket, isConnected, meetingLink]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socket?.disconnect();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [socket, localStream]);

  const respondToJoin = (userId, accept) => {
    socket.emit('respondToJoin', { meetingLink, userId, accept });
    setJoinRequests((prev) => prev.filter((req) => req.userId !== userId));
  };

  const toggleCamera = () => {
    const track = localStream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsCameraOn(track.enabled);
    }
  };

  const toggleMic = () => {
    const track = localStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    }
  };

  const handleDisconnect = () => {
    toast.info(
      <div>
        Are you sure you want to end the meeting?{' '}
        <button
          onClick={() => {
            localStream?.getTracks().forEach((track) => track.stop());
            socket?.disconnect();
            navigate('/');
            toast.dismiss();
          }}
          className="ml-2 bg-red-600 text-white px-2 py-1 rounded"
        >
          Yes
        </button>
      </div>,
      { autoClose: false }
    );
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    socket.emit('chatMessage', { meetingLink, text: chatInput });
    setMessages((prev) => [...prev, { from: name, text: chatInput }]);
    setChatInput('');
  };

  const openParticipants = () => {
    setIsParticipantsOpen(true);
    setIsChatOpen(false);
    setIsMeetingInfoOpen(false);
  };

  const openChat = () => {
    setIsChatOpen(true);
    setIsParticipantsOpen(false);
    setIsMeetingInfoOpen(false);
  };

  const openMeetingInfo = () => {
    setIsMeetingInfoOpen(true);
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Video */}
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500">
        {localStream && isCameraOn ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-600 flex items-center justify-center">
            <svg className="w-24 h-24 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Controls */}
      <div className="absolute bottom-0 w-full bg-black bg-opacity-90 p-3 flex justify-center gap-6 text-xl z-10">
        <button onClick={toggleCamera} title="Toggle Camera" className="hover:text-blue-400">
          <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`} />
        </button>
        <button onClick={toggleMic} title="Toggle Mic" className="hover:text-blue-400">
          <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`} />
        </button>
       
        <button
          onClick={handleDisconnect}
          title="End Call"
          className="bg-red-600 p-2 rounded-full hover:bg-red-700"
        >
          <i className="fas fa-phone-slash" />
        </button>
        <button onClick={openParticipants} title="Participants" className="hover:text-blue-400">
          <i className="fas fa-users" />
        </button>
        <button onClick={openChat} title="Chat" className="hover:text-blue-400">
          <i className="fas fa-comment-dots" />
        </button>
        <button onClick={openMeetingInfo} title="Meeting Info" className="hover:text-blue-400">
          <i className="fas fa-info-circle" />
        </button>
      </div>

      {/* Join Requests */}
      {joinRequests.length > 0 && (
        <div className="absolute top-4 right-4 bg-white text-black p-4 rounded shadow-md w-[320px] max-h-[70vh] overflow-auto z-20">
          <h3 className="font-bold mb-2">Join Requests</h3>
          {joinRequests.map(({ userId, fullname }) => (
            <div key={userId} className="flex justify-between items-center mb-2">
              <span>{fullname || userId}</span>
              <div>
                <button
                  onClick={() => respondToJoin(userId, true)}
                  className="text-green-600 mr-2 hover:underline"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToJoin(userId, false)}
                  className="text-red-600 hover:underline"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 flex flex-col">
          <div className="p-4 font-bold border-b flex justify-between items-center">
            <span>Chat</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === name ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded px-3 py-1 max-w-[80%] ${
                    m.from === name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  <strong>{m.from === name ? 'You' : m.from}:</strong> {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 border rounded text-black"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {isParticipantsOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 flex flex-col">
          <div className="p-4 font-bold border-b flex justify-between items-center">
            <span>Participants</span>
            <button
              onClick={() => setIsParticipantsOpen(false)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {participants.length === 0 ? (
              <p className="text-gray-600 italic">No participants yet.</p>
            ) : (
              participants.map(({ userId, fullname }, i) => (
                <div key={userId || i} className="py-2 px-3 border rounded">
                  {fullname || userId || 'Unknown'}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Meeting Info Sidebar */}
      {isMeetingInfoOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 flex flex-col">
          <div className="p-4 font-bold border-b flex justify-between items-center">
            <span>Meeting Info</span>
            <button
              onClick={() => setIsMeetingInfoOpen(false)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              Close
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3">
            <p><strong>Joined as:</strong> {name}</p>
          <p className="break-words">
  <strong>Meeting Link:</strong>{' '}
  <a
    href={meetingLink}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline break-all"
  >
    {meetingLink}
  </a>
</p>

            {/* <div className="break-words text-blue-700">{meetingLink}</div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Host;
