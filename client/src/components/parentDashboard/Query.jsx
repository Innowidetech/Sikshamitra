import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendQuery,
  fetchStudents,
  clearErrorMessage,
  clearSuccessMessage,
} from '../../redux/parent/querySlice';
import Header from './layout/Header';
import contactImage from '../../assets/contact.png';
import { FaLocationArrow, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Query() {
  const dispatch = useDispatch();

  const { students, loading, errorMessage, successMessage } = useSelector(
    (state) => state.query
  );

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [sendTo, setSendTo] = useState([]);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!parentName || !parentPhone || !studentName || !queryMessage) {
      return alert('Please fill out all fields!');
    }

    const queryData = {
      parentName,
      parentPhone,
      studentName,
      query: queryMessage,
      sendTo,
    };

    dispatch(sendQuery(queryData));
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 pt-20 md:ml-64">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-xl">
            <span className="xl:text-[17px]">Home</span> {'>'}{' '}
            <span className="font-medium text-[#146192] xl:text-[17px]">Queries</span>
          </h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Header />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-8 px-4 md:px-8 mt-8 md:ml-64">
        {/* Left Column - Form */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold text-[#146192] mb-4">Have a question or query?</h2>
          <p className="text-base text-gray-700 mb-4">
            Please feel free to reach out to us. Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 shadow shadow-gray-500 rounded-md p-4">
            {/* Parent Info */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-[#146192]" htmlFor="parentName">Parent Name</label>
                <input
                  type="text"
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-semibold text-[#146192]" htmlFor="parentMobile">Parent Mobile No</label>
                <input
                  type="tel"
                  id="parentMobile"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
                />
              </div>
            </div>

            {/* Student and Message */}
            <div>
              <label className="block text-sm font-semibold text-[#146192]" htmlFor="studentName">Student Name</label>
              <select
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
              >
                <option value=""></option>
                {students.map((student) => (
                  <option key={student._id} value={student.studentProfile.fullname}>
                    {student.studentProfile.fullname}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-semibold text-[#146192] mt-6" htmlFor="queryMessage">Your Query</label>
              <textarea
                id="queryMessage"
                value={queryMessage}
                onChange={(e) => setQueryMessage(e.target.value)}
                rows="4"
                className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
              ></textarea>
            </div>

            {/* Send To */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="text-sm font-semibold text-[#146192]">Send To:</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="admin"
                    checked={sendTo.includes('admin')}
                    onChange={(e) => {
                      if (e.target.checked) setSendTo([...sendTo, 'admin']);
                      else setSendTo(sendTo.filter((item) => item !== 'admin'));
                    }}
                    className="mr-2"
                  />
                  Admin
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="class teacher"
                    checked={sendTo.includes('class teacher')}
                    onChange={(e) => {
                      if (e.target.checked) setSendTo([...sendTo, 'class teacher']);
                      else setSendTo(sendTo.filter((item) => item !== 'class teacher'));
                    }}
                    className="mr-2"
                  />
                  Class Teacher
                </label>
              </div>
            </div>

            {/* Messages */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0a4e6f]"
              >
                {loading ? 'Submitting...' : 'Submit Query'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Image and Contact */}
        <div className="w-full lg:w-1/2">
          <img
            src={contactImage}
            alt="Query"
            className="w-full h-auto rounded-lg mb-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-[#146192] mb-2">Contact Information</h3>
            <p className="text-sm text-gray-700 mb-2">
              <FaLocationArrow className="inline mr-2 text-[#146192]" />
              <strong></strong> ABC International School, Hyderabad
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <FaPhoneAlt className="inline mr-2 text-[#146192]" />
              <strong></strong> +2034 4040 3030
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-[#146192]" />
              <strong></strong> hello@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Query;

