import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherExams } from '../../redux/teacher/createExamSlice';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const Exams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examList, loading, error } = useSelector((state) => state.createExam);
  const [selectedExamType, setSelectedExamType] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTeacherExams());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div> Loading...
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  const groupedExams = examList.reduce((groups, examGroup) => {
    if (!groups[examGroup.examType]) {
      groups[examGroup.examType] = [];
    }
    groups[examGroup.examType].push(examGroup);
    return groups;
  }, {});

  const handleExamTypeChange = (event) => {
    setSelectedExamType(event.target.value);
    setDropdownOpen(false);
  };

  const filteredExams = selectedExamType
    ? groupedExams[selectedExamType] || []
    : Object.values(groupedExams).flat();

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text('Exam Timetable', 20, 10);

    let yOffset = 20;
    filteredExams.forEach((examGroup) => {
      doc.text(examGroup.examType, 20, yOffset);
      yOffset += 10;

      examGroup.exam.forEach((subject) => {
        doc.text(`Date: ${new Date(subject.date).toLocaleDateString()}`, 20, yOffset);
        yOffset += 5;
        doc.text(`Subject: ${subject.subject}`, 20, yOffset);
        yOffset += 5;
        doc.text(`Timing: ${examGroup.examDuration}`, 20, yOffset);
        yOffset += 5;
        doc.text(`Syllabus: ${subject.syllabus}`, 20, yOffset);
        yOffset += 10;
      });
    });

    doc.save(`${selectedExamType}_Timetable.pdf`);
  };

  return (
    <div className="px-4 py-6 md:p-6 bg-white  max-w-6xl mx-auto mt-10 md:ml-72">

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/CreateExams')}
          className="bg-[#146192] text-white px-4 py-2 rounded hover:bg-[#0d4b6f]"
        >
          ← Back
        </button>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center sm:text-left">Exams</h2>
      </div>

      {/* Dropdown Filter */}
      <div className="mb-6">
        <label htmlFor="examType" className="block text-sm font-semibold text-gray-700 mb-2">
          Filter by Exam Type
        </label>
        <select
          id="examType"
          value={selectedExamType}
          onChange={handleExamTypeChange}
          className="w-full sm:w-56 p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Exam Types</option>
          {Object.keys(groupedExams).map((examType) => (
            <option key={examType} value={examType}>
              {examType}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {filteredExams.map((examGroup, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">{examGroup.examType}</h3>

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
                  {examGroup.exam.map((subject, subIndex) => (
                    <tr
                      key={subject._id}
                      className={subIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="py-4 px-4 border">
                        {new Date(subject.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 border">{subject.subject}</td>
                      <td className="py-4 px-4 border">{examGroup.examDuration}</td>
                      <td className="py-4 px-4 border">{subject.syllabus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download Button */}
            {selectedExamType && examGroup.examType === selectedExamType && (
              <div className="flex justify-center mt-4 relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="border border-red-500 text-red-500 bg-white px-4 py-2 rounded-md shadow hover:bg-red-50"
                >
                  Download
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-12 bg-white border border-gray-200 rounded-md shadow-lg w-24 z-10">
                    <button
                      onClick={handleDownload}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#285A87]"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile View Cards */}
      <div className="md:hidden">
        {filteredExams.map((examGroup) =>
          examGroup.exam.map((subject) => (
            <div key={subject._id} className="bg-white p-4 rounded-lg shadow mb-4 space-y-2 border border-gray-200">
              <div className="text-sm text-gray-600 font-medium">Exam Type:</div>
              <div className="text-base font-semibold">{examGroup.examType}</div>
              <div className="text-sm text-gray-600">Date:</div>
              <div className="text-base">{new Date(subject.date).toLocaleDateString()}</div>
              <div className="text-sm text-gray-600">Subject:</div>
              <div className="text-base">{subject.subject}</div>
              <div className="text-sm text-gray-600">Timing:</div>
              <div className="text-base">{examGroup.examDuration}</div>
              <div className="text-sm text-gray-600">Syllabus:</div>
              <div className="text-base">{subject.syllabus}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exams;
