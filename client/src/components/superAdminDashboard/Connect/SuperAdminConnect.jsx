import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchConnectMeetings,
  fetchSuperAdminQueries,
} from "../../../redux/superAdmin/superAdminConnectSlice";
import { io } from "socket.io-client";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

const formatTime12Hour = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const SuperAdminConnect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const { meetings, queriesReceived, queriesSent, loading, error } =
    useSelector((state) => state.connectAndQuery);

  useEffect(() => {
    dispatch(fetchConnectMeetings());
    dispatch(fetchSuperAdminQueries());
    const socketInstance = io("https://sikshamitra.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to socket:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection failed:", err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [dispatch]);

  const handleJoinMeeting = (connect) => {
    if (connect.status === "Not Started") {
      toast.error("Meeting has not yet started.");
      return;
    } else if (connect.status === "Expired") {
      toast.error("Meeting has expired.");
      return;
    }

    if (connect.status === "Live") {
      const meetingLink = connect.meetingLink;
      const name = "Superadmin";
      const loggedInId = `678de5c759f59cce422d8e08`;

      const meetingCreatorId =
        typeof connect.createdBy === "string"
          ? connect.createdBy
          : connect.createdBy?._id;

      const isHost = loggedInId === meetingCreatorId;
      const role = "superadmin";

      if (socket) {
        socket.emit("requestJoin", { meetingLink, role, name });
        if (!isHost) toast.info(`Request to join meeting sent: ${meetingLink}`);
      }
     
      console.log("Navigating to:", isHost ? `/host/${meetingLink}` : `/test/${meetingLink}`);

     navigate(
  isHost
    ? `/host/${encodeURIComponent(meetingLink)}`
    : `/test/${encodeURIComponent(meetingLink)}`,
  {
    state: {
      meetingId: meetingLink,
      role,
      name,
    },
  }
);

    }
  };

  return (
    <div>
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">
          Connect & Query
        </h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[260px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Connect & Query</span>
        </h1>
      </div>
      <div className="p-6 bg-white rounded-lg shadow space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-[#146192E8]">
              Contact Us for Any Query!
            </h2>
            <p className="text-sm text-gray-600">
              We are here for you! How can we help?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/superadmin/connect-queries/Queries")}
              className="px-4 py-1 text-sm text-[#146192E8] border border-[#146192E8] rounded "
            >
              Queries
            </button>
            <button
              onClick={() => navigate("/superadmin/meeting")}
              className="px-4 py-1 text-sm text-[#146192E8] border border-[#146192E8] rounded "
            >
              Connect
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Ongoing / Upcoming Meetings */}
        <div>
          <h3 className="font-semibold mb-2">Ongoing / Upcoming Meetings</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-[#146192E8] text-white">
                <tr>
                  <th className="p-2 border">S.NO</th>
                  <th className="p-2 border">Meeting Title</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                  <th className="p-2 border">Hosted by</th>
                  <th className="p-2 border">Link</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting, index) => (
                  <tr key={meeting._id || index} className="bg-white">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{meeting.title}</td>
                    <td className="p-2 border">
                      {moment(meeting.startDate).format("DD-MM-YYYY")}
                    </td>
                    <td className="p-2 border">
                      {formatTime12Hour(meeting.startTime)}
                    </td>
                    <td className="p-2 border">{meeting.hostedByName}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleJoinMeeting(meeting)}
                        className="text-blue-600 underline"
                      >
                        Join Meeting
                      </button>
                    </td>
                    <td className="p-2 border">
                      {meeting.status ? (
                        <select
                          className="text-xs border rounded p-1"
                          defaultValue={meeting.status}
                        >
                          <option>Pending</option>
                          <option>Accepted</option>
                          <option>Rejected</option>
                        </select>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Received by Super Admin */}
        <div>
          <h3 className="font-semibold mb-2">Query Received by Super Admin</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-[#146192E8] text-white">
                <tr>
                  <th className="p-2 border">S.NO</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">School Name</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Email id</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesReceived.map((query, index) => (
                  <tr key={query._id || index} className="bg-white">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{query.name}</td>
                    <td className="p-2 border">{query.schoolName}</td>
                    <td className="p-2 border">{query.contact}</td>
                    <td className="p-2 border">{query.email}</td>
                    <td className="p-2 border">
                      <button className="text-sm text-[#146192E8] underline hover:text-blue-800">
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Sent by Super Admin */}
        <div>
          <h3 className="font-semibold mb-2">Query Sent by Super Admin</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-[#146192E8] text-white">
                <tr>
                  <th className="p-2 border">S.NO</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Email id</th>
                  <th className="p-2 border">School Name</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesSent.map((query, index) => (
                  <tr key={query._id || index} className="bg-white">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{query.name}</td>
                    <td className="p-2 border">{query.contact}</td>
                    <td className="p-2 border">{query.email}</td>
                    <td className="p-2 border">{query.schoolName}</td>
                    <td className="p-2 border">
                      <button className="text-sm text-[#146192E8] underline hover:text-blue-800">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminConnect;
