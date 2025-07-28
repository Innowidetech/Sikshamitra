import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSchoolNames,
  postSuperAdminQuery,
} from "../../../redux/superAdmin/superAdminConnectSlice"; // Adjust path
import contactImage from "../../../assets/contact.png"; // Adjust path

const SuperAdminQuery = () => {
  const dispatch = useDispatch();
  const { schoolNames } = useSelector((state) => state.connectAndQuery);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    message: "",
    sendTo: [],
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    dispatch(fetchSchoolNames());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecipientToggle = (schoolName) => {
    const alreadySelected = form.sendTo.includes(schoolName);
    if (alreadySelected) {
      setForm((prev) => ({
        ...prev,
        sendTo: prev.sendTo.filter((name) => name !== schoolName),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        sendTo: [...prev.sendTo, schoolName],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      contact: form.contact,
      email: form.email,
      message: form.message,
      sendTo: form.sendTo, // Already string[]
    };
    dispatch(postSuperAdminQuery(payload)).then((res) => {
      if (res.type.includes("fulfilled")) {
        // Optional: Reset form after successful submit
        setForm({
          name: "",
          contact: "",
          email: "",
          message: "",
          sendTo: [],
        });
      }
    });
    // dispatch sendQuery thunk here if needed
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Header and Breadcrumb */}
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">
          Connect & Query
        </h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[260px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Query</span>
        </h1>
      </div>

      {/* Form Card Section */}
      <div className="p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Heading Card */}
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left: Heading and Paragraph */}
              <div>
                <h2 className="text-xl text-[#146192ED] font-semibold mb-2">
                  Contact Us for Any Query!
                </h2>
                <p className="text-sm text-gray-600">
                  We are here for you! How can we help?
                </p>
              </div>

              {/* Right: Buttons */}
              <div className="flex gap-4">
                <button className="bg-[#146192ED] hover:bg-[#0d8de1] text-white px-4 py-2 rounded text-sm font-medium">
                  Query
                </button>
                <button className="bg-white border border-[#00263c] text-[#00263c] px-4 py-2 rounded text-sm font-medium">
                  Connect
                </button>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">
                    Staff Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">
                    Contact
                  </label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">
                    Email ID
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              </div>

              {/* School Select */}
              <div className="flex flex-wrap gap-4 items-start">
                <label className="flex items-center text-sm gap-1">
                  School List
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="border px-4 py-2 rounded bg-white shadow text-sm w-44 text-left"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {form.sendTo.length > 0
                      ? `${form.sendTo.length} Selected`
                      : "Select schools"}
                  </button>
                  {showDropdown && (
                    <div className="absolute mt-1 border rounded bg-white max-h-40 overflow-y-auto text-sm w-64 shadow z-50">
                      {schoolNames.map((name, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 px-2 py-1"
                        >
                          <input
                            type="checkbox"
                            value={name}
                            checked={form.sendTo.includes(name)}
                            onChange={() => handleRecipientToggle(name)}
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Query
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>

              {/* Centered Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#146192ED] hover:bg-[#0d8de1] text-white rounded font-medium"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Illustration Section */}
            <div className="hidden md:block w-[250px]">
              <img
                src={contactImage}
                alt="Contact illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminQuery;
