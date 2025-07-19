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
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera/mic
  useEffect(() => {
    if (!meetingLink) {
      navigate('/');
      return;
    }

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        setIsMicOn(true);
      } catch (err) {
        toast.error('Unable to access camera/mic.');
      }
    };

    initMedia();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [meetingLink, navigate]);

  // Handle socket connections and listeners
  useEffect(() => {
    if (!socket || !isConnected || !meetingLink) return;

    socket.emit('join-meeting', meetingLink);

    const handleJoinRequest = ({ meetingLink: reqLink, userId, fullname, role }) => {
      if (reqLink === meetingLink) {
        setJoinRequests(prev => {
          const alreadyRequested = prev.some(req => req.userId === userId);
          if (!alreadyRequested) {
            toast.info(`${fullname || 'Someone'} is requesting to join.`);
            return [...prev, { userId, fullname, role }];
          }
          return prev;
        });
      }
    };

    const handleChatMessage = ({ meetingLink: msgLink, from, name: sender, message, timestamp }) => {
      if (msgLink === meetingLink) {
        setMessages(prev => [
          ...prev,
          {
            from: sender || from,
            text: `[${new Date(timestamp).toLocaleTimeString()}] ${sender || from}: ${message}`,
          },
        ]);
      }
    };

    const handleParticipantsUpdate = (list) => {
      setParticipants(list || []);
    };

    socket.on('joinRequest', handleJoinRequest);
    socket.on('chatMessage', handleChatMessage);
    socket.on('participantsUpdate', handleParticipantsUpdate);

    return () => {
      socket.off('joinRequest', handleJoinRequest);
      socket.off('chatMessage', handleChatMessage);
      socket.off('participantsUpdate', handleParticipantsUpdate);
    };
  }, [socket, isConnected, meetingLink]);

  const respondToJoin = (userId, accept) => {
    if (!socket) return;
    socket.emit('respondToJoin', { meetingLink, userId, accept });

    if (accept) {
      const accepted = joinRequests.find(req => req.userId === userId);
      if (accepted && !participants.find(p => p.userId === userId)) {
        const updatedList = [...participants, accepted];
        setParticipants(updatedList);
        socket.emit('participantsUpdate', updatedList);
      }
    }

    setJoinRequests(prev => prev.filter(req => req.userId !== userId));
  };

  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsCameraOn(track.enabled);
    }
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !socket) return;
    const msg = {
      meetingLink,
      userId: name,
      name,
      message: chatInput,
      timestamp: Date.now(),
    };
    socket.emit('chatMessage', msg);
    setMessages(prev => [
      ...prev,
      {
        from: name,
        text: `[${new Date(msg.timestamp).toLocaleTimeString()}] You: ${chatInput}`,
      },
    ]);
    setChatInput('');
  };

  const handleDisconnect = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    socket?.disconnect();
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Video feed */}
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500">
        {streamRef.current && isCameraOn ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-600 flex items-center justify-center">
            <p className="text-white text-lg">Camera is Off</p>
          </div>
        )}
      </div>

      {/* Bottom control buttons */}
      <div className="absolute bottom-0 w-full bg-black bg-opacity-90 p-3 flex justify-center gap-6 text-xl z-10">
        <button onClick={toggleCamera} title="Toggle Camera" className="hover:text-blue-400" aria-label="Toggle Camera">
          <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`} />
        </button>
        <button onClick={toggleMic} title="Toggle Mic" className="hover:text-blue-400" aria-label="Toggle Microphone">
          <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`} />
        </button>
        <button onClick={handleDisconnect} title="End Call" className="bg-red-600 p-2 rounded-full hover:bg-red-700" aria-label="End Call">
          <i className="fas fa-phone-slash" />
        </button>
        <button
          onClick={() => {
            setIsParticipantsOpen(true);
            setIsChatOpen(false);
            setIsMeetingInfoOpen(false);
          }}
          aria-label="Open Participants"
        >
          <i className="fas fa-users" />
        </button>
        <button
          onClick={() => {
            setIsChatOpen(true);
            setIsParticipantsOpen(false);
            setIsMeetingInfoOpen(false);
          }}
          aria-label="Open Chat"
        >
          <i className="fas fa-comment-dots" />
        </button>
        <button
          onClick={() => {
            setIsMeetingInfoOpen(true);
            setIsChatOpen(false);
            setIsParticipantsOpen(false);
          }}
          aria-label="Open Meeting Info"
        >
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

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 flex flex-col">
          <div className="p-4 font-bold border-b flex justify-between items-center">
            <span>Chat</span>
            <button onClick={() => setIsChatOpen(false)} className="text-red-600 font-bold">
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
                  {m.text}
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
              aria-label="Chat message input"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={!chatInput.trim()}
              aria-label="Send chat message"
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
            <button onClick={() => setIsParticipantsOpen(false)} className="text-red-600 font-bold">
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {participants.length === 0 ? (
              <p className="text-gray-600 italic">No participants yet.</p>
            ) : (
              participants.map(({ userId, fullname }, i) => (
                <div key={userId || i} className="py-2 px-3 border rounded mb-2">
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
            <button onClick={() => setIsMeetingInfoOpen(false)} className="text-red-600 font-bold">
              Close
            </button>
          </div>
          <div className="flex-1 p-4 space-y-2 break-words">
            <p>
              <strong>Host Name:</strong> {name}
            </p>
            <p>
              <strong>Meeting Link:</strong>{' '}
              <a href={meetingLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                {meetingLink}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Host;

