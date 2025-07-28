import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import {
  setTitle,
  createBlog,
  resetBlogState,
} from "../../../redux/superAdmin/SuperAdminBlogSclice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminStaffCreateBlog = () => {
  const dispatch = useDispatch();
  const { title, loading } = useSelector((state) => state.superAdminUserBlogs);

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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="">
        <div className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-black xl:text-[38px]">
                Blog
              </h1>
              <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
              <h1 className="mt-2 text-sm md:text-base">
                <span>Home</span> {">"}{" "}
                <span className="font-medium text-[#146192]">
                  Blog &gt; Create Blog{" "}
                </span>
              </h1>
            </div>

            <Header />
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

          {/* Entry Form */}
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
                {photo ? photo.name : "Drag and drop or click to select image"}
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAdd}
                className="mt-4 bg-[#146192ED] hover:bg-[#0d8de1] text-white py-2 px-4 rounded-md"
              >
                Add Entry
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 bg-[#146192ED] hover:bg-[#0d8de1] text-white py-2 px-6 rounded-full"
            >
              {loading ? "Submitting..." : "Submit Blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminStaffCreateBlog;
