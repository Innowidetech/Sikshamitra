import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchQueryById,
  postSuperAdminQueryReply,
} from "../../../redux/superAdmin/superAdminConnectSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../layout/Header";

const SuperAdminReplyPage = ({ goBack }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const chatRef = useRef(null);
  const [message, setMessage] = useState("");

  const { singleQuery, loading, replyLoading, replySuccess, error } =
    useSelector((state) => state.connectAndQuery || {});

  const queryData = singleQuery; // ✅ The actual object is under queryData.query
  const messages = queryData?.query || [];

  const loggedInUserId = localStorage.getItem("userId");

  // Fetch query details
  useEffect(() => {
    if (id) {
      dispatch(fetchQueryById(id));
    }
  }, [dispatch, id]);

  // Refetch on reply success
  useEffect(() => {
    if (replySuccess) {
      dispatch(fetchQueryById(id));
    }
  }, [replySuccess, dispatch, id]);

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Send reply
  const handleSend = () => {
    if (message.trim()) {
      dispatch(postSuperAdminQueryReply({ id, replyMessage: message }))
        .unwrap()
        .then(() => setMessage(""))
        .catch((err) => {
          toast.error(err?.message || "Failed to send reply");
        });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">
              Connect & Queries
            </h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2 text-sm md:text-base">
              <span>Home</span> {">"}{" "}
              <span className="font-medium text-[#146192]">
                Connect & Queries{" "}
              </span>
            </h1>
          </div>

          <Header />
        </div>
      </div>

      <div className="">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">
                Contact Us for Any Query!
              </h2>
              <p className="text-sm text-gray-500">
                We are here for you! How can we help?
              </p>
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

          {/* Chat Area */}
          <div
            ref={chatRef}
            className="bg-yellow-100 rounded-lg p-4 h-96 overflow-y-auto mb-4"
          >
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const createdById =
                  typeof msg.createdBy === "object"
                    ? msg.createdBy._id
                    : msg.createdBy;

                const isUser = createdById === loggedInUserId;

                return (
                  <div
                    key={msg._id}
                    className={`mb-4 flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded shadow text-sm max-w-xs ${
                        isUser ? "bg-green-200" : "bg-white"
                      }`}
                    >
                      <div className="text-xs text-gray-600 font-semibold mb-1">
                        {isUser ? "You" : queryData?.createdByRole || "User"}
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

          {/* Input Box */}
          <div className="flex items-center border-t pt-3 bg-white">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Please type here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={replyLoading}
            />
            <button
              onClick={handleSend}
              disabled={replyLoading || !message.trim()}
              className="ml-2 bg-orange-400 text-white p-3 rounded-full hover:bg-orange-500 transition disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReplyPage;
