import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignTask,
  fetchSuperAdminTasks,
} from "../../../redux/superAdmin/superAdminTaskSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminAssign = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.superAdminTasks);

  const [formData, setFormData] = useState({
    name: "",
    designation: "Staff", // default
    startDate: "",
    dueDate: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(assignTask(formData));
    if (assignTask.fulfilled.match(result)) {
      toast.success("Task Assigned Successfully! 🎉");
      dispatch(fetchSuperAdminTasks()); // refresh task list
      setFormData({
        name: "",
        designation: "Staff",
        startDate: "",
        dueDate: "",
        title: "",
        description: "",
      });
    } else {
      toast.error(result.payload || "Failed to assign task 😓");
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* Heading Section */}
      <div className="pb-10">
        <h1 className="text-3xl font-light text-black xl:text-[40px]">Task</h1>
        <hr className="mt-3 border-[#146192] border-[1.5px] w-[90px]" />
        <h1 className="mt-2 text-base md:text-lg">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Task</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Assign Task</span>
        </h1>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-md border border-gray-200">
        <h2 className="bg-[#146192] text-white py-3 px-6 rounded-t-md text-xl font-semibold">
          Assign Task
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
        >
          {/* Employee Name */}
          <div className="flex flex-col">
            <label className="text-base font-medium mb-2 text-[#146192]">
              Employee Name *
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-4 py-3 text-base"
              required
            >
              <option value="">Select</option>
              <option value="SA Staff 1">SA Staff 1</option>
              <option value="Rahul K">Rahul K</option>
              <option value="SA Staff 2">SA Staff 2</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-base font-medium mb-2 text-[#146192]">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border rounded px-4 py-3 text-base"
              required
            />
          </div>

          {/* Employee Role */}
          <div className="flex flex-col">
            <label className="text-base font-medium mb-2 text-[#146192]">
              Employee Role *
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter Role (e.g., Staff)"
              className="border rounded px-4 py-3 text-base"
              required
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col">
            <label className="text-base font-medium mb-2 text-[#146192]">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border rounded px-4 py-3 text-base"
              required
            />
          </div>

          {/* Title */}
          <div className="col-span-1 md:col-span-2 flex flex-col">
            <label className="text-base font-medium mb-2 text-[#146192]">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border rounded px-4 py-3 text-base"
              placeholder="Task Title"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2 flex flex-col">
            <label className="text-base font-medium mb-2 text-[#146192]">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded px-4 py-3 text-base"
              placeholder="Task Description"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#146192] text-white px-8 py-3 rounded-md text-base hover:bg-[#0f4d75] transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminAssign;
