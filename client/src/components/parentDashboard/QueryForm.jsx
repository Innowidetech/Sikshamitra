import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherNames,
  sendQuery,
  clearErrorMessage,
  clearSuccessMessage,
} from '../../redux/parent/querySlice';
import { toast } from 'react-toastify';
import contactImage from '../../assets/contact1.png';
import Header from './layout/Header';
const QueryForm = ({ goBack }) => {
  const dispatch = useDispatch();
  const { teacherNames, loading, error, successMessage } = useSelector((state) => state.query);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: '',
    sendTo: [],
  });

  const [sendToAdmin, setSendToAdmin] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchTeacherNames());
  }, [dispatch]);

  useEffect(() => {
    const combined = [
      ...(sendToAdmin ? ['Admin'] : []),
      ...selectedTeachers,
    ];
    setFormData((prev) => ({ ...prev, sendTo: combined }));
  }, [sendToAdmin, selectedTeachers]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      goBack();
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrorMessage());
    }
  }, [successMessage, error, dispatch, goBack]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeacherCheck = (name) => {
    setSelectedTeachers((prev) =>
      prev.includes(name)
        ? prev.filter((t) => t !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message || formData.sendTo.length === 0) {
      toast.error('Please enter a query and select at least one recipient.');
      return;
    }

    const processedFormData = {
      ...formData,
      sendTo: formData.sendTo.map((entry) =>
        entry.includes('-') ? entry.split('-')[0] : entry
      ),
    };

    dispatch(sendQuery(processedFormData));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.teacher-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (

    <div>
      <div className="flex justify-between items-center mx-4 mt-20 md:ml-72 flex-wrap">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Home</span> {'>'} <span className="font-medium text-[#146192]">Connect & Queries</span>
          </h1>
        </div>
        <Header />
      </div>
     
    <div className="flex justify-center items-start min-h-screen  p-6 md:ml-64">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold text-blue-700 mb-1">Contact Us for Any Query!</h2>
          <p className="text-sm text-gray-600 mb-6">We are here for you! How can we help?</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium">Parent Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-4 mb-3">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Parent Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">Parent Email Id</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Query</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Send to</label>
              <div className="flex gap-4 items-start flex-col sm:flex-row">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={sendToAdmin}
                    onChange={(e) => setSendToAdmin(e.target.checked)}
                  />
                  Admin
                </label>

                <div className="relative teacher-dropdown w-[200px] text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="w-full border rounded px-2 py-1 bg-white flex justify-between items-center"
                  >
                    Select Teachers
                    <span className="ml-2">&#9662;</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-40 overflow-y-auto">
                      {teacherNames.map((name, idx) => (
                        <label key={idx} className="block px-2 py-1 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.includes(name)}
                            onChange={() => handleTeacherCheck(name)}
                            className="mr-2"
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-2"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="flex gap-4 mb-4">
            <button
              onClick={goBack}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              Queries
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Connect
            </button>
          </div>
          <img
            src={contactImage}
            alt="Query"
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
     </div>
  );
};

export default QueryForm;
