import React, { useEffect, useState, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminEntranceApplications,
  sendExamDetails,
} from '../../redux/adminEntranceSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminEntrance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applications = [], error, loading, sendStatus } = useSelector(
    (state) => state.adminEntrance
  );

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localApplications, setLocalApplications] = useState([]);

  // New state for exam details
  const [examMode, setExamMode] = useState('Online'); // default Online
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    dispatch(fetchAdminEntranceApplications());
  }, [dispatch]);

  useEffect(() => {
    if (applications?.length > 0) {
      setLocalApplications(applications);
    }
  }, [applications]);

  const classOptions = useMemo(() => {
    const unique = new Set();
    applications.forEach((app) => {
      if (app?.classApplying) unique.add(app.classApplying.toString().trim());
    });
    return Array.from(unique);
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (!selectedClass) return localApplications;
    return localApplications.filter(
      (app) => app?.classApplying?.toString().trim() === selectedClass
    );
  }, [localApplications, selectedClass]);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleQuestionPaperClick = () => {
    navigate('/admin/questionpaperview');
  };
const handleApplicantDetailsClick = () => {
  navigate('/admin/applicantsdetails');
};

  const handleSendExamDetails = () => {
    const shortlistedStudents = localApplications.filter((app) => app.shortlisted);

    if (shortlistedStudents.length === 0) {
      toast('Please shortlist at least one student before sending exam details.');
      return;
    }

    if (!examMode || !examDate || !startTime || !endTime) {
     toast('Please fill all exam details: mode, date, start time, and end time.');
      return;
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      toast('Start time and end time must be in HH:mm 24-hour format.');
      return;
    }

    const applicationIds = shortlistedStudents.map((student) => student._id);

    dispatch(
      sendExamDetails({
        examMode,
        examDate,
        startTime,
        endTime,
        applicationIds,
      })
    )
      .unwrap()
      .then(() => {
        toast('Exam details sent successfully.');
        // Optionally, clear shortlisted flags or reset inputs here
      })
      .catch((err) => {
        toast(`Failed to send exam details: ${err}`);
      });
  };

  return (
    <div className="px-4 py-6 md:px-8">
      <h2 className="text-lg md:text-xl font-semibold mb-4 underline underline-offset-4">
        Applicant Details
      </h2>

      {/* Top Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mb-4">
        <button
          onClick={handleQuestionPaperClick}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-md text-sm"
        >
          <FileText className="w-4 h-4" />
          Question Paper
        </button>
        <button
    onClick={handleApplicantDetailsClick}
    className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-md text-sm"
  >
    <FileSpreadsheet className="w-4 h-4" />
    Applicant Exam&nbsp;Details
  </button>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-[#1E3A8A] text-[#1E3A8A] text-sm px-4 py-2 rounded-md focus:outline-none"
        >
          <option value="">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              Class {cls}
            </option>
          ))}
        </select>
      </div>

      {/* Exam Details Inputs */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <select
          value={examMode}
          onChange={(e) => setExamMode(e.target.value)}
          className="border border-[#1E3A8A] text-[#1E3A8A] px-3 py-2 rounded-md text-sm"
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="border border-[#1E3A8A] px-3 py-2 rounded-md text-sm"
          placeholder="Exam Date"
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border border-[#1E3A8A] px-3 py-2 rounded-md text-sm"
          placeholder="Start Time"
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border border-[#1E3A8A] px-3 py-2 rounded-md text-sm"
          placeholder="End Time"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#0F4C81] text-white text-left">
              <th className="px-4 py-3 font-medium">Student Name</th>
              <th className="px-4 py-3 font-medium">Date of Birth</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Class</th>
              <th className="px-4 py-3 font-medium">Percentage</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium text-center">Short Listed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-blue-600">
                  Loading applications...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : filteredApplications?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No applications found for selected class.
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr
                  key={app._id || app.id}
                  className="border-b hover:bg-gray-50 last:border-b-0 cursor-pointer"
                  onClick={() => openModal(app)}
                >
                  <td className="px-4 py-2">
                    {app?.studentDetails?.firstName || ''}{' '}
                    {app?.studentDetails?.lastName || ''}
                  </td>
                  <td className="px-4 py-2">
                    {app?.studentDetails?.dob
                      ? app.studentDetails.dob.split('T')[0]
                      : '--'}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {app?.studentDetails?.gender || '--'}
                  </td>
                  <td className="px-4 py-2">{app?.classApplying || '--'}</td>
                  <td className="px-4 py-2">
                    {app?.previousSchoolDetails?.percentage || '--'}
                  </td>
                  <td className="px-4 py-2">{app?.studentDetails?.phoneNumber || '--'}</td>
                  <td className="px-4 py-2">{app?.studentDetails?.email || '--'}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocalApplications((prev) =>
                          prev.map((item) =>
                            item._id === app._id
                              ? { ...item, shortlisted: !item.shortlisted }
                              : item
                          )
                        );
                      }}
                      className="cursor-pointer"
                      title={app?.shortlisted ? 'Remove from shortlist' : 'Shortlist'}
                    >
                      {app?.shortlisted ? (
                        <CheckSquare className="w-5 h-5 text-green-600 inline" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 inline" />
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-6 text-sm">
        <ChevronLeft className="w-4 h-4 text-gray-600 cursor-pointer" />
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            className={`w-6 h-6 rounded-full ${
              p === 2 ? 'bg-[#1E3A8A] text-white' : 'text-gray-700'
            } flex items-center justify-center`}
          >
            {p}
          </button>
        ))}
        <ChevronRight className="w-4 h-4 text-gray-600 cursor-pointer" />
      </div>

      {/* Send Exam Details Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSendExamDetails}
          className="bg-[#1E3A8A] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#15346b]"
        >
          Send Exam Details
        </button>
      </div>

      {/* Modal */}
      {/* Modal */}
{isModalOpen && selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
    <div className="bg-white rounded-lg max-w-5xl w-full p-8 relative shadow-lg border border-blue-400 max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
      >
        ×
      </button>

      {/* Modal Heading */}
      <h3 className="text-xl font-semibold text-[#1E3A8A] mb-6 underline text-center">
        Full Student Details
      </h3>

      {/* Student Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-sm">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Applicant Name</label>
          <input
            type="text"
            value={`${selectedStudent?.studentDetails?.firstName || ''} ${selectedStudent?.studentDetails?.lastName || ''}`}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Date of Birth</label>
          <input
            type="text"
            value={selectedStudent?.studentDetails?.dob?.split('T')[0] || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">E-mail id</label>
          <input
            type="text"
            value={selectedStudent?.studentDetails?.email || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Contact</label>
          <input
            type="text"
            value={selectedStudent?.studentDetails?.phoneNumber || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Aadhar Card</label>
          <input
            type="text"
            value={selectedStudent?.studentDetails?.aadharNo || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Gender</label>
          <input
            type="text"
            value={selectedStudent?.studentDetails?.gender || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Academic Year</label>
          <input
            type="text"
            value={selectedStudent?.academicYear || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Class Applying for</label>
          <input
            type="text"
            value={selectedStudent?.classApplying || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">School Name</label>
          <input
            type="text"
            value={selectedStudent?.schoolId || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Name of Previous School</label>
          <input
            type="text"
            value={selectedStudent?.previousSchoolDetails?.schoolName || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Last Class Attended</label>
          <input
            type="text"
            value={selectedStudent?.previousSchoolDetails?.lastClassAttended || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Start Date</label>
          <input
            type="text"
            value={selectedStudent?.previousSchoolDetails?.startDate || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">End Date</label>
          <input
            type="text"
            value={selectedStudent?.previousSchoolDetails?.endDate || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Board</label>
          <input
            type="text"
            value={selectedStudent?.previousSchoolDetails?.board || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Previous Year Percentage</label>
          <input
            type="text"
            value={selectedStudent?.previousSchoolDetails?.percentage || ''}
            className="w-full border rounded px-3 py-1.5 text-sm"
            readOnly
          />
        </div>
      </div>
    </div>
  </div>
)}
<ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AdminEntrance;
