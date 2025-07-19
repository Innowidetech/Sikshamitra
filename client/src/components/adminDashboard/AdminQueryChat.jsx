import React, { useState, useRef, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { IoIosSend } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import {
  replyToQuery,
  fetchQueryById,
} from '../../redux/adminConnectQueriesSlice';

const AdminQueryChat = ({ query, onBack }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState(query?.query || []);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Handle both object or string form of admin ID
  const adminId =
    typeof query.sendTo === 'object' ? query.sendTo._id : query.sendTo;

  // Set messages on query load
  useEffect(() => {
    setLocalMessages(query?.query || []);
  }, [query]);

  // Scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);

    try {
      // Send the reply
      await dispatch(replyToQuery({ id: query._id, message: newMessage }));

      // Clear input
      setNewMessage('');

      // Refresh messages after successful send
      const refreshed = await dispatch(fetchQueryById(query._id));
      setLocalMessages(refreshed.payload?.query || []);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b-2 pb-2">
        <button
          onClick={onBack}
          className="text-2xl text-gray-700 hover:text-gray-900"
          aria-label="Back"
        >
          <IoArrowBack />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-[#146192] border-b-2 border-[#146192]">
          Connect & Queries
        </h2>
      </div>

      {/* Chat Box */}
      <div className="bg-[#FFF2BF] rounded-lg shadow-md p-4 min-h-[400px] flex flex-col justify-between">
        {/* Messages Section */}
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {/* Header message */}
          <div className="mb-4">
            <h3 className="text-[#146192] text-lg font-bold">Contact Us for Any Query!</h3>
            <p className="text-sm text-gray-700">We are here for you! How can we help?</p>
          </div>

          {/* Chat messages */}
          {localMessages.length > 0 ? (
            localMessages.map((msg) => {
              const creatorId =
                typeof msg.createdBy === 'object' ? msg.createdBy._id : msg.createdBy;
              const isAdmin = creatorId === adminId;

              return (
                <div
                  key={msg._id}
                  className={`max-w-[70%] p-3 mb-3 rounded-lg text-sm break-words ${
                    isAdmin ? 'bg-blue-100 ml-auto text-left' : 'bg-white mr-auto text-left'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex mt-6 border-t pt-3 items-center">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            className={`px-4 py-2 rounded-r-lg text-white text-xl ${
              isSending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#FDBD3F] hover:bg-[#f8a200]'
            }`}
            disabled={isSending}
            aria-label="Send message"
          >
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQueryChat;
