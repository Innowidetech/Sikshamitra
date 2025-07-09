import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import contactImage from '../../assets/contact1.png';
import Header from './layout/Header';
import { fetchMyStudents } from '../../redux/teacher/myStudentsSlice';
import {
  sendTeacherQuery,
  clearErrorMessage,
  clearSuccessMessage,
} from '../../redux/teacher/teacherQuerySlice';

const TeacherQueryForm = ({ goBack }) => {
  const dispatch = useDispatch();
  const { data: myStudents } = useSelector((state) => state.myStudents);
  const { loading, error, successMessage } = useSelector((state) => state.teacherQuery);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: '',
    parent: '',
    student: '',
  });
  const [sendToAdmin, setSendToAdmin] = useState(false);

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, contact, message, parent, student } = formData;

    if (!name || !email || !contact || !message) {
      toast.error('Please fill all required fields.');
      return;
    }

    const updatedSendTo = [
      ...(sendToAdmin ? ['Admin'] : []),
      ...(parent ? [parentOptions.find((p) => p.id === parent)?.name] : []),
      ...(student ? [studentOptions.find((s) => s.id === student)?.name] : []),
    ].filter(Boolean);

    if (updatedSendTo.length === 0) {
      toast.error('Please select at least one recipient.');
      return;
    }

    const payload = {
      name,
      email,
      contact,
      message,
      sendTo: updatedSendTo,
    };

    dispatch(sendTeacherQuery(payload));
  };

  const parentOptions =
    myStudents?.parents?.map((p) => ({
      id: p._id,
      name: `${p.parentProfile.fatherName || ''} ${p.parentProfile.motherName || ''}`.trim(),
    })) || [];

  const studentOptions =
    myStudents?.parents
      ?.flatMap((p) =>
        p.parentProfile.parentOf.map((s) => ({
          id: s._id,
          name: s.studentProfile.fullname,
        }))
      ) || [];

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

      <div className="flex justify-center items-start min-h-screen p-6 md:ml-64">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl border border-gray-300 flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-blue-700 mb-1">Contact Us for Any Query!</h2>
            <p className="text-sm text-gray-600 mb-6">We are here for you! How can we help?</p>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mb-3">
                <div className="w-full">
                  <label className="block text-sm mb-1">Teacher Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Teacher Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Teacher Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Query</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2">Send to</label>
                <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={sendToAdmin}
                      onChange={(e) => setSendToAdmin(e.target.checked)}
                    />
                    Admin
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Parent</span>
                    <select
                      name="parent"
                      value={formData.parent}
                      onChange={handleInputChange}
                      className="border border-gray-400 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select</option>
                      {parentOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Student</span>
                    <select
                      name="student"
                      value={formData.student}
                      onChange={handleInputChange}
                      className="border border-gray-400 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select</option>
                      {studentOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#1669A2] text-white px-10 py-2 rounded-full text-lg hover:bg-[#145985]"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-start">
            <div className="flex gap-4 mb-4">
              <button
                onClick={goBack}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                Queries
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded">
                Connect
              </button>
            </div>
            <img src={contactImage} alt="Query" className="w-full max-w-[280px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherQueryForm;
