import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../adminStaffDashboard/layout/Header';
import contactImage from '../../assets/contact1.png';
import { sendStaffQuery, fetchTeacherNames } from '../../redux/staff/staffDashboardSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffSendQuery = () => {
  const dispatch = useDispatch();
  const { queryLoading, queryError, teacherNames = [], teacherLoading } = useSelector(
    (state) => state.staffDashboard
  );

  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    message: '',
    recipients: [],
    role: 'teacher',
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    dispatch(fetchTeacherNames());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRecipientToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(id)
        ? prev.recipients.filter((r) => r !== id)
        : [...prev.recipients, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryData = {
      name: form.name,
      contact: form.contact,
      email: form.email,
      message: form.message,
      role: 'mixed',
      sendTo: form.recipients,
    };

    try {
      await dispatch(sendStaffQuery(queryData)).unwrap();
      toast.success('✅ Query sent successfully!');
      setForm({
        name: '',
        contact: '',
        email: '',
        message: '',
        recipients: [],
        role: 'teacher',
      });
      setShowDropdown(false);
    } catch (err) {
      toast.error('❌ Failed to send query: ' + (err.message || err));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      <Header />

      <div className="p-4 md:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 py-6 md:ml-64 pt-10">
          <div className="inline-block">
            <h1 className="text-xl font-light text-black xl:text-[32px]">Staff Query</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> {'>'}{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Send Query
              </span>
            </h1>
          </div>
        </div>

        {/* Form + Image Box */}
        <div className="md:ml-64 max-w-5xl mx-auto pt-3">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
            {/* Left: Form Section */}
            <form onSubmit={handleSubmit} className="flex-1">
              <h2 className="text-xl text-[#146192] font-semibold mb-1">Contact Us for Any Query!</h2>
              <p className="text-sm text-gray-600 mb-3">We are here for you! How can we help?</p>

              {/* Name */}
              <div className="pt-5">
                <label className="block text-gray-700 text-sm mb-1">Staff Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded text-sm"
                />
              </div>

              {/* Contact and Email */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">Contact</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">Email ID</label>
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

              {/* Query */}
              <div className="pt-3">
                <label className="block text-gray-700 text-sm mb-1">Query</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>

              {/* Send to: Admin & Teachers */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Send to</label>
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Admin Checkbox */}
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      value="Admin"
                      checked={form.recipients.includes('Admin')}
                      onChange={() => handleRecipientToggle('Admin')}
                    />
                    Admin
                  </label>

                  {/* Teacher Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="border px-3 py-1.5 rounded bg-white shadow text-sm w-44 text-left"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      {form.recipients.filter((id) => id !== 'Admin').length > 0
                        ? `${form.recipients.filter((id) => id !== 'Admin').length} Teacher(s)`
                        : 'Select Teachers'}
                    </button>

                    {showDropdown && (
                      <div className="absolute mt-1 border rounded bg-white max-h-40 overflow-y-auto text-sm w-44 shadow z-10">
                        {teacherLoading ? (
                          <div className="p-2 text-gray-500">Loading...</div>
                        ) : (
                          teacherNames.map((teacher) => (
                            <label
                              key={teacher._id}
                              className="flex items-center gap-2 p-2 hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={form.recipients.includes(teacher._id)}
                                onChange={() => handleRecipientToggle(teacher._id)}
                              />
                              {teacher.fullname}
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={queryLoading}
                  className="px-8 py-2 bg-[#146192ED] hover:bg-[#0d8de1] text-white rounded-full font-medium"
                >
                  {queryLoading ? 'Sending...' : 'Send'}
                </button>
              </div>

              {/* Error */}
              {queryError && (
                <p className="text-center text-red-500 text-sm mt-2">Error: {queryError}</p>
              )}
            </form>

            {/* Image Section */}
            <div className="hidden md:block w-[250px]">
              <img src={contactImage} alt="Contact illustration" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default StaffSendQuery;
