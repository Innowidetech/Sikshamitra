import React, { useState, useEffect } from 'react';
import Header from '../adminDashboard/layout/Header';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeacherResults } from '../../redux/teacher/teacherResultSlice';
import { useNavigate } from 'react-router-dom';

function Results({ handleTabChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { results, loading, error } = useSelector((state) => state.teacherResults);

  const [expandedRow, setExpandedRow] = useState(null);
  const [examTypeFilter, setExamTypeFilter] = useState('All');

  const [newResultData, setNewResultData] = useState({
    studentId: '',
    examType: '',
    marks: '',
    subjectResults: [],
  });

  useEffect(() => {
    dispatch(fetchTeacherResults());
  }, [dispatch]);

  const examTypes = ['All', ...new Set(results.map((res) => res.exam?.examType))];

  const filteredResults =
    examTypeFilter === 'All'
      ? results
      : results.filter((res) => res.exam?.examType === examTypeFilter);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleAddResult = async (event) => {
    event.preventDefault();

    if (!newResultData.studentId || !newResultData.examType || !newResultData.subjectResults.length) {
      alert('Please provide all the required fields!');
      return;
    }

    try {
      const response = await fetch('/api/teacher/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResultData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit result');
      }

      dispatch(fetchTeacherResults());
      alert('Result added successfully');
      setNewResultData({ studentId: '', examType: '', marks: '', subjectResults: [] });
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('Error submitting result. Please try again later.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex flex-col items-end mx-8 mt-6 md:ml-72">
        <button
          className="bg-[#146192] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#0e4a73] transition duration-300 mb-4"
          onClick={() => handleTabChange('addstudentresult')}
        >
          ADD STUDENT RESULT
        </button>

        <div className="mb-4">
          <label htmlFor="examType" className="mr-2 font-medium text-gray-700">
            Exam Type:
          </label>
          <select
            id="examType"
            value={examTypeFilter}
            onChange={(e) => setExamTypeFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            {examTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Table Layout */}
        <div className="w-full hidden lg:block overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-[#1982C424] text-[#146192]">
              <tr>
                <th className="py-2 px-4 border">Student ID</th>
                <th className="py-2 px-4 border">Student Name</th>
                <th className="py-2 px-4 border">Exam Type</th>
                <th className="py-2 px-4 border">Marks</th>
                <th className="py-2 px-4 border">Percentage</th>
                <th className="py-2 px-4 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className="text-center text-red-500 py-4">{error}</td></tr>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((result, i) => (
                  <React.Fragment key={i}>
                    <tr className="text-center hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 border">{result.student.studentProfile.registrationNumber}</td>
                      <td className="py-2 px-4 border">{result.student.studentProfile.fullname}</td>
                      <td className="py-2 px-4 border">{result.exam?.examType || 'N/A'}</td>
                      <td className="py-2 px-4 border">{result.total}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex items-center justify-center gap-2">
                          {result.totalPercentage}
                          <button onClick={() => toggleRow(i)}>
                            {expandedRow === i ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-4 border">
                        <button
                          className="text-[#000000] hover:text-blue-800"
                          onClick={() => handleTabChange('editresult', result)}
                          aria-label={`Edit result for ${result.student.studentProfile.fullname}`}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>

                    {expandedRow === i && (
                      <tr>
                        <td colSpan="6" className="p-4 bg-gray-100">
                          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto text-sm">
                            <h2 className="text-lg font-semibold mb-4 text-center">RESULT SLIP</h2>
                            <div className="flex justify-between mb-2">
                              <div>
                                <p><strong>Name:</strong> {result.student.studentProfile.fullname}</p>
                                <p><strong>Class:</strong> {result.class}</p>
                              </div>
                              <div>
                                <p><strong>Roll:</strong> {result.student.studentProfile.rollNumber || 'N/A'}</p>
                                <p><strong>Section:</strong> {result.section}</p>
                              </div>
                            </div>
                            <table className="w-full border border-gray-300 mt-2 text-center">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="border px-2 py-1">Subject</th>
                                  <th className="border px-2 py-1">Obtained Marks</th>
                                  <th className="border px-2 py-1">Total Marks</th>
                                  <th className="border px-2 py-1">Grade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.result.map((subject, idx) => (
                                  <tr key={idx}>
                                    <td className="border px-2 py-1">{subject.subject}</td>
                                    <td className="border px-2 py-1">{subject.marksObtained}</td>
                                    <td className="border px-2 py-1">{subject.totalMarks}</td>
                                    <td className="border px-2 py-1">{subject.grade}</td>
                                  </tr>
                                ))}
                                <tr className="font-semibold bg-gray-100">
                                  <td className="border px-2 py-1" colSpan="2">Total Marks</td>
                                  <td className="border px-2 py-1">{result.total}</td>
                                  <td className="border px-2 py-1">-</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card Layout */}
        <div className="lg:hidden w-full space-y-4">
          {filteredResults.map((result, i) => (
            <div key={i} className="border border-gray-300 rounded-lg shadow-md p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>ID:</strong> {result.student.studentProfile.registrationNumber}</p>
                  <p><strong>Name:</strong> {result.student.studentProfile.fullname}</p>
                  <p><strong>Exam:</strong> {result.exam?.examType || 'N/A'}</p>
                  <p><strong>Total Marks:</strong> {result.total}</p>
                  <p className="flex items-center gap-2">
                    <strong>Percentage:</strong> {result.totalPercentage}
                    <button onClick={() => toggleRow(i)}>{expandedRow === i ? <FaChevronUp /> : <FaChevronDown />}</button>
                  </p>
                </div>
                <button
                  className="text-[#000000] hover:text-blue-800"
                  onClick={() => handleTabChange('editresult', result)}
                  aria-label={`Edit result for ${result.student.studentProfile.fullname}`}
                >
                  <FaEdit />
                </button>
              </div>

              {expandedRow === i && (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <h2 className="text-center font-semibold mb-2">Result Slip</h2>
                  <p><strong>Roll:</strong> {result.student.studentProfile.rollNumber || 'N/A'}</p>
                  <p><strong>Class:</strong> {result.class}</p>
                  <p><strong>Section:</strong> {result.section}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm mt-2 border border-gray-300 text-center">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border px-2 py-1">Subject</th>
                          <th className="border px-2 py-1">Obtained</th>
                          <th className="border px-2 py-1">Total</th>
                          <th className="border px-2 py-1">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.result.map((subject, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">{subject.subject}</td>
                            <td className="border px-2 py-1">{subject.marksObtained}</td>
                            <td className="border px-2 py-1">{subject.totalMarks}</td>
                            <td className="border px-2 py-1">{subject.grade}</td>
                          </tr>
                        ))}
                        <tr className="font-semibold bg-gray-100">
                          <td className="border px-2 py-1" colSpan="2">Total</td>
                          <td className="border px-2 py-1">{result.total}</td>
                          <td className="border px-2 py-1">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Results;
