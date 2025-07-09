
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

  // Log meeting link for debugging
  useEffect(() => {
    console.log('Meeting Link:', meetingLink);
  }, [meetingLink]);

  if (!meetingLink) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        ❌ Missing meeting link. Please start the meeting from the correct page.
      </div>
    );
  }

  // Initialize media devices
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

  // Setup socket event listeners
  useEffect(() => {
    if (socket && isConnected && meetingLink) {
      socket.emit('join-meeting', meetingLink);

      // Listen for join requests from participants
      socket.on('joinRequest', ({ meetingLink: reqLink, userId, fullname, role }) => {
        console.log('🔔 joinRequest received:', { reqLink, userId, fullname, role });
        if (reqLink === meetingLink) {
          const message = `${fullname || 'A participant'} (${role}) is requesting to join the meeting.`;
          toast.info(message, { autoClose: 3000 });

          setJoinRequests((prev) => {
            const alreadyRequested = prev.some((req) => req.userId === userId);
            return alreadyRequested ? prev : [...prev, { userId, fullname, role }];
          });
        }
      });

      // Listen for incoming chat messages
      socket.on('chatMessage', ({ userId, text }) => {
        setMessages((prev) => [...prev, { from: userId, text }]);
      });

      // Update participants list when it changes
      socket.on('participantsUpdate', (newParticipants) => {
        setParticipants(newParticipants);
      });

      // Cleanup listeners on unmount or dependencies change
      return () => {
        socket.off('joinRequest');
        socket.off('chatMessage');
        socket.off('participantsUpdate');
      };
    }
  }, [socket, isConnected, meetingLink]);

  // Cleanup media and socket on component unmount
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [socket, localStream]);

  // Respond to a join request (accept or deny)
  const respondToJoin = (userId, accept) => {
    socket.emit('respondToJoin', { meetingLink, userId, accept });

    if (accept) {
      const acceptedUser = joinRequests.find((req) => req.userId === userId);
      if (acceptedUser && !participants.some((p) => p.userId === userId)) {
        const updatedList = [...participants, acceptedUser];
        setParticipants(updatedList);
        socket.emit('participantsUpdate', updatedList);
      }
    }

    setJoinRequests((prev) => prev.filter((req) => req.userId !== userId));
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    const track = localStream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsCameraOn(track.enabled);
    }
  };

  // Toggle microphone on/off
  const toggleMic = () => {
    const track = localStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    }
  };

  // Confirm and handle meeting disconnect/end
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

  // Send chat message
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    socket.emit('chatMessage', { meetingLink, userId: name, text: chatInput });
    setMessages((prev) => [...prev, { from: name, text: chatInput }]);
    setChatInput('');
  };

  // Panel toggles (participants, chat, meeting info)
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

      {/* Join Requests Panel */}
      {joinRequests.length > 0 && (
        <div className="absolute top-4 right-4 bg-white text-black p-4 rounded shadow-md w-[320px] max-h-[70vh] overflow-auto z-20">
          <h3 className="font-bold mb-2">Join Requests</h3>
          {joinRequests.map(({ userId, fullname, role }) => (
            <div key={userId} className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">{fullname || userId}</span>
                <div className="text-xs text-gray-600">({role || 'Guest'})</div>
              </div>
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

      {/* Chat Panel */}
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

      {/* Participants Panel */}
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

      {/* Meeting Info Panel */}
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
            <p>
              <strong>Joined as:</strong> {name}
            </p>
            <p>
              <strong>Meeting Link:</strong>
            </p>
            <div className="break-words text-blue-700">{meetingLink || 'No meeting link available'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Host;
