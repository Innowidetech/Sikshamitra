import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import Header from "../adminStaffDashboard/layout/Header";
import { RiDeleteBin5Line } from "react-icons/ri";
import { updateBlog } from "../../redux/superAdminStaff/superAdminStaffCreateBlogSlice";

const SuperAdminStaffEditBlog = ({ blogId }) => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.superAdminStaffBlog);
  const blog = blogs.find((b) => b._id === blogId);

  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setEntries(blog.blog);
    }
  }, [blog]);

  const handleDescriptionChange = (index, newDesc) => {
    const updated = [...entries];
    updated[index].description = newDesc;
    setEntries(updated);
  };

  const handleDeleteEntry = (index) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirm) {
      const updated = entries.filter((_, i) => i !== index);
      setEntries(updated);
    }
  };

  const handleSave = () => {
    // Call your API here to save the updated blog using blogId, title, and entries
    console.log("Saving blog:", {
      id: blogId,
      title,
      blog: entries,
    });

    alert("Save action triggered (implement API call)");
  };

  if (!blog) {
    return (
      <div className="bg-[#f3f9fb] min-h-screen pt-20">
        <Header />
        <div className="md:ml-64 p-4 md:p-6">
          <h2 className="text-red-500 text-xl font-semibold">Blog not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f9fb] min-h-screen pt-20">
      <Header />
      <div className="md:ml-64 p-4 md:p-6">
        <div className="pb-8">
          <h1 className="text-xl font-light xl:text-[32px]">Staff Blog</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2 text-xs md:text-md xl:text-[17px]">
            Home &gt;{" "}
            <span className="text-[#146192]">Blog &gt; Edit Blog</span>
          </h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="mb-6 max-w-lg">
            <h1 className="text-xl font-semibold text-[#000000]">{title}</h1>
          </div>

          {/* Cards layout */}
          <div className="bg-[#1461921A] shadow-md rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap gap-6">
              {entries.map((entry, index) => (
                <div
                  key={entry._id || index}
                  className="w-[267px] h-[320px] flex flex-col border border-[#cce7f1] rounded-lg overflow-hidden shadow-sm bg-white"
                >
                  {/* Image */}
                  <div className="h-[187px]">
                    <img
                      src={entry.photo}
                      alt="Blog Entry"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Description + Delete button */}
                  <div className="flex flex-col justify-between flex-grow p-3">
                    <p className="text-[14px] text-[#000000] h-[70px] overflow-y-auto pr-1 scrollbar-hide">
                      {entry.description}
                    </p>

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleDeleteEntry(index)}
                        className="p-1 bg-[#146192] text-white rounded-sm hover:bg-[#0d8de1]"
                      >
                        <RiDeleteBin5Line size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-[#1461921A] shadow-md rounded-lg p-6 space-y-4">
                <div className="bg-[#F4F4F4] w-[190px] h-[190px]">
                  <label className="cursor-pointer text-sm text-[#146191]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    <div className="flex flex-col items-center justify-center h-full">
                      <h1 className="font-semibold text-[#858585] text-[100px] flex justify-center mb-6">
                        +
                      </h1>
                    </div>
                  </label>
                </div>
                <div className="flex flex-col h-full">
                  <textarea // Use title state instead of blog.title
                    onChange={(e) => setTitle(e.target.value)} //
                    placeholder="Enter ...."
                    className="w-full p-1 border border-[#146192] rounded-lg "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#146192ED] text-white rounded-full hover:bg-[#0d8de1] font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminStaffEditBlog;
