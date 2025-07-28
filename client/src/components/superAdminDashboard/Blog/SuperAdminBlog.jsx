import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";

import {
  fetchUserBlogs,
  deleteBlogById,
} from "../../../redux/superAdmin/SuperAdminBlogSclice";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminBlog = ({ onCreateBlog, onEditBlog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, loading, error } = useSelector(
    (state) => state.superAdminUserBlogs // updated to match your registered store reducer
  );

  useEffect(() => {
    dispatch(fetchUserBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBlogById(id))
      .unwrap()
      .then(() => {
        toast.success("Blog deleted successfully.");
        dispatch(fetchUserBlogs()); // refresh blog list
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Failed to delete blog.");
      });
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}

      <div className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">
              Blog
            </h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2 text-sm md:text-base">
              <span>Home</span> {">"}{" "}
              <span className="font-medium text-[#146192]">Blogs </span>
            </h1>
          </div>

          <Header />
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate("/superadmin/blog/create-blog")}
          className="px-5 py-2 bg-[#146192] hover:bg-[#0d8de1] text-white rounded-full text-sm font-medium transition duration-200"
        >
          + Create Blog
        </button>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {blog.title}
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/superadmin/edit-blog/${blog._id}`)
                    } // navigate to edit page(blog._id)}
                    className="text-[#285A87] hover:text-[#0d8de1]"
                  >
                    <FaRegEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-[#285A87] hover:text-red-500"
                  >
                    <RiDeleteBin5Line size={22} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {blog.blog.map((item) => (
                  <div
                    key={item._id}
                    className="w-[267px] border border-[#cce7f1] rounded-lg shadow-sm bg-white overflow-hidden"
                  >
                    <img
                      src={item.photo}
                      alt="Blog"
                      className="w-full h-[187px] object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm text-gray-700">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminBlog;
