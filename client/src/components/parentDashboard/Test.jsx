
// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useSocket } from '../../../src/hooks/useSocket';

// const Test = () => {
//   const { state } = useLocation();
//   const { meetingLink } = state || {};
//   const { socket, isConnected } = useSocket();

//   useEffect(() => {
//     if (socket && isConnected && meetingLink) {
//       socket.emit('join-meeting', meetingLink);
//     }
//   }, [socket, isConnected, meetingLink]);

//   const handleDisconnect = () => {
//     socket?.disconnect();
//   };

//   return (
//     <div>
//       <h1>🙋‍♂️ Attendee Page</h1>
//       <p>{isConnected ? '🟢 Connected as Attendee' : '🔴 Not Connected'}</p>
//       <button onClick={handleDisconnect} disabled={!isConnected}>🔌 Disconnect Socket</button>
//     </div>
//   );
// };

// export default Test;


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
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStarted(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setCameraStarted(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStarted(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (socket && isConnected && meetingLink) {
      const userId = socket.id;

      socket.emit('requestJoin', { meetingLink, fullname: name, role, userId });

      socket.on('joinResponse', (res) => {
        if (res.success) {
          toast.info(res.message);
        } else {
          toast.error(res.message || 'Join request failed');
        }
      });

      socket.on('joinAccepted', ({ meetingLink: acceptedLink, by }) => {
        if (acceptedLink === meetingLink) {
          socket.emit('joinAccepted', { meetingLink });
          setCanJoin(true);
          toast.success('You have been allowed into the meeting!');
        }
      });

      socket.on('joinDenied', ({ meetingLink: deniedLink }) => {
        if (deniedLink === meetingLink) {
          toast.error('❌ Your request was denied.');
          navigate('/');
        }
      });

      socket.on('chatMessage', ({ meetingLink: msgLink, from, name: sender, message, timestamp }) => {
        if (msgLink === meetingLink) {
          setMessages((prev) => [
            ...prev,
            {
              from: sender || from,
              text: `[${new Date(timestamp).toLocaleTimeString()}] ${sender}: ${message}`,
            },
          ]);
        }
      });

      socket.on('participantsUpdate', (participantList) => {
        console.log('👥 Updated participants list:', participantList);
      });

      return () => {
        socket.off('joinResponse');
        socket.off('joinAccepted');
        socket.off('joinDenied');
        socket.off('chatMessage');
        socket.off('participantsUpdate');
      };
    }
  }, [socket, isConnected, meetingLink, name, role, navigate]);

  useEffect(() => {
    if (canJoin && socket && isConnected && meetingLink) {
      socket.emit('join-meeting', meetingLink);
    }
  }, [canJoin, socket, isConnected, meetingLink]);

  const toggleMic = () => {
    setMicOn((prev) => {
      const audioTracks = streamRef.current?.getAudioTracks();
      if (audioTracks?.length) {
        audioTracks[0].enabled = !prev;
      }
      return !prev;
    });
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      stopCamera();
      setCameraOn(false);
    } else {
      await startCamera();
      setCameraOn(true);
    }
  };

  const handleDisconnect = () => {
    stopCamera();
    setCameraOn(false);
    setCameraStarted(false);
    socket?.disconnect();
    navigate('/');
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const msg = {
      meetingLink,
      from: name,
      name,
      role,
      message: chatInput,
      timestamp: Date.now(),
    };

    socket.emit('chatMessage', msg);
    setMessages((prev) => [
      ...prev,
      { from: name, text: `[${new Date(msg.timestamp).toLocaleTimeString()}] You: ${chatInput}` },
    ]);
    setChatInput('');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Camera Preview */}
      <div className="relative bg-black w-[800px] h-[450px] rounded-2xl flex items-center justify-center overflow-hidden">
        <span className="absolute top-2 left-4 text-white text-sm">{name}</span>

        {cameraOn && cameraStarted && streamRef.current ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-lg">
            {cameraOn ? 'Camera is Starting' : 'Camera is Off'}
          </span>
        )}

        <div className="absolute bottom-4 flex items-center justify-center space-x-6">
          <button onClick={toggleCamera} className="bg-white p-2 rounded-full hover:bg-gray-200">
            {cameraOn ? '📷' : '🚫'}
          </button>
          <button onClick={toggleMic} className="bg-white p-2 rounded-full hover:bg-gray-200">
            {micOn ? '🎤' : '🔇'}
          </button>
          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            className="bg-white p-2 rounded-full hover:bg-gray-200"
          >
            💬
          </button>
        </div>
      </div>

      {/* Right: Waiting + Disconnect */}
      <div className="ml-10 text-center">
        <p className="text-sm text-gray-700 mb-2">
          You will join the meeting when the admin lets you in.
        </p>
        <div className="flex justify-center">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <button onClick={handleDisconnect} className="mt-6 text-red-600 underline text-sm">
          Disconnect
        </button>
      </div>

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
    </div>
  );
};

export default Test;
