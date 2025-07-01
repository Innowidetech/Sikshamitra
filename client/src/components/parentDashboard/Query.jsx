import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueries, fetchConnects } from '../../redux/parent/querySlice';
import Header from './layout/Header';
import { useNavigate } from 'react-router-dom';

const Query = ({ setActiveTab, setSelectedQueryId }) => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  const { queries, connects, loading, error } = useSelector((state) => state.query);

  useEffect(() => {
    dispatch(fetchQueries());
    dispatch(fetchConnects());
  }, [dispatch]);

  const received = queries?.queriesReceived || [];
  const sent = queries?.queriesSent || [];

  return (
    <>
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

      <div className="p-4 md:p-6 min-h-screen md:ml-64">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">Contact Us for Any Query!</h2>
            <div className="space-x-2">
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                onClick={() => setActiveTab('queryform')}
              >
                Queries
              </button>
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded"
                onClick={() => navigate('/meeting')}
              >
                Connect
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6">We are here to help you! How can we help?</p>

          {/* ✅ Connect Meetings Table */}
          <h3 className="font-semibold text-gray-700 mb-2">Ongoing / Upcoming Meetings</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Meeting Title</th>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Time</th>
                  <th className="border px-3 py-2">Hosted By</th>
                  <th className="border px-3 py-2">Link</th>
                  <th className="border px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {connects && connects.length > 0 ? (
                  connects.map((connect, idx) => (
                    <tr key={connect._id} className="text-center">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{connect.title}</td>
                      <td className="border px-3 py-2">
                        {new Date(connect.startDate).toLocaleDateString()}
                      </td>
                      <td className="border px-3 py-2">
                        {connect.startTime} - {connect.endTime}
                      </td>
                      <td className="border px-3 py-2 capitalize">
                        {connect.hostedByName} ({connect.hostedByRole})
                      </td>
                      <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
                        <a href={connect.meetingLink} target="_blank" rel="noopener noreferrer">
                          {connect.meetingLink}
                        </a>
                      </td>
                      <td className="border px-3 py-2">{connect.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="border px-3 py-2 text-center text-gray-500">
                      No upcoming meetings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Received Queries */}
          <h3 className="font-semibold text-gray-700 mb-2">Received Queries</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Contact</th>
                  <th className="border px-3 py-2">Email id</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {received.map((query, idx) => (
                  <tr key={query._id} className="text-center">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{query.name}</td>
                    <td className="border px-3 py-2 capitalize">{query.createdByRole}</td>
                    <td className="border px-3 py-2">{query.contact}</td>
                    <td className="border px-3 py-2">{query.email}</td>
                    <td className="border px-3 py-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => setActiveTab('replypage', query._id)}
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Sent Queries */}
          <h3 className="font-semibold text-gray-700 mb-2">Queries Sent by Parent</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-3 py-2">S.NO</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Contact</th>
                  <th className="border px-3 py-2">Email id</th>
                  <th className="border px-3 py-2">Sent To</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sent.map((query, idx) => (
                  <tr key={query._id} className="text-center">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{query.name}</td>
                    <td className="border px-3 py-2">{query.contact}</td>
                    <td className="border px-3 py-2">{query.email}</td>
                    <td className="border px-3 py-2">{query.sendToName}</td>
                    <td className="border px-3 py-2">{query.sendToRole}</td>
                    <td className="border px-3 py-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => setActiveTab('replypage', query._id)}
                      >
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
    </>
  );
};

export default Query;
