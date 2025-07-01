import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAims,
  deleteAim,
  createAim,
  updateAim, // <-- ✅ ADD THIS
  fetchSyllabus,
  fetchExams,
  createOrUpdateSyllabus,
} from "../../redux/curriculum";
import html2pdf from "html2pdf.js";
import { Trash2, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import curri1 from "../../assets/curriculumn1.png";
import curri2 from "../../assets/curriculumn2.png";

function Curriculam() {
  const dispatch = useDispatch();
  const { aims, syllabus, exams, loading, error } = useSelector(
    (state) => state.adminCurriculum
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isSyllabusFormOpen, setIsSyllabusFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingAim, setEditingAim] = useState(null);

  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedSection, setSelectedSection] = useState("");
  const [newAim, setNewAim] = useState({ title: "", description: "" });

  const [syllabusForm, setSyllabusForm] = useState({
    className: "1",
    subject: "",
    description: "",
    file: null,
  });

  const staticClasses = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const availableClasses = Array.from(
    new Set((exams?.examTimeTables || []).map((e) => e.class))
  );

  useEffect(() => {
    dispatch(fetchAims());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSyllabus(selectedClass));
  }, [dispatch, selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection(""); // Reset section when class changes
  };

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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAim(newAim)).unwrap();
      toast.success("Aim added");
      setNewAim({ title: "", description: "" });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this aim?")) {
      try {
        await dispatch(deleteAim(id)).unwrap();
        toast.success("Deleted successfully");
      } catch (err) {
        toast.error(err.message || "Failed");
      }
    }
  };

  const handleSyllabusClick = async () => {
    try {
      await dispatch(fetchSyllabus(selectedClass)).unwrap();
      setIsSyllabusModalOpen(true);
    } catch (err) {
      toast.error(err.message || "Failed to load syllabus");
    }
  };

  const handleExamsClick = async () => {
    try {
      await dispatch(fetchExams()).unwrap();
      setIsExamsModalOpen(true);
    } catch (err) {
      toast.error(err.message || "Failed to load exams");
    }
  };

  const filteredSyllabus =
    syllabus?.syllabus?.filter((s) => s.class === selectedClass) || [];

  const filteredExams =
    exams?.exam?.filter(
      (et) =>
        String(et.class) === String(selectedClass) &&
        (!selectedSection || et.section === selectedSection)
    ) || [];

  const openAddSyllabus = () => {
    setFormMode("add");
    setSyllabusForm({
      className: selectedClass,
      subject: "",
      description: "",
      file: null,
    });
    setIsSyllabusFormOpen(true);
  };

  const handleSyllabusSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("className", syllabusForm.className);
    formData.append("subject", syllabusForm.subject);
    formData.append("description", syllabusForm.description);
    if (syllabusForm.file) {
      formData.append("file", syllabusForm.file);
    }

    try {
      await dispatch(createOrUpdateSyllabus(formData)).unwrap();
      toast.success("Syllabus saved");
      setIsSyllabusFormOpen(false);
      dispatch(fetchSyllabus(selectedClass));
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  };




  const ExamsModal = () => {
    const exams2 = useSelector((state) => state.adminCurriculum.exams?.exams || []);
    const [filterClass, setFilterClass] = useState("");
    const contentRef = useRef(); // For PDF

    const uniqueClasses = [...new Set(exams2.map((e) => e.class))];

    const filteredExams = exams2.filter((exam) => {
      return filterClass ? String(exam.class) === String(filterClass) : true;
    });

    const handleDownload = () => {
      const element = contentRef.current;
      const opt = {
        margin: 0.5,
        filename: `exam_timetable_class_${filterClass || "all"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={() => setIsExamsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#146192]">Exam Timetable</h2>
          </div>

          <div className="mb-6">
            <label className="mr-2 text-sm">Class - </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border px-3 py-1 rounded text-sm"
            >
              <option value="">Select</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* PDF Content */}
          <div ref={contentRef}>
            {filteredExams.length === 0 ? (
              <p className="text-center text-gray-500">No exams found for selected class.</p>
            ) : (
              filteredExams.map((schedule) => (
                <div key={schedule._id} className="mb-6 border border-gray-300 rounded-lg">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="border px-4 py-2">DATE</th>
                        <th className="border px-4 py-2">SUBJECT NAME</th>
                        <th className="border px-4 py-2">TIMINGS</th>
                        <th className="border px-4 py-2">SYLLABUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.exam.map((e) => (
                        <tr key={e._id}>
                          <td className="border px-4 py-2">
                            {new Date(e.date).toLocaleDateString()}
                          </td>
                          <td className="border px-4 py-2">{e.subject}</td>
                          <td className="border px-4 py-2">10:00 am - 1:00 pm</td>
                          <td className="border px-4 py-2">{e.syllabus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>

          {/* Download Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleDownload}
              className="bg-[#146192] hover:bg-[#0f4c7a] text-white px-6 py-2 rounded-md"
            >
              Download ⤓
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mx-8 py-10">
        <div>
          <h1 className="text-xl font-light text-black xl:text-[30px]">
            Curriculum
          </h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}
            <span className="xl:text-[17px] text-lg font-medium text-[#146192]">
              Curriculum
            </span>
          </h1>
        </div>
        <button
          className="bg-[#146192] text-white px-6 py-2 rounded-md hover:bg-[#0f4c7a] transition-colors"
          onClick={() => {
            setIsModalOpen(true);
            setEditMode(false);
            setNewAim({ title: "", description: "" });
          }}
        >
          Create
        </button>
      </div>

      {(isModalOpen || editMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
                setNewAim({ title: "", description: "" });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-[#146192]">
              {editMode ? "Edit Aim" : "Create New Aim"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (editMode) {
                    await dispatch(updateAim({ id: editingAim._id, updatedData: newAim })).unwrap();
                    toast.success("Aim updated successfully");
                    setEditMode(false);
                  } else {
                    await dispatch(createAim(newAim)).unwrap();
                    toast.success("Aim created successfully");
                    setIsModalOpen(false);
                  }
                  setNewAim({ title: "", description: "" });
                } catch (err) {
                  toast.error(err.message || "Operation failed");
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newAim.title}
                  onChange={(e) =>
                    setNewAim({ ...newAim, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newAim.description}
                  onChange={(e) =>
                    setNewAim({ ...newAim, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#146192] h-32"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#146192] text-white py-2 rounded-md hover:bg-[#0f4c7a] transition-colors"
              >
                {editMode ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}


      {isExamsModalOpen && <ExamsModal />}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <>
          <div className="bg-[#94A7B829] mx-8 rounded-lg lg:p-6">
            <div className="text-center">
              <h1 className="text-lg font-medium p-4 inline-block">
                School Aims and Objectives
              </h1>
              <hr className="bg-[#146192] h-[2px] w-[25%] mx-auto mb-6" />
            </div>

            <div className="grid lg:grid lg:grid-cols-3 gap-6 mx-8 mb-6 py-10">
              {aims?.aimObjectives?.map((aim) => (
                <div
                  key={aim._id}
                  className="bg-[#285A87] p-6 rounded-lg shadow-md relative"
                >
                  <button
                    onClick={() => handleDelete(aim._id)}
                    className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditingAim(aim);
                      setNewAim({ title: aim.title, description: aim.description });
                    }}
                    className="absolute top-4 left-4 text-blue-200 hover:text-white transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <h3 className="text-xl font-semibold text-white text-center mb-4 border-b-2 pb-2">
                    {aim.title}
                  </h3>
                  <p className="text-white text-center">{aim.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-8 rounded-lg lg:p-6 grid lg:grid-cols-2 gap-6">
            <div className="relative flex justify-center items-center">
              <img
                src={curri1}
                alt="curri1"
                className="w-full h-auto rounded-lg"
              />
              <button
                className="absolute bottom-20 px-6 py-2 border border-b-2  text-[#146192] rounded-3xl text-lg font-bold"
                onClick={() => navigate('/admin/curriculum/syllabus')}
              >
                View Syllabus
              </button>
            </div>

            <div className="relative flex justify-center items-center">
              <img
                src={curri2}
                alt="curri2"
                className="w-full h-auto rounded-lg"
              />
              <button
                className="absolute bottom-20 px-6 py-2 border border-b-2  text-[#146192] rounded-3xl text-lg font-bold"
                onClick={() => navigate("/admin/curriculum/exams")}
              >
                View Exam Timetable
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
};

export default Curriculam;
