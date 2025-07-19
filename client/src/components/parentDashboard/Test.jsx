import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../../src/hooks/useSocket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { meetingLink, name = 'Guest', role = 'participant' } = state || {};
  const { socket, isConnected } = useSocket();

  const [canJoin, setCanJoin] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [cameraStarted, setCameraStarted] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraStarted(true);
      setCameraOn(true);
      setMicOn(stream.getAudioTracks()[0]?.enabled ?? true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraStarted(false);
      setCameraOn(false);
      toast.error('🛑 Unable to access camera/mic.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setCameraStarted(false);
    setCameraOn(false);
  };

  // On mount: check meetingLink, start camera if cameraOn
  useEffect(() => {
    if (!meetingLink) {
      navigate('/');
      return;
    }
    if (cameraOn) startCamera();

    return () => stopCamera();
  }, [meetingLink, navigate]);

  // Socket event listeners
  useEffect(() => {
    if (!(socket && isConnected && meetingLink)) return;

    const userId = socket.id;

    // Send join request on connect
    socket.emit('requestJoin', { meetingLink, fullname: name, role, userId });

    socket.on('joinResponse', res => {
      toast[res.success ? 'info' : 'error'](res.message || (res.success ? 'Request received' : 'Join failed'));
    });

    socket.on('joinAccepted', ({ meetingLink: acceptedLink }) => {
      if (acceptedLink === meetingLink) {
        setCanJoin(true);
        toast.success('✅ You have been accepted into the meeting!');
      }
    });

    socket.on('joinDenied', ({ meetingLink: deniedLink }) => {
      if (deniedLink === meetingLink) {
        toast.error('❌ Your join request was denied.');
        navigate('/');
      }
    });

    socket.on('chatMessage', ({ meetingLink: msgLink, from, name: sender, message, timestamp }) => {
      if (msgLink === meetingLink) {
        setMessages(prev => [
          ...prev,
          {
            from: sender || from,
            text: `[${new Date(timestamp).toLocaleTimeString()}] ${sender}: ${message}`,
          },
        ]);
      }
    });

    return () => {
      socket.off('joinResponse');
      socket.off('joinAccepted');
      socket.off('joinDenied');
      socket.off('chatMessage');
    };
  }, [socket, isConnected, meetingLink, name, navigate]);

  // Join meeting when accepted
  useEffect(() => {
    if (canJoin && socket && isConnected) {
      socket.emit('join-meeting', meetingLink);
    }
  }, [canJoin, socket, isConnected, meetingLink]);

  // Toggle mic track enabled state
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  // Toggle camera on/off and start/stop media
  const toggleCamera = async () => {
    if (cameraOn) {
      stopCamera();
    } else {
      await startCamera();
    }
  };

  const handleDisconnect = () => {
    stopCamera();
    socket?.disconnect();
    navigate('/');
  };

  // Send chat message
  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const msg = {
      meetingLink,
      from: name,
      name,
      message: text,
      timestamp: Date.now(),
    };
    socket.emit('chatMessage', msg);
    setMessages(prev => [
      ...prev,
      {
        from: name,
        text: `[${new Date(msg.timestamp).toLocaleTimeString()}] You: ${text}`,
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-4">

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Video container */}
      <div
        className={`relative bg-black rounded-2xl overflow-hidden flex justify-center items-center
          ${canJoin ? 'w-full max-w-full h-[calc(100vh-80px)]' : 'w-[800px] h-[450px]'}
        `}
      >
        <span className="absolute top-2 left-4 text-white text-sm z-10">{name}</span>

        {/* Video or message */}
        {cameraOn && cameraStarted && streamRef.current ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-lg z-10">
            {cameraOn ? 'Starting Camera...' : 'Camera is Off'}
          </span>
        )}
      </div>

      {/* Waiting message if not joined */}
      {!canJoin && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700 mb-2">Waiting for the host to admit you...</p>
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <button
            onClick={handleDisconnect}
            className="mt-6 text-red-600 underline text-sm"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Chat panel */}
      {canJoin && isChatOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 flex flex-col">
          <div className="p-4 font-bold border-b flex justify-between items-center">
            <span>Chat</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-red-600 font-bold"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === name ? 'justify-end' : 'justify-start'}`}
              >
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
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 px-3 border rounded"
              placeholder="Type a message..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bottom control bar with all icons */}
      {canJoin && (
        <div className="absolute bottom-0 w-full bg-black bg-opacity-90 p-3 flex justify-center gap-6 text-xl z-20">
          <button
            onClick={toggleCamera}
            title="Toggle Camera"
            className="hover:text-blue-400 text-white"
            aria-label="Toggle Camera"
          >
            <i className={`fas ${cameraOn ? 'fa-video' : 'fa-video-slash'}`} />
          </button>

          <button
            onClick={toggleMic}
            title="Toggle Mic"
            className="hover:text-blue-400 text-white"
            aria-label="Toggle Microphone"
          >
            <i className={`fas ${micOn ? 'fa-microphone' : 'fa-microphone-slash'}`} />
          </button>

          <button
            onClick={handleDisconnect}
            title="End Call"
            className="bg-red-600 p-2 rounded-full hover:bg-red-700 text-white"
            aria-label="End Call"
          >
            <i className="fas fa-phone-slash" />
          </button>

          <button
            onClick={() => {
              setIsParticipantsOpen(true);
              setIsChatOpen(false);
              setIsMeetingInfoOpen(false);
            }}
            title="Open Participants"
            aria-label="Open Participants"
            className="hover:text-blue-400 text-white"
          >
            <i className="fas fa-users" />
          </button>

          <button
            onClick={() => {
              setIsChatOpen(true);
              setIsParticipantsOpen(false);
              setIsMeetingInfoOpen(false);
            }}
            title="Open Chat"
            aria-label="Open Chat"
            className="hover:text-blue-400 text-white"
          >
            <i className="fas fa-comment-dots" />
          </button>

          <button
            onClick={() => {
              setIsMeetingInfoOpen(true);
              setIsChatOpen(false);
              setIsParticipantsOpen(false);
            }}
            title="Open Meeting Info"
            aria-label="Open Meeting Info"
            className="hover:text-blue-400 text-white"
          >
            <i className="fas fa-info-circle" />
          </button>
        </div>
      )}

      {/* Participants Panel placeholder */}
      {canJoin && isParticipantsOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 p-4">
          <div className="font-bold mb-4 flex justify-between">
            <span>Participants</span>
            <button onClick={() => setIsParticipantsOpen(false)} className="text-red-600 font-bold">Close</button>
          </div>
          {/* TODO: Show participants list */}
          <p>No participants list implemented yet.</p>
        </div>
      )}

      {/* Meeting Info Panel placeholder */}
      {canJoin && isMeetingInfoOpen && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white text-black shadow-lg z-30 p-4">
          <div className="font-bold mb-4 flex justify-between">
            <span>Meeting Info</span>
            <button onClick={() => setIsMeetingInfoOpen(false)} className="text-red-600 font-bold">Close</button>
          </div>
          {/* TODO: Show meeting info */}
          <p>No meeting info implemented yet.</p>
        </div>
      )}
    </div>
  );
};

export default Test;
