import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQueryById, replyToQuery } from '../../redux/staff/staffDashboardSlice';
import Header from '../adminStaffDashboard/layout/Header';
import dayjs from 'dayjs';
import { SendHorizonal } from 'lucide-react';

const StaffQueryReply = ({ data, onBack }) => {
  const dispatch = useDispatch();
  const chatRef = useRef(null);

  const [message, setMessage] = useState('');
  const [userId] = useState(localStorage.getItem('userId'));
  const queryId = data?._id;

  const { selectedQuery, replyStatus, queryError } = useSelector(
    (state) => state.staffDashboard
  );

  const messages = selectedQuery?.query || [];

  // Fetch selected query
  useEffect(() => {
    if (queryId) {
      dispatch(getQueryById(queryId));
    }
  }, [dispatch, queryId]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    dispatch(replyToQuery({ queryId, replyMessage: message }))
      .unwrap()
      .then(() => {
        setMessage('');
        dispatch(getQueryById(queryId)); // Refresh messages
      });
  };

  const formatTime = (timestamp) => dayjs(timestamp).format('hh:mm A');

  return (
    <div className="bg-[#f3f9fb] min-h-screen pt-20">
      <Header />
      <div className="p-4 md:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 md:ml-64 pb-8">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Query Reply</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> &gt;{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Query Reply
              </span>
            </h1>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden md:ml-64">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-[#01497c]">
              Contact Us for Any Query!
            </h2>
            <p className="text-sm text-gray-600">
              We are here for you! How can we help?
            </p>
          </div>

          {/* Chat Box */}
          <div ref={chatRef} className="bg-[#fffbcc] px-4 py-6 h-[300px] overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const creator =
                  typeof msg.createdBy === 'object' ? msg.createdBy._id : msg.createdBy;
                const isMine = creator === userId;

                return (
                  <div
                    key={msg._id}
                    className={`mb-4 flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg shadow text-sm max-w-xs ${
                        isMine ? 'bg-green-100' : 'bg-white'
                      }`}
                    >
                      <div className="text-xs text-gray-600 font-semibold mb-1">
                        {isMine ? 'You' : selectedQuery.createdByRole || 'Admin'}
                      </div>
                      <div className="text-black">{msg.message}</div>
                      <div className="text-[10px] text-gray-500 text-right mt-1">
                        {formatTime(msg.sentAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center">No messages yet. Start the conversation!</p>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 px-4 pt-2 pb-4 border-t bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please type here"
              className="flex-grow px-4 py-2 text-sm border rounded-full focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="flex items-center justify-center h-10 w-10 bg-[#ffc04d] hover:bg-[#e6a800] text-white rounded-full"
              title="Send Reply"
            >
              <SendHorizonal size={18} />
            </button>
          </div>

          {/* Feedback */}
          {replyStatus === 'success' && (
            <p className="text-green-600 text-center mt-3">Reply sent successfully!</p>
          )}
          {replyStatus === 'failed' && queryError && (
            <p className="text-red-600 text-center mt-3">{queryError}</p>
          )}
        </div>

        {/* Back Button */}
        <div className="md:ml-64 mt-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffQueryReply;
