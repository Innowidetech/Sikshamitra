// src/components/studentDashboard/QueryChatPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQueryById,
  replyToQuery,
} from '../../redux/student/connectQueriesSlice';
import { fetchProfile } from '../../redux/student/studentProfileSlice';
import dayjs from 'dayjs';

const QueryChatPage = ({ id, mode, onBack }) => {
  const dispatch = useDispatch();
  const chatRef = useRef(null);

  const [message, setMessage] = useState('');
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId'));
  const userId = localStorage.getItem('userId');

  const { singleQuery, loading, error, replyStatus } = useSelector(
    (state) => state.connectQueries
  );

  // 1) Fetch profile to get the actual studentId (Data._id)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchProfile(token)).then((res) => {
        const fetchedId = res?.payload?.Data?._id;
        if (fetchedId) {
          localStorage.setItem('studentId', fetchedId);
          setStudentId(fetchedId);
        }
      });
    }
  }, [dispatch]);

  // 2) Load the conversation
  useEffect(() => {
    if (id) {
      dispatch(fetchQueryById(id));
    }
  }, [dispatch, id]);

  // 3) Auto‐scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [singleQuery]);

  const handleSend = () => {
    if (!message.trim()) return;
    dispatch(replyToQuery({ id, message })).then(() => {
      setMessage('');
      dispatch(fetchQueryById(id));
    });
  };

  const formatTime = (ts) => dayjs(ts).format('hh:mm A');

  const messages = singleQuery?.query || [];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Connect & Queries</h2>
            <p className="text-sm text-gray-500">
              {singleQuery?.name} ({singleQuery?.createdByRole})
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div
          ref={chatRef}
          className="bg-yellow-100 rounded-lg p-4 h-96 overflow-y-auto mb-4"
        >
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const creator =
                typeof msg.createdBy === 'object' ? msg.createdBy._id : msg.createdBy;
              const isMine = creator === studentId || creator === userId;

              return (
                <div
                  key={msg._id}
                  className={`mb-4 flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded shadow text-sm max-w-xs ${
                      isMine ? 'bg-green-200' : 'bg-white'
                    }`}
                  >
                    <div className="text-xs text-gray-600 font-semibold mb-1">
                      {isMine ? 'You' : 'Admin'}
                    </div>
                    {msg.message}
                    <div className="text-[10px] text-gray-500 text-right mt-1">
                      {formatTime(msg.sentAt)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}
        </div>

        {/* Always Show Reply Box */}
        <div className="flex items-center border-t pt-3 bg-white">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
            placeholder="Please type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-orange-400 text-white p-3 rounded-full hover:bg-orange-500 transition"
          >
            ➤
          </button>
        </div>

        {/* Feedback */}
        {replyStatus === 'success' && (
          <p className="text-green-600 text-sm mt-3">Message sent successfully!</p>
        )}
        {replyStatus === 'error' && error && (
          <p className="text-red-600 text-sm mt-3">{error}</p>
        )}
      </div>
    </div>
  );
};

export default QueryChatPage;
