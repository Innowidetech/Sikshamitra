import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAims,
  deleteAim,
  createAim,
  fetchSyllabus,
  fetchExams,
} from "../../redux/curriculum";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [newAim, setNewAim] = useState({ title: "", description: "" });

  useEffect(() => {
    dispatch(fetchAims());
  }, [dispatch]);

  // Extract unique classes and sections from syllabus data
  const availableClasses = [
    ...new Set((syllabus?.syllabus || []).map((item) => item.class)),
  ].sort();
  const availableSections = [
    ...new Set(
      (syllabus?.syllabus || [])
        .filter((item) => item.class === selectedClass)
        .map((item) => item.section)
    ),
  ].sort();

  // Set initial values when data is loaded
  useEffect(() => {
    if (availableClasses.length > 0 && !selectedClass) {
      setSelectedClass(availableClasses[0]);
    }
  }, [availableClasses]);

  useEffect(() => {
    if (availableSections.length > 0 && !selectedSection) {
      setSelectedSection(availableSections[0]);
    }
  }, [selectedClass, availableSections]);

  const handleSyllabusClick = async () => {
    try {
      await dispatch(fetchSyllabus()).unwrap();
      setIsSyllabusModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to fetch syllabus");
    }
  };

  const handleExamsClick = async () => {
    try {
      await dispatch(fetchExams()).unwrap();
      setIsExamsModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to fetch exams");
    }
  };

  const handleDelete = async (aimId) => {
    if (window.confirm("Are you sure you want to delete this aim?")) {
      try {
        await dispatch(deleteAim(aimId)).unwrap();
        toast.success("Aim deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete aim");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAim(newAim)).unwrap();
      toast.success("Aim created successfully");
      setIsModalOpen(false);
      setNewAim({ title: "", description: "" });
    } catch (error) {
      toast.error(error.message || "Failed to create");
    }
  };

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSelectedSection(""); // Reset section when class changes
  };

  const filteredSyllabus =
    syllabus?.syllabus?.filter(
      (item) =>
        item.class === selectedClass &&
        (selectedSection ? item.section === selectedSection : true)
    ) || [];

  const filteredExams =
    exams?.exams?.filter(
      (item) =>
        item.class === selectedClass &&
        (selectedSection ? item.section === selectedSection : true)
    ) || [];

  const SyllabusModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative mx-6">
        <button
          onClick={() => setIsSyllabusModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-[#146192] text-center">
          Syllabus
        </h2>
        <div className="mb-4 flex gap-4">
          <div>
            <label className="mr-2">Class:</label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="border rounded px-2 py-1"
            >
              {availableClasses
                .slice()
                .sort((a, b) => a - b)
                .map((classNum) => (
                  <option key={classNum} value={classNum}>
                    {classNum}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Sections</option>
              {availableSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Class</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Syllabus Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredSyllabus.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2 text-center">{item.class}</td>
                  <td className="border p-2 text-center">{item.section}</td>
                  <td className="border p-2 text-center">
                    <a
                      href={item.syllabus}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Syllabus
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ExamsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl relative">
        <button
          onClick={() => setIsExamsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl text-center font-semibold mb-4 text-[#146192]">
          Timetable
        </h2>
        <div className="mb-4 flex gap-4">
          <div>
            <label className="mr-2">Class:</label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="border rounded px-2 py-1"
            >
              {availableClasses
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => a - b) // Sort numerically in ascending order
                .map((classNum) => (
                  <option key={classNum} value={classNum}>
                    {classNum}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Sections</option>
              {availableSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredExams.map((examSchedule) => (
            <div key={examSchedule._id} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {examSchedule.examType}
              </h3>
              <p className="mb-2">Duration: {examSchedule.examDuration}</p>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-[#FFC107]">
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Subject Code</th>
                    <th className="border p-2">Syllabus</th>
                  </tr>
                </thead>
                <tbody>
                  {examSchedule.exam.map((exam) => (
                    <tr key={exam._id} className="bg-[#E3F2FD]">
                      <td className="border p-2 text-center">
                        {new Date(exam.date).toLocaleDateString()}
                      </td>
                      <td className="border p-2 text-center">{exam.subject}</td>
                      <td className="border p-2 text-center">
                        {exam.subjectCode}
                      </td>
                      <td className="border p-2 text-center">
                        {exam.syllabus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
          onClick={() => setIsModalOpen(true)}
        >
          Create
        </button>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-[#146192]">
              Create New Aim
            </h2>
            <form onSubmit={handleCreate}>
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
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Syllabus Modal */}
      {isSyllabusModalOpen && <SyllabusModal />}

      {/* Exams Modal */}
      {isExamsModalOpen && <ExamsModal />}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <>
          {/* Desktop View */}
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
                  >
                    <Trash2 size={20} />
                  </button>
                  <h3 className="text-xl font-semibold text-[white] text-center mb-4 border-b-2 pb-2">
                    {aim.title}
                  </h3>
                  <p className="text-white text-center">{aim.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-8 rounded-lg lg:p-6 grid lg:grid-cols-2 gap-6">
            {/* Syllabus Image */}
            <div className="relative flex justify-center items-center">
              <img
                src={curri1}
                alt="curri1"
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={handleSyllabusClick}
                className="absolute bg-transparent text-white border border-white rounded-full px-6 py-2 text-lg font-medium hover:bg-white hover:text-[#146192] transition-colors"
              >
                Syllabus
              </button>
            </div>

            {/* Exams Image */}
            <div className="relative flex justify-center items-center">
              <img
                src={curri2}
                alt="curri2"
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={handleExamsClick}
                className="absolute bg-[#233255] text-white rounded-full px-6 py-2 text-lg font-medium hover:bg-white hover:text-[#233255] transition-colors"
              >
                Exams
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Curriculam;
