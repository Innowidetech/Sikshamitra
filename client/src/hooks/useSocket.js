import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://sikshamitra.onrender.com';

export const useSocket = () => {
  const [socket, setSocket] = useState(null); // 🔄 useState instead of useRef
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No auth token found!');
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: { token },
    });

    setSocket(newSocket); // ✅ This triggers re-render

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
  };
};
 