import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../../src/hooks/useSocket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





const presetBackgrounds = [
  '/images/bg1.jpg',
  '/images/bg-2.jpg',
  '/images/bg3.jpg',
  '/images/bg-4.webp',
  '/images/bg5.webp',
  '/images/bg6.jpg',
];

const Host = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { meetingLink, name = 'Host' } = state || {};
  const { socket, isConnected } = useSocket();

  const [videoKey, setVideoKey] = useState(0);
  const [joinRequests, setJoinRequests] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isMeetingInfoOpen, setIsMeetingInfoOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [backgroundOption, setBackgroundOption] = useState('none');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [filterOption, setFilterOption] = useState('none');
  const [selectedTab, setSelectedTab] = useState('background');
  const [activeTab, setActiveTab] = useState('background');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
const screenStreamRef = useRef(null);



  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

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
      streamRef.current = null;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, [meetingLink, navigate]);

  useEffect(() => {
  if (localVideoRef.current && streamRef.current) {
    localVideoRef.current.srcObject = streamRef.current;
  }
  console.log('Background changed to:', backgroundOption, backgroundImage);
}, [backgroundOption, backgroundImage]);


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

useEffect(() => {
  if (localVideoRef.current && streamRef.current) {
    localVideoRef.current.srcObject = streamRef.current;
  }
}, [isCameraOn]);


const toggleCamera = async () => {
  if (isCameraOn) {
    // Turn camera off
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.stop(); // Stop the track completely
      // Remove the video track from the stream
      streamRef.current.removeTrack(videoTrack);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null; // Clear video element
    }
    setIsCameraOn(false);
  } else {
    // Turn camera on - get a new stream or video track
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newVideoTrack = newStream.getVideoTracks()[0];
      if (newVideoTrack) {
        // Add new track to streamRef or create new streamRef
        if (!streamRef.current) {
          streamRef.current = new MediaStream();
        }
        streamRef.current.addTrack(newVideoTrack);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
        setIsCameraOn(true);
      }
    } catch (err) {
      toast.error('Unable to enable the camera.');
    }
  }
};


  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    }
  };

  const toggleScreenShare = async () => {
  if (isScreenSharing) {
    // Stop screen sharing
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;
    
    // Restore original camera stream to video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
    
    setIsScreenSharing(false);
  } else {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      
      // Listen for when user stops screen sharing from browser UI
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setIsScreenSharing(false);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
      });
      
      setIsScreenSharing(true);
    } catch (err) {
      toast.error('Screen sharing permission denied or failed.');
    }
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

      <div className="absolute top-4 left-4 z-50">
        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="bg-white text-black rounded-full p-2 shadow hover:bg-gray-100">
          <i className="fas fa-user-circle text-2xl" />
        </button>
      </div>

    {showProfileMenu && (
  <div className="absolute top-16 left-4 bg-white text-black p-4 rounded shadow-md w-72 z-50">
    <div className="flex mb-3 border-b">
      <button
        onClick={() => setActiveTab('background')}
        className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'background' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
      >
        Background
      </button>
      <button
        onClick={() => setActiveTab('filter')}
        className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'filter' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
      >
        Filter
      </button>
    </div>

    {/* Background Tab */}
    {activeTab === 'background' && (
      <div className="space-y-3">
        <button
          onClick={() => {
            setBackgroundOption('blur');
            setBackgroundImage(null);
          }}
          className="block text-blue-600 hover:underline"
        >
          Blur Background
        </button>

        <label className="block text-blue-600 hover:underline cursor-pointer">
          Upload from Gallery
          <input
            type="file"
            accept="image/*"
            className="hidden"
           onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    const imgUrl = URL.createObjectURL(file);
    setBackgroundImage(imgUrl);
    setBackgroundOption('gallery');
  }
}}

          />
        </label>

        <button
          onClick={() => {
            setBackgroundOption('none');
            setBackgroundImage(null);
            setFilterOption('none');
          }}
          className="text-red-600 hover:underline"
        >
          Remove Background
        </button>
      </div>
    )}

     {/* ✅ Add this preset background filter block here */}
   <div className="mt-4">
  <h3 className="font-semibold mb-2">Background Filters</h3>
  <div className="grid grid-cols-3 gap-2">
    {presetBackgrounds.map((url, index) => (
      <img
        key={index}
        src={url}
        alt={`Preset ${index + 1}`}
      onClick={() => {
  console.log('Selected image:', url);
  setBackgroundImage(url);
  setBackgroundOption('preset');


}}

        className="w-full h-20 object-cover cursor-pointer rounded hover:ring-2 ring-blue-500"
      />
    ))}
  </div>
