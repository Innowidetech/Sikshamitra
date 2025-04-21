import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, clearExams } from '../../redux/parent/examSlice';
import Header from './layout/Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Exams() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');

  const dispatch = useDispatch();
  const { examList, loading, error } = useSelector((state) => state.exams);

  useEffect(() => {
    dispatch(fetchExams());
    return () => {
      dispatch(clearExams());
    };
  }, [dispatch]);

  const uniqueExamTypes = [...new Set(examList.map(exam => exam.examType))];

  const filteredExams = examList.filter((exam) => {
    const classMatch = selectedClass ? exam.class === selectedClass : true;
    const examTypeMatch = selectedExamType ? exam.examType === selectedExamType : true;
    return classMatch && examTypeMatch;
  });

  const downloadExamDetails = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Exam Timetable", 14, 22);

    const tableColumn = ["Date", "Timing", "Subject Name", "Syllabus"];
    const tableRows = [];

    filteredExams.forEach((exam) => {
      exam.exam.forEach((subject) => {
        const rowData = [
          new Date(subject.date).toLocaleDateString(),
          exam.examDuration,
          subject.subject,
          subject.syllabus,
        ];
        tableRows.push(rowData);
      });
    });

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
    });

    doc.save("exam_timetable.pdf");
  };

  return (
    <div className="min-h-screen mt-20 md:ml-64">
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

        <div className="mt-8 border border-gray-200 rounded-lg p-10  mr-3 shadow-lg">
          <h2 className="text-xl font-medium text-[#146192] mb-4">Upcoming Exams</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              filteredExams.slice(0, 3).map((exam) => (
                <div
                  key={exam._id}
                  className={`flex-1 p-4 border shadow-lg rounded-lg ${
                    exam.examType.includes('Half Yearly') ? 'bg-[#FF9F1C63]' :
                    exam.examType.includes('Unit Test') ? 'bg-[#FF543E4D]' :
                    'bg-[#BF156C0D]'
                  }`}
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

        <div className="mt-8 flex flex-col sm:flex-row gap-6 ml-3">
          <div>
            <label htmlFor="class" className="text-lg font-medium text-[#146192]">Class - </label>
            <select
              id="class"
              className="ml-2 p-2 border rounded-md"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              <option value="6">6th</option>
              <option value="10">10th</option>
            </select>
          </div>

          <div>
            <label htmlFor="examType" className="text-lg font-medium text-[#146192]">Exam Type - </label>
            <select
              id="examType"
              className="ml-2 p-2 border rounded-md"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <option value="">All Exam Types</option>
              {uniqueExamTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 border border-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-medium text-[#146192] mb-4">Timetable</h2>
          {filteredExams.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
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
                        <tr key={`${exam._id}-${index}`}>
                          <td className="border px-4 py-2">{new Date(subject.date).toLocaleDateString()}</td>
                          <td className="border px-4 py-2">{exam.examDuration}</td>
                          <td className="border px-4 py-2">{subject.subject}</td>
                          <td className="border px-4 py-2">{subject.syllabus}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredExams.flatMap((exam, examIndex) =>
                  exam.exam.map((subject, index) => (
                    <div
                      key={`${exam._id}-${index}`}
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-bold uppercase">Date</span>
                        <span>{new Date(subject.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-bold uppercase">Subject Name</span>
                        <span>{subject.subject}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-bold uppercase">Timings</span>
                        <span>{exam.examDuration}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-bold uppercase">Syllabus</span>
                        <span>{subject.syllabus}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <p>No exams found based on your selection.</p>
          )}
        </div>

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

