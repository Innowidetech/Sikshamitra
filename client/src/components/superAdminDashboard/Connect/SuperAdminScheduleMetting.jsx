import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSchoolNames,
  createMeeting,
} from "../../../redux/superAdmin/superAdminConnectSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SuperAdminScheduleMeeting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { schoolNames, successMessage, errorMessage, loading } = useSelector(
    (state) => state.connectAndQuery
  );
  const [meetingType, setMeetingType] = useState("instant");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [selectSchool, setSelectsSchool] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchSchoolNames());
  }, [dispatch]);

  const resetForm = () => {
    setMeetingTitle("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setSelectsSchool([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      resetForm();
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  const handleSchoolCheck = (name) => {
    setSelectsSchool((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };
  const handleGenerateLink = () => {
    if (
      !meetingTitle ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      selectSchool.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Convert 24hr time to 12hr time with AM/PM
    const formatTo12Hour = (timeStr) => {
      const [hour, minute] = timeStr.split(":");
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum % 12 || 12;
      return `${hour12.toString().padStart(2, "0")}:${minute} ${ampm}`;
    };

    const payload = {
      title: meetingTitle,
      startDate,
      startTime: formatTo12Hour(startTime),
      endDate,
      endTime: formatTo12Hour(endTime),
      attendants: selectSchool,
    };

    dispatch(createMeeting(payload));
  };

  return (
    <div className="max-w-4xl mx-auto border border-blue-300 rounded-md p-6 mt-10">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          ← Back
        </button>
      </div>
      <h2 className="text-lg font-semibold text-blue-700 mb-4">
        Schedule a Meeting
      </h2>

      <div className="flex gap-4 mb-6">
        {["instant", "scheduled"].map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input
              type="radio"
              name="meetingType"
              value={type}
              checked={meetingType === type}
              onChange={() => setMeetingType(type)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">Title</label>
        <input
          type="text"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
      </div>

      {meetingType === "scheduled" && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1">Start time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">End time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Send to</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative teacher-dropdown w-[200px] text-sm">
            <button
              type="button"
              onClick={() => setShowDropdown((p) => !p)}
              className="w-full border rounded px-2 py-1 bg-white flex justify-between items-center"
            >
              Schools <span>&#9662;</span>
            </button>
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-40 overflow-y-auto">
                {schoolNames?.length > 0 ? (
                  schoolNames.map((name, idx) => (
                    <label
                      key={idx}
                      className="block px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectSchool.includes(name)}
                        onChange={() => handleSchoolCheck(name)}
                        className="mr-2"
                      />
                      {name}
                    </label>
                  ))
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    No schools available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleGenerateLink}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Generate Link
        </button>
      </div>
    </div>
  );
};

export default SuperAdminScheduleMeeting;
