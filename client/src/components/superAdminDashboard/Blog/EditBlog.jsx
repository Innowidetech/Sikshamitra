import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RiDeleteBin5Line } from "react-icons/ri";
import Header from "../layout/Header";
import { updateBlogById } from "../../../redux/superAdmin/SuperAdminBlogSclice";

const EditBlog = () => {
  const { id: blogId } = useParams();
  const dispatch = useDispatch();

  const blog = useSelector((state) =>
    state.superAdminUserBlogs?.blogs?.find((b) => b._id === blogId)
  );

  const [entries, setEntries] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    if (blog) {
      // Map existing entries to maintain consistency
      const formatted = blog.blog.map((entry) => ({
        photo: entry.photo, // existing photo URL
        description: entry.description,
      }));
      setEntries(formatted);
    }
  }, [blog]);

  const handleDeleteEntry = (index) => {
    toast.success("Entry deleted successfully!");
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  const handleSave = () => {
    if (!blogId) {
      toast.error("Blog ID is missing!");
      return;
    }

    const formData = new FormData();

    entries.forEach((entry, index) => {
      // Add description
      formData.append(`blog[${index}][description]`, entry.description || "");

      // Add corresponding photo
      if (entry.photo instanceof File) {
        formData.append("photos", entry.photo);
      } else {
        // Send placeholder image file
        const placeholder = new File(["dummy"], "placeholder.png", {
          type: "image/png",
        });
        formData.append("photos", placeholder);
      }
    });

    dispatch(updateBlogById({ id: blogId, formData })).then((res) => {
      if (!res.error) {
        toast.success("Blog updated successfully!");
      } else {
        toast.error(res.payload?.message || "Failed to update blog");
      }
    });
  };

  const handleAddNewEntry = () => {
    if (!newPhoto || !newDescription) {
      toast.warn("Please provide both photo and description");
      return;
    }

    const newEntry = {
      photo: newPhoto, // keep the File object
      description: newDescription,
    };

    setEntries([...entries, newEntry]);
    setNewPhoto(null);
    setNewDescription("");
  };

  if (!blog) {
    return (
      <div className="bg-[#f3f9fb] min-h-screen pt-20">
        <div className="md:ml-64 p-4 md:p-6">
          <h2 className="text-red-500 text-xl font-semibold">Blog not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f9fb] min-h-screen pt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="md:p-6">
        <div className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-black xl:text-[38px]">
                Blog
              </h1>
              <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
              <h1 className="mt-2 text-sm md:text-base">
                <span>Home</span> {">"}{" "}
                <span className="font-medium text-[#146192]">Edit-Blogs </span>
              </h1>
            </div>
            <Header />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="mb-6 max-w-lg">
            <h2 className="text-xl font-semibold text-[#146192]">
              {blog.title}
            </h2>
          </div>

          <div className="bg-[#1461921A] shadow-md rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap gap-6">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="w-[267px] h-[320px] flex flex-col border border-[#cce7f1] rounded-lg overflow-hidden shadow-sm bg-white"
                >
                  <div className="h-[187px]">
                    <img
                      src={
                        entry.photo instanceof File
                          ? URL.createObjectURL(entry.photo)
                          : entry.photo
                      }
                      alt="Blog Entry"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-grow p-3">
                    <textarea
                      value={entry.description}
                      onChange={(e) => {
                        const updated = [...entries];
                        updated[index].description = e.target.value;
                        setEntries(updated);
                      }}
                      className="text-[14px] text-[#000000] h-[70px] overflow-y-auto pr-1 border rounded"
                    />
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

              <div className="w-[267px] h-[320px] border border-[#cce7f1] bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-4">
                <div className="bg-[#F4F4F4] w-[190px] h-[190px] mb-4 flex items-center justify-center">
                  <label className="cursor-pointer text-[#146192]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setNewPhoto(e.target.files[0])}
                    />
                    <span className="text-[80px]">+</span>
                  </label>
                </div>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter description..."
                  className="w-full border border-[#146192] rounded-lg p-1 mb-2 text-sm"
                />
                <button
                  onClick={handleAddNewEntry}
                  className="text-sm px-3 py-1 bg-[#146192ED] text-white rounded hover:bg-[#0d8de1]"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>

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

export default EditBlog;
