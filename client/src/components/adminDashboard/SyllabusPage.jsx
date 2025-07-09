import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSyllabus, createOrUpdateSyllabus } from "../../redux/curriculum";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SyllabusPage = () => {
  const dispatch = useDispatch();
  const { syllabus } = useSelector((state) => state.adminCurriculum);

  const [selectedClass, setSelectedClass] = useState("1");
  const [isSyllabusFormOpen, setIsSyllabusFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingSyllabusId, setEditingSyllabusId] = useState(null);

  const [syllabusForm, setSyllabusForm] = useState({
    className: "1",
    subject: "",
    description: "",
    file: null,
  });

  const staticClasses = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    dispatch(fetchSyllabus(selectedClass));
  }, [dispatch, selectedClass]);

  const filteredSyllabus =
    syllabus?.syllabus?.filter((s) => s.class === selectedClass) || [];

  const handleDownloadSyllabus = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "syllabus.pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const openAddSyllabus = () => {
    setFormMode("add");
    setEditingSyllabusId(null);
    setSyllabusForm({
      className: selectedClass,
      subject: "",
      description: "",
      file: null,
    });
    setIsSyllabusFormOpen(true);
  };

  const openEditSyllabus = (item) => {
    setFormMode("edit");
    setEditingSyllabusId(item._id);
    setSyllabusForm({
      className: item.class,
      subject: item.subject,
      description: item.description,
      file: null,
    });
    setIsSyllabusFormOpen(true);
  };

  const handleSyllabusSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: formMode === "edit" ? editingSyllabusId : undefined,
      className: syllabusForm.className,
      subject: syllabusForm.subject,
      description: syllabusForm.description,
      file: syllabusForm.file,
    };

    try {
      await dispatch(createOrUpdateSyllabus(payload)).unwrap();
      toast.success(`Syllabus ${formMode === "edit" ? "updated" : "saved"}`);
      setIsSyllabusFormOpen(false);
      setEditingSyllabusId(null);
      dispatch(fetchSyllabus(selectedClass));
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-12 bg-white rounded shadow">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-light text-black xl:text-[30px]">
            Curriculum
          </h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}
            <span className="xl:text-[17px] text-lg font-medium text-[#146192]">
              Syllabus
            </span>
          </h1>
          <h2 className="text-xl font-semibold text-[#146192] pt-10">
            📘 Class Syllabus Uploaded Information
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openAddSyllabus}
            className="bg-[#146192] text-white text-sm px-4 py-2 rounded-md hover:bg-[#0f4c7a]"
          >
            ➕ Add Syllabus
          </button>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 text-sm rounded-md px-3 py-2"
          >
            {staticClasses.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-[#f1f5f9]">
            <tr>
              <th className="border px-3 py-2">Class</th>
              <th className="border px-3 py-2">Subject</th>
              <th className="border px-3 py-2">Description</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSyllabus.length > 0 ? (
              filteredSyllabus.map((item) => (
                <tr key={item._id}>
                  <td className="border px-3 py-2">{item.class}</td>
                  <td className="border px-3 py-2">{item.subject}</td>
                  <td className="border px-3 py-2">{item.description}</td>
                  <td className="border px-3 py-2 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleDownloadSyllabus(item.syllabus)}
                      className="text-gray-700 hover:text-black"
                      title="Download syllabus"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => openEditSyllabus(item)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit syllabus"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No syllabus found for this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Syllabus Form Modal */}
      {isSyllabusFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsSyllabusFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center text-[#146192]">
              {formMode === "edit" ? "Edit Syllabus" : "Add Syllabus"}
            </h2>

            <form onSubmit={handleSyllabusSubmit}>
              <label className="block mb-2 text-sm">Class</label>
              <input
                type="number"
                value={syllabusForm.className || ""}
                onChange={(e) =>
                  setSyllabusForm({
                    ...syllabusForm,
                    className: Number(e.target.value),
                  })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
                min={1}
                required
              />

              <label className="block mb-2 text-sm">Subject</label>
              <input
                type="text"
                value={syllabusForm.subject}
                onChange={(e) =>
                  setSyllabusForm({ ...syllabusForm, subject: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
                placeholder="Enter subject"
                required
              />

              <textarea
                placeholder="Description"
                value={syllabusForm.description}
                onChange={(e) =>
                  setSyllabusForm({ ...syllabusForm, description: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
                required
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSyllabusForm({ ...syllabusForm, file });
                }}
                className="mb-3"
                required={formMode === "add"}
              />

              <button
                type="submit"
                className="w-full bg-[#146192] text-white py-2 rounded"
              >
                {formMode === "edit" ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusPage;
