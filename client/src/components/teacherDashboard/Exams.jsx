import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherExams,
  editTeacherExam,
  deleteTeacherExam,
  resetDeleteStatus,
} from '../../redux/teacher/createExamSlice';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Exams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { examList, loading, error, deleteStatus, editStatus } = useSelector(
    (state) => state.createExam
  );

  const [editingGroup, setEditingGroup] = useState(null);
  const [editForm, setEditForm] = useState({ examType: '', duration: '', exam: [] });
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [selectedExamGroup, setSelectedExamGroup] = useState(null);

  useEffect(() => {
    dispatch(fetchTeacherExams());
  }, [dispatch]);

  useEffect(() => {
    if (deleteStatus === 'success') {
      setDeleteMessage('Exam group deleted successfully!');
      setTimeout(() => setDeleteMessage(''), 3000);
      dispatch(resetDeleteStatus());
      dispatch(fetchTeacherExams());
    } else if (deleteStatus === 'failed') {
      toast.error('Failed to delete exam group.');
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus, dispatch]);

  const allExamsFlat = examList;

  const handleDownload = (examGroup) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${examGroup.examType} Timetable`, 14, 20);

    const tableData = examGroup.exam.map((subject) => [
      new Date(subject.date).toLocaleDateString(),
      subject.subject,
      subject.duration,
      subject.syllabus,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Date', 'Subject', 'Timing', 'Syllabus']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [20, 97, 146],
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    const fileName = `${examGroup.examType.replace(/\s/g, '_')}_Timetable.pdf`;
    doc.save(fileName);
  };

  const handleEditGroup = (examGroup) => {
    setEditingGroup(examGroup);
    setEditForm({
      examType: examGroup.examType || '',
      fromDate: examGroup.fromDate ? examGroup.fromDate.slice(0, 10) : '',
      toDate: examGroup.toDate ? examGroup.toDate.slice(0, 10) : '',
      noOfSubjects: examGroup.exam.length,
      exam: examGroup.exam.map((sub) => ({
        subjectCode: sub.subjectCode || '',
        subject: sub.subject || '',
        date: sub.date ? sub.date.slice(0, 10) : '',
        duration: sub.duration || '',
        syllabus: sub.syllabus || '',
        _id: sub._id,
      })),
    });
    setSuccessMessage('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleNoOfSubjectsChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    let updatedExam = [...editForm.exam];

    if (count > updatedExam.length) {
      for (let i = updatedExam.length; i < count; i++) {
        updatedExam.push({
          subjectCode: '',
          subject: '',
          date: '',
          duration: '',
          syllabus: '',
        });
      }
    } else if (count < updatedExam.length) {
      updatedExam = updatedExam.slice(0, count);
    }

    setEditForm({
      ...editForm,
      noOfSubjects: count,
      exam: updatedExam,
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedExam = [...editForm.exam];
    updatedExam[index] = {
      ...updatedExam[index],
      [field]: value.trim(),
    };
    setEditForm({
      ...editForm,
      exam: updatedExam,
    });
  };

  const handleUpdateSubmit = async () => {
    if (!editingGroup || !editForm.examType) return;

    try {
      await dispatch(
        editTeacherExam({
          id: editingGroup._id,
          updatedData: {
            examType: editForm.examType,
            fromDate: editForm.fromDate,
            toDate: editForm.toDate,
            exam: editForm.exam,
          },
        })
      ).unwrap();

      setSuccessMessage('Updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingGroup(null);
      dispatch(fetchTeacherExams());
    } catch (err) {
      toast.error(`Failed to update: ${err}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditForm({ examType: '', duration: '', exam: [] });
  };

  const handleDeleteGroup = (examGroup) => {
    dispatch(deleteTeacherExam(examGroup._id));
  };

  const handleSelectExamGroup = (examGroup) => {
    setSelectedExamGroup(examGroup);
  };

  const upcomingExams = examList
    .slice()
    .sort((a, b) => {
      const getEarliestDate = (examGroup) =>
        Math.min(...examGroup.exam.map((subj) => new Date(subj.date).getTime()));
      return getEarliestDate(a) - getEarliestDate(b);
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div> Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">Error: {error}</div>
    );

  return (
    <div className="px-4 py-6 md:p-6 bg-white max-w-6xl mx-auto mt-10 md:ml-72 relative">
      <ToastContainer position="top-right" autoClose={3000} />
    



      <div className="mt-8 border border-gray-200 rounded-lg p-10 shadow-lg">
        <h2 className="text-xl font-medium text-[#146192] mb-4">Upcoming Exams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingExams.length === 0 ? (
            <p>No upcoming exams available.</p>
          ) : (
            upcomingExams.map((exam) => (
              <div
                key={exam._id}
                className={`p-4 border shadow-lg rounded-lg cursor-pointer ${
                  exam.examType.includes('Half Yearly')
                    ? 'bg-[#FF9F1C67]'
                    : exam.examType.includes('Unit Test')
                    ? 'bg-[#FF543E4D]'
                    : 'bg-[#BF156C0D]'
                }`}
                onClick={() => handleSelectExamGroup(exam)}
              >
                <div className="flex justify-between mb-4">
                  <p className="font-semibold">Exam Type:</p>
                  <p>{exam.examType}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="font-semibold">From Date:</p>
                  <p>{new Date(exam.fromDate || Math.min(...exam.exam.map((s) => new Date(s.date)))).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="font-semibold">To Date:</p>
                  <p>{new Date(exam.toDate || Math.max(...exam.exam.map((s) => new Date(s.date)))).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="font-semibold">Class:</p>
                  <p>{exam.class ? `${exam.class} ${exam.section || ''}` : 'N/A'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      {deleteMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
          {deleteMessage}
        </div>
      )}

      <div>
        {(selectedExamGroup ? [selectedExamGroup] : allExamsFlat).map((examGroup) => (
          <div key={examGroup._id} className="mb-8 ">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{examGroup.examType}</h3>
              <div className="space-x-3">
                <button
                  onClick={() => handleEditGroup(examGroup)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteGroup(examGroup)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
               
              </div>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <table className="min-w-full text-sm text-center">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 border">Date</th>
                    <th className="py-3 px-4 border">Subject</th>
                    <th className="py-3 px-4 border">Timing</th>
                    <th className="py-3 px-4 border">Syllabus</th>
                  </tr>
                </thead>
                <tbody>
                  {examGroup.exam
                    .slice()
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((subject, index) => (
                      <tr
                        key={subject._id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="py-4 px-4 border">
                          {new Date(subject.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 border">{subject.subject}</td>
                        <td className="py-4 px-4 border">{subject.duration}</td>
                        <td className="py-4 px-4 border">{subject.syllabus}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleDownload(examGroup)}
                className="border border-red-500 text-red-500 bg-white px-4 py-2 rounded-md shadow hover:bg-red-50"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
{editingGroup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="relative bg-white p-6 rounded shadow-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
      {/* ❌ Close Button */}
      <button
        onClick={handleCancelEdit}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        aria-label="Close"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4">Edit Exam Group</h3>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Exam Type*</label>
          <input
            type="text"
            name="examType"
            value={editForm.examType}
            onChange={handleEditChange}
            className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">From Exam Date*</label>
          <input
            type="date"
            name="fromDate"
            value={editForm.fromDate}
            onChange={handleEditChange}
            className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Exam Date*</label>
          <input
            type="date"
            name="toDate"
            value={editForm.toDate}
            onChange={handleEditChange}
            className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">No.of Subjects*</label>
          <input
            type="number"
            min="1"
            name="noOfSubjects"
            value={editForm.noOfSubjects}
            onChange={handleNoOfSubjectsChange}
            className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Subject Entries */}
      {editForm.exam.map((subject, index) => (
        <div
          key={index}
          className="mb-5 p-4 border border-gray-300 rounded-lg bg-[#f1f7fb] shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Code*</label>
              <input
                type="text"
                value={subject.subjectCode}
                onChange={(e) => handleSubjectChange(index, 'subjectCode', e.target.value)}
                className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name 0{index + 1}*</label>
              <input
                type="text"
                value={subject.subject}
                onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exam Date 0{index + 1}*</label>
              <input
                type="date"
                value={subject.date}
                onChange={(e) => handleSubjectChange(index, 'date', e.target.value)}
                className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exam Duration*</label>
              <input
                type="text"
                value={subject.duration}
                onChange={(e) => handleSubjectChange(index, 'duration', e.target.value)}
                className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Syllabus*</label>
            <input
              type="text"
              value={subject.syllabus}
              onChange={(e) => handleSubjectChange(index, 'syllabus', e.target.value)}
              className="w-full bg-[#e7f0f7] border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleUpdateSubmit}
          disabled={editStatus === 'pending'}
          className={`px-8 py-2 rounded font-medium text-white ${
            editStatus === 'pending'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#146192] hover:bg-[#0d4b6f]'
          }`}
        >
          {editStatus === 'pending' ? 'Updating...' : 'Save'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Exams;
