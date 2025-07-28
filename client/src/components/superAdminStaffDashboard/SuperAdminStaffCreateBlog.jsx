import React, { useState } from "react";
import Header from "../adminStaffDashboard/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  createBlog,
  resetBlogState,
} from "../../redux/superAdminStaff/superAdminStaffCreateBlogSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminStaffCreateBlog = () => {
  const dispatch = useDispatch();
  const { title, loading } = useSelector((state) => state.blogData);

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [entries, setEntries] = useState([]);

  const handleAdd = () => {
    if (!description || !photo) {
      toast.error("Please provide both description and image.");
      return;
    }

    setEntries((prev) => [...prev, { description, photo }]);
    setDescription("");
    setPhoto(null);
    toast.success("Entry added.");
  };

  const handleSubmit = () => {
    if (!title || entries.length === 0) {
      toast.error("Title and at least one blog entry are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    entries.forEach((entry, index) => {
      formData.append(`blog[${index}][description]`, entry.description);
      formData.append("photos", entry.photo);
    });

    dispatch(createBlog(formData))
      .unwrap()
      .then(() => {
        toast.success("Blog submitted successfully!");
        dispatch(resetBlogState());
        setEntries([]);
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to create blog.");
      });
  };

  return (
    <div className="bg-[#f3f9fb] min-h-screen pt-20">
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="md:ml-64 p-6">
        <div className="flex justify-between items-center pb-8">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Blog</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2 text-xs md:text-md xl:text-[17px]">
              Home &gt;{" "}
              <span className="text-[#146192]">Blog &gt; Create Blog</span>
            </h1>
          </div>
        </div>

        <div className="w-full max-w-[1000px] mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
          {/* Title Input */}
          <label className="block text-sm font-medium text-[#146191] mb-2 ml-[40px] sm:ml-[80px] lg:ml-[150px]">
            Blog Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="Title"
            className="w-[305px] h-[44px] border border-gray-300 rounded-md px-4 py-2 text-sm bg-[#1461921F] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8 ml-[40px] sm:ml-[80px] lg:ml-[150px]"
          />

          {/* Dynamic Description + Image Upload */}
          <div className="w-full max-w-[720px] mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
            <label className="block text-sm font-medium text-[#146191] mb-2">
              Description:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full max-w-[305px] h-[44px] border border-gray-300 rounded-md px-4 py-2 text-sm bg-[#1461921F] focus:outline-none"
            />

            <label className="block text-sm font-medium text-[#146191] mb-2 mt-4">
              Image
            </label>
            <div className="w-full max-w-[626px] h-[106px] border border-dashed border-gray-400 rounded-md flex items-center justify-center bg-[#1461921F]">
              <label className="cursor-pointer text-sm text-[#146191]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                {photo ? photo.name : "Drag and drop"}
              </label>
            </div>

            {/* Add Entry Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAdd}
                className="mt-4 bg-[#146192ED] hover:bg-[#0d8de1] text-white py-2 px-4 rounded-md"
              >
                Add
              </button>
            </div>
          </div>

          {/* Existing Entries List */}
          {entries.length > 0 && (
            <div className="bg-[#f9fafb] rounded-lg p-4 mb-4 max-w-[720px] mx-auto">
              <h3 className="text-md font-semibold text-[#146191] mb-3">
                Blog Entries:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {entries.map((entry, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{entry.description}</span>
                    <span className="text-gray-500 text-xs">
                      {entry.photo.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 bg-[#146192ED] hover:bg-[#0d8de1] text-white py-2 px-4 rounded-full"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminStaffCreateBlog;
