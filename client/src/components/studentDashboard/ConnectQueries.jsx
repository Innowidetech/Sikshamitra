import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConnectQueries } from '../../redux/student/connectQueriesSlice';
import Header from './layout/Header';
import { useNavigate } from 'react-router-dom';


const ConnectQueries = ({ onOpenQueryChat, onOpenQueriesPage }) => {
  const dispatch = useDispatch();
  const { received, sent, loading, error } = useSelector(
    (state) => state.connectQueries
  );

  const navigate = useNavigate();


  useEffect(() => {
    dispatch(fetchConnectQueries());
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Top Header */}
      <div className="flex justify-between items-center mx-4 md:mx-8 flex-wrap gap-y-4">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Connect & Queries</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Main White Box */}
      <div className="bg-white mt-10 mx-4 md:mx-8 p-6 rounded-xl shadow-md">
        {/* Box Header (inside the white box) */}
        <div className="flex justify-between items-center flex-wrap mb-6">
          {/* Left Side */}
          <div>
            <h2 className="text-xl font-semibold text-[#1C5D99]">Contact Us for Any Query!</h2>
            <p className="text-sm text-gray-700 mt-1">We are here for you! How can we help?</p>
          </div>

          {/* Right Side Buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
           <button
              className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm"
              onClick={onOpenQueriesPage} // ✅ Trigger parent state
            >
              Queries
            </button>

            <button className="border border-blue-500 text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition text-sm">
              Connect
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Meetings Section */}
        <section className="mb-6">
          <h3 className="font-medium text-sm mb-2">Ongoing / Upcoming Meetings</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-[#1C5D99] text-white">
              <tr>
                <th className="p-2 border">S.NO</th>
                <th className="p-2 border">Meeting Title</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Hosted by</th>
                <th className="p-2 border">Link</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">School Meeting</td>
                  <td className="p-2 border">10-05-2025</td>
                  <td className="p-2 border">3:00 pm</td>
                  <td className="p-2 border">
                    {i === 1
                      ? 'Ravali (Teacher)'
                      : i === 2
                      ? 'Ravi (Admin)'
                      : 'Ravi (Teacher)'}
                  </td>
                  <td className="p-2 border text-blue-600 underline cursor-pointer">meet//link.com</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Received Queries */}
        <section className="mb-6">
          <h3 className="font-medium text-sm mb-2">Received Queries</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-[#1C5D99] text-white">
              <tr>
                <th className="p-2 border">S.NO</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Email id</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {received?.length > 0 ? (
                received.map((item, i) => (
                  <tr key={item._id} className="text-center">
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.createdByRole}</td>
                    <td className="p-2 border">{item.contact}</td>
                    <td className="p-2 border">{item.email}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => onOpenQueryChat(item._id, 'reply')}
                        className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No received queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Sent Queries */}
        <section>
          <h3 className="font-medium text-sm mb-2">Queries sent by Student</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-[#1C5D99] text-white">
              <tr>
                <th className="p-2 border">S.NO</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Email id</th>
                <th className="p-2 border">Sent to</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {sent?.length > 0 ? (
                sent.map((item, i) => (
                  <tr key={item._id} className="text-center">
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.contact}</td>
                    <td className="p-2 border">{item.email}</td>
                    <td className="p-2 border">{item.sendTo}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => onOpenQueryChat(item._id, 'view')}
                        className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No sent queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ConnectQueries;
