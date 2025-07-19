import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/superAdminStaff/superAdminStaffBlogSlice";
import Header from "../adminStaffDashboard/layout/Header";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteBlog } from "../../redux/superAdminStaff/superAdminStaffCreateBlogSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminStaffBlogDashboard = ({ onCreateBlog, onEditBlog }) => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector(
    (state) => state.superAdminStaffBlog
  );

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBlog(id))
      .unwrap()
      .then(() => {
        toast.success("Blog deleted successfully.");
        dispatch(fetchBlogs()); // 🔄 Refresh the list
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert(err || "Failed to delete blog.");
      });
  };

  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Main content shifted right to account for sidebar */}
      <div className="md:ml-64 p-4 md:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center py-10">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Blog</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
              &gt;{" "}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Blogs
              </span>
            </h1>
          </div>
        </div>

        {/* Create Blog Button */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-end">
          <button
            onClick={onCreateBlog}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#146192ED] hover:bg-[#0d8de1] text-white rounded-full text-sm font-medium"
          >
            Create Blog
          </button>
        </div>

        {/* Blog list */}
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
              {/* Title + Edit/Delete row */}
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-800 truncate">
                  {blog.title}
                </div>

                <div className="flex space-x-3">
                  <button
                    className="flex items-center gap-1 text-[#285A87] text-sm font-medium"
                    onClick={() => onEditBlog(blog._id)}
                  >
                    <FaRegEdit size={20} />
                  </button>
                  <button
                    className="flex items-center gap-1 text-[#285A87] text-sm font-medium"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <RiDeleteBin5Line size={22} />
                  </button>
                </div>
              </div>

              {/* Blog content: Cards layout */}
              <div className="flex flex-wrap gap-6">
                {blog.blog.map((item) => (
                  <div
                    key={item._id}
                    className="w-[267px] border border-[#cce7f1] rounded-lg overflow-hidden shadow-sm bg-white"
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
      </div>
    </div>
  );
};

export default SuperAdminStaffBlogDashboard;
