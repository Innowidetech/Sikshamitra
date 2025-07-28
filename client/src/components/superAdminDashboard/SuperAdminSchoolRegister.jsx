import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerSchool } from "../../redux/superAdmin/superAdminSchoolSlice"; // adjust path as needed

const SuperAdminSchoolRegister = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    schoolCode: "",
    schoolName: "",
    contact: "",
    website: "",
    address: "",
    principalName: "",
    boardType: "",
    medium: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const payload = {
      email: formData.email,
      password: formData.password,
      schoolCode: formData.schoolCode,
      schoolName: formData.schoolName,
      contact: {
        phone: formData.contact,
        website: formData.website,
      },
      address: formData.address,
      principalName: formData.principalName,
      details: {
        boardType: formData.boardType,
        medium: formData.medium,
      },
    };

    dispatch(registerSchool(payload)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setShowSuccess(true);

        // Reset the form fields
        setFormData({
          email: "",
          password: "",
          schoolCode: "",
          schoolName: "",
          contact: "",
          website: "",
          address: "",
          principalName: "",
          boardType: "",
          medium: "",
        });

        setTimeout(() => setShowSuccess(false), 1400);
      } else {
        console.error("Registration failed:", res.payload);
      }
    });
  };

  return (
    <div>
      {/* Header Section */}
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">
          Registration
        </h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">School Details</span>{" "}
          {">"}{" "}
          <span className="font-medium text-[#146192]"> Registration</span>
        </h1>
        <h2 className="mt-5 mb-5 text-xl font-semibold text-[#525252] m-7">
          Register a New School
        </h2>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto p-4">
        <form>
          {/* Login Details */}
          <div className="bg-white rounded-lg shadow-md mb-10">
            <div className="bg-[#0a5a88] text-white text-lg font-semibold px-6 py-3 rounded-t-lg">
              Login Details
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="xyz@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-[#0a5a88] text-white text-lg font-semibold px-6 py-3 rounded-t-lg">
              Personal Details
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Code *
                </label>
                <input
                  type="text"
                  name="schoolCode"
                  placeholder="Code"
                  value={formData.schoolCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  placeholder="School"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Contact *
                </label>
                <input
                  type="text"
                  name="contact"
                  placeholder="+91 xxxxxxxxxx"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website Link *
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder="http://websitelink"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  rows="3"
                  name="address"
                  placeholder="Address, City, State - Pincode (6 digits only)"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Name *
                </label>
                <input
                  type="text"
                  name="principalName"
                  placeholder="Name"
                  value={formData.principalName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board Type *
                </label>
                <input
                  type="text"
                  name="boardType"
                  placeholder="SSC, CBSE"
                  value={formData.boardType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medium *
                </label>
                <input
                  type="text"
                  name="medium"
                  placeholder="English"
                  value={formData.medium}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-[#0a5a88]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Save Button */}
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#0a5a88] text-white px-10 py-3 rounded-md text-sm font-medium hover:bg-[#084d74] transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-lg text-center">
            <h2 className="text-xl font-semibold text-[#0a5a88] p-24">
              School registered successfully!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSchoolRegister;
