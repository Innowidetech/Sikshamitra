import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, clearExams } from '../../redux/parent/examSlice';
import Header from './layout/Header';

function Exams() {
  // State for dropdown selections
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');

  // Redux state for exams
  const dispatch = useDispatch();
  const { examList, loading, error } = useSelector((state) => state.exams);

  // Trigger fetchExams when component mounts
  useEffect(() => {
    dispatch(fetchExams());

    // Clear exams when the component unmounts (optional)
    return () => {
      dispatch(clearExams());
    };
  }, [dispatch]);

  // Filter exams based on dropdown selections
  const filteredExams = examList.filter((exam) => {
    return (
      (selectedClass ? exam.class === selectedClass : true) && // Filter by selected class if any
      (selectedExamType ? exam.examType === selectedExamType : true) // Filter by selected exam type if any
    );
  });

  // Function to download exam details as a CSV file
  const downloadExamDetails = () => {
    const headers = ['Date', 'Timing', 'Subject Name', 'Syllabus'];
    const rows = filteredExams.flatMap((exam) =>
      exam.exam.map((subject) => [
        exam.fromDate,
        exam.examDuration,
        subject.subject,
        subject.syllabus,
      ])
    );

    // Create a CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Create a Blob and download it as a CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'exam_details.csv');
      link.click();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">Exams</h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xl">Home</span> {'>'}
              <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Exams</span>
            </h1>
          </div>
          <Header />
        </div>

        {/* Upcoming Exams Section */}
        <div className="mt-8 border border-gray-200 rounded-lg p-10 ml-3 mr-3 shadow-lg">
          <h2 className="text-xl font-medium text-[#146192] mb-4">Upcoming Exams</h2>

          {/* Container for the boxes */}
          <div className="flex space-x-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              filteredExams.slice(0, 3).map((exam, index) => (
                <div
                  key={index}
                  className={`flex-1 p-4 border shadow-lg ${exam.examType === 'Half Yearly' ? 'bg-[#FF9F1C63]' : exam.examType === 'Final Exam' ? 'bg-[#BF156C0D]' : 'bg-[#FF543E4D]'}`}
                >
                  <div className="flex justify-between mb-4">
                    <p className="font-semibold">Exam Type:</p>
                    <p>{exam.examType}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="font-semibold">From Date:</p>
                    <p>{new Date(exam.fromDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="font-semibold">To Date:</p>
                    <p>{new Date(exam.toDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="font-semibold">Class:</p>
                    <p>{exam.class} {exam.section}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dropdown Section (Placed After the 3 Boxes) */}
        <div className="mt-8 flex gap-10 justify-start ml-3">
          {/* Class Dropdown */}
          <div>
            <label htmlFor="class" className="text-lg font-medium text-[#146192]">Class:</label>
            <select
              id="class"
              className="ml-2 p-2 border rounded-md"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              <option value="6">6th</option>
              {/* Add other classes as needed */}
            </select>
          </div>

          {/* Exam Type Dropdown */}
          <div>
            <label htmlFor="examType" className="text-lg font-medium text-[#146192]">Exam Type:</label>
            <select
              id="examType"
              className="ml-2 p-2 border rounded-md"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <option value="">All Exam Types</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Final Exam">Final Exam</option>
            </select>
          </div>
        </div>

        {/* Timetable Section */}
        <div className="mt-8 border border-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-medium text-[#146192] mb-4">Timetable</h2>
          {filteredExams.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Timing</th>
                  <th className="border px-4 py-2">Subject Name</th>
                  <th className="border px-4 py-2">Syllabus</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.flatMap((exam) =>
                  exam.exam.map((subject, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{new Date(subject.date).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{exam.examDuration}</td>
                      <td className="border px-4 py-2">{subject.subject}</td>
                      <td className="border px-4 py-2">{subject.syllabus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <p>No exams found based on your selection.</p>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={downloadExamDetails}
            className="px-6 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0a4e6f]"
          >
            Download Exam Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Exams;
