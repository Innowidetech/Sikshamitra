import React, { useEffect } from 'react';
import Header from '../adminStaffDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSuperAdminStaffDashboardData,
  updateTaskStatus,
} from '../../redux/superAdminStaff/superAdminStaffDashboardSlice';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Calendar,
  UserCircle,
} from 'lucide-react';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, tasks, loading, error } = useSelector(state => state.superAdminStaffDashboard);

  useEffect(() => {
    dispatch(fetchSuperAdminStaffDashboardData());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];

  const handleStatusChange = (taskId, status) => {
    dispatch(updateTaskStatus({ taskId, status }));
  };

  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      {/* Top Header */}
      <Header />

      <div className="p-4 md:p-6">
      

        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 py-6 md:ml-64 pt-10">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Dashboard</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> &gt;{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Dashboard
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
          <>
            {/* Summary Section */}
            <div className="border-2 border-[#0077b6] bg-white rounded-lg p-6 md:ml-64 mb-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
                <div>
                  <ClipboardList className="h-6 w-6 mx-auto text-[#1d3557]" />
                  <div className="text-lg font-bold text-[#1d3557]">{dashboard?.totalTasks || 0}</div>
                  <div className="text-sm text-gray-700">Total Tasks</div>
                </div>
                <div>
                  <CheckCircle className="h-6 w-6 mx-auto text-[#f77f00]" />
                  <div className="text-lg font-bold text-[#f77f00]">{dashboard?.completedTasks || 0}</div>
                  <div className="text-sm text-gray-700">Completed Task</div>
                </div>
                <div>
                  <Clock className="h-6 w-6 mx-auto text-[#264653]" />
                  <div className="text-lg font-bold text-[#264653]">{dashboard?.pendingTasks || 0}</div>
                  <div className="text-sm text-gray-700">Pending Task</div>
                </div>
                <div>
                  <Calendar className="h-6 w-6 mx-auto text-[#00b4d8]" />
                  <div className="text-lg font-bold text-[#00b4d8]">{formatDate(dashboard?.dateOfJoining)}</div>
                  <div className="text-sm text-gray-700">Joining Date</div>
                </div>
                <div>
                  <UserCircle className="h-6 w-6 mx-auto text-[#ff9f1c]" />
                  <div className="text-lg font-bold text-[#ff9f1c]">{dashboard?.role || 'Staff'}</div>
                  <div className="text-sm text-gray-700">Role</div>
                </div>
              </div>
            </div>

            {/* Completed Tasks Table */}
            <div className="md:ml-64">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Completed Tasks</h2>
              <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="w-full text-sm text-gray-800 border border-collapse">
                  <thead className="bg-[#01497c] text-white">
                    <tr>
                      <th className="p-3 border text-left">S. No </th>
                      <th className="p-3 border text-left">Start Date </th>
                      <th className="p-3 border text-left">Due Date </th>
                      <th className="p-3 border text-left">Title</th>
                      <th className="p-3 border text-left">Description </th>
                      <th className="p-3 border text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTasks.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center p-4 text-gray-500">
                          No completed tasks available.
                        </td>
                      </tr>
                    ) : (
                      completedTasks.map((task, index) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
