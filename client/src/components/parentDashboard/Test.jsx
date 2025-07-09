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

const Test = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { meetingLink, name = 'Guest', role = 'participant' } = state || {};
  const { socket, isConnected } = useSocket();

  const [canJoin, setCanJoin] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [cameraStarted, setCameraStarted] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 🔄 Start camera & mic
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

  // 🛑 Stop camera
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

  // 🎥 Initialize on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // 🔌 Emit join request to host
  useEffect(() => {
    if (socket && isConnected && meetingLink) {
      console.log('📤 Sending joinRequest →', { meetingLink, fullname: name, role });
      socket.emit('joinRequest', { meetingLink, fullname: name, role });

      socket.on('joinAccepted', ({ meetingLink: acceptedLink }) => {
        if (acceptedLink === meetingLink) {
          console.log('✅ Join accepted!');
          setCanJoin(true);
        }
      });

      socket.on('joinDenied', ({ meetingLink: deniedLink }) => {
        if (deniedLink === meetingLink) {
          console.log('❌ Join denied.');
          alert('❌ Your request was denied.');
          navigate('/');
        }
      });

      return () => {
        socket.off('joinAccepted');
        socket.off('joinDenied');
      };
    }
  }, [socket, isConnected, meetingLink, name, role, navigate]);

  // ⏳ Automatically join if accepted
  useEffect(() => {
    if (canJoin && socket && isConnected && meetingLink) {
      console.log('🎉 Emitting join-meeting');
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      {/* Left: Camera Preview */}
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
          <button
            onClick={toggleCamera}
            className="bg-white p-2 rounded-full hover:bg-gray-200"
          >
            {cameraOn ? '📷' : '🚫'}
          </button>
          <button
            onClick={toggleMic}
            className="bg-white p-2 rounded-full hover:bg-gray-200"
          >
            {micOn ? '🎤' : '🔇'}
          </button>
        </div>
      </div>

      {/* Right: Waiting for approval */}
      <div className="ml-10 text-center">
        <p className="text-sm text-gray-700 mb-2">
          You will join the meeting when the admin lets you in.
        </p>
        <div className="flex justify-center">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <button
          onClick={handleDisconnect}
          className="mt-6 text-red-600 underline text-sm"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Test;