</div>

  </div>
)}

   
{/* Background layer wrapper */}
<div className="absolute inset-0 w-full h-full overflow-hidden">

  {/* ✅ Custom Background Image */}
  {(backgroundOption === 'gallery' || backgroundOption === 'preset') && backgroundImage && (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )}

  {/* ✅ Blur Background */}
  {backgroundOption === 'blur' && (
    <div className="absolute inset-0 z-0 bg-black/30 backdrop-blur-md" />
  )}

  {/* ✅ Video Layer */}
   {/* ✅ Video Layer */}
  {isCameraOn && streamRef.current ? (
   <video
  ref={localVideoRef}
  autoPlay
  muted
  playsInline
  className="w-full h-full object-cover relative z-10 bg-transparent"
/>

  ) : (
    <div className="w-full h-full bg-purple-600 flex items-center justify-center relative z-10">
      <p className="text-white text-lg">Camera is Off</p>
    </div>
  )}
</div>




      {/* Bottom Controls */}
      <div className="absolute bottom-0 w-full bg-black bg-opacity-90 p-3 flex justify-center gap-6 text-xl z-10">
        <button onClick={toggleCamera} title="Toggle Camera" className="hover:text-blue-400">
          <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`} />
        </button>
        <button onClick={toggleMic} title="Toggle Mic" className="hover:text-blue-400">
          <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`} />
        </button>
        <button onClick={handleDisconnect} title="End Call" className="bg-red-600 p-2 rounded-full hover:bg-red-700">
          <i className="fas fa-phone-slash" />
        </button>
        <button onClick={() => { setIsParticipantsOpen(true); setIsChatOpen(false); setIsMeetingInfoOpen(false); }}>
          <i className="fas fa-users" />
        </button>
        <button onClick={() => { setIsChatOpen(true); setIsParticipantsOpen(false); setIsMeetingInfoOpen(false); }}>
          <i className="fas fa-comment-dots" />
        </button>
        <button onClick={() => { setIsMeetingInfoOpen(true); setIsChatOpen(false); setIsParticipantsOpen(false); }}>
          <i className="fas fa-info-circle" />
        </button>
        <button
  onClick={toggleScreenShare}
  title={isScreenSharing ? "Stop Screen Sharing" : "Share Screen"}
  className="hover:text-blue-400"
>
  <i className={`fas fa-${isScreenSharing ? 'stop-circle' : 'desktop'}`} />
</button>

      </div>

      {/* Join Requests */}
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
                <button onClick={() => respondToJoin(userId, true)} className="text-green-600 mr-2 hover:underline">
                  Accept
                </button>
                <button onClick={() => respondToJoin(userId, false)} className="text-red-600 hover:underline">
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
            <button onClick={() => setIsChatOpen(false)} className="text-red-600 font-bold">Close</button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === name ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded px-3 py-1 max-w-[80%] ${m.from === name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
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
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={!chatInput.trim()}
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
            <button onClick={() => setIsParticipantsOpen(false)} className="text-red-600 font-bold">Close</button>
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
            <button onClick={() => setIsMeetingInfoOpen(false)} className="text-red-600 font-bold">Close</button>
          </div>
          <div className="flex-1 p-4 space-y-2 break-words">
            <p><strong>Host Name:</strong> {name}</p>
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
