import React, { useEffect } from 'react';
import Header from '../adminStaffDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSuperAdminStaffDashboardData,
  updateTaskStatus,
} from '../../redux/superAdminStaff/superAdminStaffDashboardSlice';

const SuperAdminStaffTask = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector(state => state.superAdminStaffDashboard);

  useEffect(() => {
    dispatch(fetchSuperAdminStaffDashboardData());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const handleStatusChange = (taskId, status) => {
    dispatch(updateTaskStatus({ taskId, status }));
  };

  const pendingTasks = tasks?.filter(task => task.status === 'pending' || task.status === 'process') || [];
  console.log(' tasks:', tasks);

  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      {/* Top Header */}
      <Header />

      <div className="p-4 md:p-6">
        
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 py-6 md:ml-64 pt-10">
          <div className="inline-block">
            <h1 className="text-xl font-light text-black xl:text-[32px]"> Staff Task</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> {'>'}{" "}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Task
              </span>
            </h1>
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : (
          <div className="md:ml-64">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Pending Tasks</h2>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
              <table className="w-full text-sm text-gray-800 border border-collapse">
                <thead className="bg-[#01497c] text-white">
                  <tr>
                    <th className="p-3 border text-left">S. No  </th>
                    <th className="p-3 border text-left">Start Date </th>
                    <th className="p-3 border text-left">Due Date </th>
                    <th className="p-3 border text-left">Title</th>
                    <th className="p-3 border text-left">Description </th>
                    <th className="p-3 border text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        No pending tasks available.
                      </td>
                    </tr>
                  ) : (
                    pendingTasks.map((task, index) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border">{formatDate(task.startDate)}</td>
                        <td className="p-3 border">{formatDate(task.dueDate)}</td>
                        <td className="p-3 border">{task.title}</td>
                        <td className="p-3 border">{task.description}</td>
                        <td className="p-3 border">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="text-xs p-1 rounded border bg-white text-gray-700"
                          >
                            <option value="pending">Pending</option>
<option value="process">Progress</option>
<option value="completed">Completed</option>

                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminStaffTask;
