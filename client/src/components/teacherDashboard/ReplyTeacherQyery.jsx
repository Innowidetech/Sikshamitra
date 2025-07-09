import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherQueryById,
  postTeacherReply,
} from '../../redux/teacher/teacherQuerySlice';
import { fetchTeacherProfile } from '../../redux/teacher/aboutSlice';
import Header from './layout/Header';

const ReplyTeacherQuery = ({ id, goBack }) => {
  const dispatch = useDispatch();
  const chatRef = useRef(null);

  const { selectedQuery, loading, error, successMessage } = useSelector(
    (state) => state.teacherQuery
  );
  const { teacherProfile } = useSelector((state) => state.about);

  const [message, setMessage] = useState('');

  // Fetch teacher profile to get teacherId
  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  // Fetch query thread
  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherQueryById(id));
    }
  }, [dispatch, id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [selectedQuery]);

  // Log teacher profile to console
  useEffect(() => {
    if (teacherProfile) {
      console.log('📘 Teacher Profile from Redux:', teacherProfile);
      console.log('🆔 Teacher ID:', teacherProfile?.Data?._id);
    }
  }, [teacherProfile]);

  const handleSend = () => {
    if (message.trim()) {
      dispatch(postTeacherReply({ id, message })).then(() => {
        setMessage('');
        dispatch(fetchTeacherQueryById(id));
      });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const messages = selectedQuery?.query?.query || [];
  const teacherId = teacherProfile?.Data?._id;

  return (
    <div>
      {/* Top Header */}
      <div className="flex justify-between items-center mx-4  md:ml-72 flex-wrap">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192]">Connect & Queries</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Main Chat Card */}
      <div className="p-6 md:ml-64 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          {/* Chat Title */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">Contact us for any Query!</h2>
              <p className="text-sm text-gray-500">We are here for you! How can we help?.</p>
            </div>
            {goBack && (
              <button
                onClick={goBack}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Chat Box */}
          <div
            ref={chatRef}
            className="bg-yellow-100 rounded-lg p-4 h-96 overflow-y-auto mb-4"
          >
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const createdById =
                  typeof msg.createdBy === 'object' ? msg.createdBy._id : msg.createdBy;

                const isTeacher = createdById === teacherId;

                return (
                  <div
                    key={msg._id}
                    className={`mb-4 flex ${isTeacher ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded shadow text-sm max-w-xs ${
                        isTeacher ? 'bg-green-200' : 'bg-white'
                      }`}
                    >
                      <div className="text-xs text-gray-600 font-semibold mb-1">
                        {isTeacher ? 'You' : 'User'}
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

          {/* Input Field */}
          <div className="flex items-center border-t pt-3 bg-white">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Type your message here"
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
          {successMessage && (
            <p className="text-green-600 text-sm mt-3">{successMessage}</p>
          )}
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReplyTeacherQuery;
