import React, { useEffect, useState } from 'react';
import Header from '../adminDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherExams, createTeacherExam } from '../../redux/teacher/createExamSlice';
import { useNavigate } from 'react-router-dom';

function CreateExams() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, createStatus } = useSelector((state) => state.createExam);

  const [formData, setFormData] = useState({
    examType: '',
    examDuration: '',
    fromDate: '',
    toDate: '',
    numberOfSubjects: 1,
    exam: [{ subjectCode: '', subject: '', syllabus: '', date: '' }],
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchTeacherExams());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'numberOfSubjects') {
      const num = parseInt(value, 10) || 0;
      const updatedExam = [...formData.exam];

      if (num > updatedExam.length) {
        while (updatedExam.length < num) {
          updatedExam.push({ subjectCode: '', subject: '', syllabus: '', date: '' });
        }
      } else {
        updatedExam.length = num;
      }

      setFormData((prev) => ({
        ...prev,
        numberOfSubjects: num,
        exam: updatedExam,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...formData.exam];
    updated[index][field] = value;
    setFormData({ ...formData, exam: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

    for (const [i, subject] of formData.exam.entries()) {
      const examDate = new Date(subject.date);
      if (examDate < from || examDate > to) {
        alert(`Exam date for Subject ${i + 1} must be between ${formData.fromDate} and ${formData.toDate}`);
        return;
      }
    }

    dispatch(createTeacherExam(formData)).then(() => {
      dispatch(fetchTeacherExams());
      setShowSuccessMessage(true); // Show the success message
    });
  };

  const handleViewExams = () => {
    navigate('/teacher/exams');
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Create Exams</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Create Exams</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleViewExams}
            className="bg-[#146192] text-white px-4 py-2 rounded hover:bg-[#0d4b6f]"
          >
            View Exams
          </button>
          <Header />
        </div>
      </div>

      <div className="mx-8 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl max-w-4xl md:ml-64">
          {/* Exam Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Exam Type</label>
                <input
                  type="text"
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  className="bg-[#1982C424] rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="bg-[#1982C424] rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Number of Subjects</label>
                <input
                  type="number"
                  name="numberOfSubjects"
                  min="0"
                  value={formData.numberOfSubjects}
                  onChange={handleChange}
                  className="bg-[#1982C424] rounded px-4 py-2 w-full"
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Exam Duration</label>
                <input
                  type="text"
                  name="examDuration"
                  value={formData.examDuration}
                  onChange={handleChange}
                  className="bg-[#1982C424] rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="bg-[#1982C424] rounded px-4 py-2 w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Subjects Dynamic Fields */}
          <div className="space-y-6">
            {formData.exam.map((subject, index) => (
              <div key={index} className="p-4 rounded-md space-y-4 bg-gray-50 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-1">Subject Code</label>
                    <input
                      type="text"
                      value={subject.subjectCode}
                      onChange={(e) => handleSubjectChange(index, 'subjectCode', e.target.value)}
                      className="bg-[#1982C424] rounded px-4 py-2 w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject.subject}
                      onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                      className="bg-[#1982C424] rounded px-4 py-2 w-full"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-1">Exam Date</label>
                    <input
                      type="date"
                      value={subject.date}
                      onChange={(e) => handleSubjectChange(index, 'date', e.target.value)}
                      className="bg-[#1982C424] rounded px-4 py-2 w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Syllabus</label>
                  <input
                    type="text"
                    value={subject.syllabus}
                    onChange={(e) => handleSubjectChange(index, 'syllabus', e.target.value)}
                    className="bg-[#1982C424] rounded px-4 py-2 w-full"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-[#146192] text-white px-6 py-2 rounded hover:bg-[#0d4b6f]"
          >
            Create Exam
          </button>
        </form>

        <div className="mt-6">
          {loading && <p className="text-blue-600">Loading exams...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl text-center shadow-lg max-w-sm">
            <h2 className="text-green-600 text-xl font-semibold">Exam Created Successfully!</h2>
            <button
              onClick={closeSuccessMessage}
              className="mt-4 bg-[#146192] text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateExams;
