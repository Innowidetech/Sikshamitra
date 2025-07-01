import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, clearExams } from '../../redux/parent/examSlice';
import Header from './layout/Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Exams() {
  const [selectedExamId, setSelectedExamId] = useState(null);

  const dispatch = useDispatch();
  const { examList, loading, error } = useSelector((state) => state.exams);

  useEffect(() => {
    dispatch(fetchExams());
    return () => {
      dispatch(clearExams());
    };
  }, [dispatch]);

  // Set first exam as default selected
  useEffect(() => {
    if (examList.length > 0 && !selectedExamId) {
      setSelectedExamId(examList[0]._id);
    }
  }, [examList, selectedExamId]);

  const selectedExam = examList.find((exam) => exam._id === selectedExamId);

  const downloadExamDetails = () => {
    if (!selectedExam) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Exam Timetable", 14, 22);

    const tableColumn = ["Date", "Timing", "Subject Name", "Syllabus"];
    const tableRows = [];

    selectedExam.exam.forEach((subject) => {
      const rowData = [
        new Date(subject.date).toLocaleDateString(),
        subject.duration,
        subject.subject,
        subject.syllabus,
      ];
      tableRows.push(rowData);
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

        {/* Upcoming Exams */}
        <div className="mt-8 border border-gray-200 rounded-lg p-10 mr-3 shadow-lg">
          <h2 className="text-xl font-medium text-[#146192] mb-4">Upcoming Exams</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              examList.slice(0, 3).map((exam) => (
                <div
                  key={exam._id}
                  onClick={() => setSelectedExamId(exam._id)}
                  className={`cursor-pointer flex-1 p-4 border shadow-lg rounded-lg transition-transform hover:scale-105 ${
                    selectedExamId === exam._id ? 'ring-2 ring-[#146192]' : ''
                  } ${
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

        {/* Timetable */}
        <div className="mt-8 border border-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-medium text-[#146192] mb-4">Timetable</h2>
          {selectedExam ? (
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
                    {selectedExam.exam.map((subject, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{new Date(subject.date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{subject.duration}</td>
                        <td className="border px-4 py-2">{subject.subject}</td>
                        <td className="border px-4 py-2">{subject.syllabus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {selectedExam.exam.map((subject, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm">
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
                      <span>{subject.duration}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold uppercase">Syllabus</span>
                      <span>{subject.syllabus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Please select an exam to view its timetable.</p>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={downloadExamDetails}
            disabled={!selectedExam}
            className="px-6 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0a4e6f] disabled:opacity-50"
          >
            Download Exam Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Exams;
