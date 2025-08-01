import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminTasks } from "../../../redux/superAdmin/superAdminTaskSlice";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import Header from "../layout/Header";

const SuperAdminTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pendingTasks, loading, error } = useSelector(
    (state) => state.superAdminTasks
  );

  useEffect(() => {
    dispatch(fetchSuperAdminTasks());
  }, [dispatch]);

  return (
    <div>
      <div className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">
              Task
            </h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2 text-sm md:text-base">
              <span>Home</span> {">"}{" "}
              <span className="font-medium text-[#146192]">Task</span>
            </h1>
          </div>

          <Header />
        </div>
      </div>

      <div className="p-4">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={() => navigate("/superadmin/task/assign")}
            className="bg-[#005077] text-white px-4 py-2 rounded"
          >
            Assign Task
          </button>
          <button
            onClick={() => navigate("/superadmin/task/completed")}
            className="bg-white text-[#005077] border border-[#005077] px-4 py-2 rounded"
          >
            Completed Task
          </button>
        </div>

        {/* Task Table */}
        <div className="hidden md:block overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#005077] text-white text-left">
                <th className="p-3 border">S. No</th>
                <th className="p-3 border">Start Date</th>
                <th className="p-3 border">Due Date</th>
                <th className="p-3 border">Employee Name</th>
                <th className="p-3 border">Designation</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Contact</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {pendingTasks?.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
              {pendingTasks?.map((task, index) => (
                <tr key={task._id} className="bg-white even:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">
                    {dayjs(task.startDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-3 border">
                    {dayjs(task.dueDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-3 border">{task.staffId?.name}</td>
                  <td className="p-3 border">{task.staffId?.designation}</td>
                  <td className="p-3 border">{task.title}</td>
                  <td className="p-3 border">{task.description}</td>
                  <td className="p-3 border">
                    {task.staffId?.userId?.mobileNumber}
                  </td>
                  <td className="p-3 border capitalize">
                    <span className="bg-gray-100 border px-3 py-1 text-sm rounded shadow text-gray-700">
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden mt-4">
          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}
          {pendingTasks?.length === 0 && !loading && (
            <p className="text-center text-gray-500">No tasks found.</p>
          )}
          {pendingTasks?.map((task, index) => (
            <div
              key={task._id}
              className="rounded-lg overflow-hidden mb-4 shadow bg-white border border-[#0000004D]"
            >
              <div className="grid grid-cols-2 text-sm">
                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  S. No
                </div>
                <div className="p-2 border border-[#0000004D]">{index + 1}</div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Start Date
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {dayjs(task.startDate).format("DD-MM-YYYY")}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Due Date
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {dayjs(task.dueDate).format("DD-MM-YYYY")}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Employee
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {task.staffId?.name}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Designation
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {task.staffId?.designation}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Title
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {task.title}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Description
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {task.description}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Contact
                </div>
                <div className="p-2 border border-[#0000004D]">
                  {task.staffId?.userId?.mobileNumber}
                </div>

                <div className="bg-[#146192E8] text-white p-2 font-semibold border border-[#0000004D]">
                  Status
                </div>
                <div className="p-2 border border-[#0000004D] capitalize">
                  <span className="bg-gray-100 border px-3 py-1 text-xs rounded shadow text-gray-700">
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminTask;
