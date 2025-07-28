import React, { useEffect } from "react";

import Header from "../adminStaffDashboard/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminQueries } from "../../redux/superAdminStaff/superAdminStaffQueryReplaySlice";

const SuperAdminQuery = ({ onSendQuery, onReplyView }) => {
  const dispatch = useDispatch();
  const {
    queriesReceived = [],
    queriesSent = [],
    loading,
    error,
  } = useSelector((state) => state.superAdminStaffSendQueryReplay);

  useEffect(() => {
    dispatch(fetchSuperAdminQueries());
  }, [dispatch]);

  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      <Header />

      <div className="p-4 md:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 md:ml-64 py-10">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Query</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
              &gt;{" "}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Query
              </span>
            </h1>
          </div>
        </div>

        {/* Header with Send Query Button */}
        <div className="bg-white p-4 rounded shadow-md mb-6 md:ml-64 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-blue-900">
              Contact Us for Any Query!
            </h2>
            <p className="text-sm text-gray-600">
              We are here for you! How can we help?
            </p>
          </div>
          <button
            onClick={onSendQuery}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#1da1f2] hover:bg-[#0d8de1] text-white rounded text-sm font-medium"
          >
            Send Query
          </button>
        </div>

        {/* Received Queries */}
        <div className="bg-white p-4 rounded shadow-md mb-6 md:ml-64">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Received Queries
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left text-gray-800">
              <thead className="bg-[#01497c] text-white">
                <tr>
                  <th className="border p-2">S.NO </th>
                  <th className="border p-2">Name </th>
                  <th className="border p-2">Contact </th>
                  <th className="border p-2">Email id </th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesReceived.map((query, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{query.name}</td>
                    <td className="border p-2">{query.contact}</td>
                    <td className="border p-2">{query.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          onReplyView({
                            ...query,
                            type: "received",
                            creatorIds: [query.createdBy],
                          })
                        }
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sent Queries */}
        <div className="bg-white p-4 rounded shadow-md md:ml-64">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Sent Queries
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left text-gray-800">
              <thead className="bg-[#01497c] text-white">
                <tr>
                  <th className="border p-2">S.NO </th>
                  <th className="border p-2">Name </th>
                  <th className="border p-2">Contact </th>
                  <th className="border p-2">Email id </th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {queriesSent.map((query, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{query.name}</td>
                    <td className="border p-2">{query.contact}</td>
                    <td className="border p-2">{query.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          onReplyView({
                            ...query,
                            type: "sent",
                            creatorIds: [query.createdBy],
                          })
                        }
                        className="text-blue-600 hover:underline text-sm"
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
    </div>
  );
};

export default SuperAdminQuery;
