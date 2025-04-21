import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChildren,
  fetchStudentResults,
  selectChildren,
  selectResults,
  selectResultsLoading,
  selectResultsError,
  clearResults,
} from "../../redux/parent/results";
import Header from "./layout/Header";
import schoolLogo from '../../../src/assets/img.png';

function Results() {
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [examTypes, setExamTypes] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const dispatch = useDispatch();
  const children = useSelector(selectChildren);
  const results = useSelector(selectResults);
  const loading = useSelector(selectResultsLoading);
  const error = useSelector(selectResultsError);

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  useEffect(() => {
    if (children.length > 0) {
      const firstStudent = children[0].studentProfile?.fullname;
      setSelectedStudentName(firstStudent);
    }
  }, [children]);

  useEffect(() => {
    if (selectedStudentName) {
      dispatch(fetchStudentResults({ studentName: selectedStudentName }))
        .then((action) => {
          if (action.payload?.result) {
            const uniqueExamTypes = [...new Set(
              action.payload.result.map(item => item.exam.examType)
            )];
            setExamTypes(uniqueExamTypes);
            setFilteredResults(action.payload.result);
          }
        });
    } else {
      dispatch(clearResults());
      setExamTypes([]);
      setFilteredResults([]);
    }
  }, [selectedStudentName, dispatch]);

  useEffect(() => {
    if (results?.result) {
      if (selectedExamType) {
        const filtered = results.result.filter(
          item => item.exam.examType === selectedExamType
        );
        setFilteredResults(filtered);
      } else {
        setFilteredResults(results.result);
      }
    }
  }, [selectedExamType, results]);

  const handleStudentChange = (e) => {
    setSelectedStudentName(e.target.value);
    setSelectedExamType("");
  };

  const handleExamTypeChange = (e) => {
    setSelectedExamType(e.target.value);
  };

  return (

<>
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mx-4 lg:mx-10  gap-4 mt-20 ">
    <div className="md:ml-64">
      <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
      <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
      <h1 className="mt-2">
        <span className="xl:text-[17px] text-xl">Home</span> {">"}
        <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Results</span>
      </h1>
    </div>
    <div>
      <Header />
    </div>
  </div>
    <div className=" min-h-screen p-4 sm:p-6 md:p-8 mt-20 md:ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="text-lg font-semibold whitespace-nowrap">Select Student:</label>
              <select
                value={selectedStudentName}
                onChange={handleStudentChange}
                className="px-4 py-2 rounded-md border border-[#146192] text-[#146192] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                {children.map((student) => (
                  <option key={student._id} value={student.studentProfile?.fullname}>
                    {student.studentProfile?.fullname || "Unknown"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <label className="text-lg font-semibold whitespace-nowrap">Exam Type:</label>
            <select
              value={selectedExamType}
              onChange={handleExamTypeChange}
              className="px-4 py-2 rounded-md border border-[#146192] text-[#146192] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="">-- All Results --</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="text-center text-blue-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && filteredResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            {filteredResults.map((resultItem, index) => (
              <div key={index} className="mb-8 border border-neutral-400 p-4 sm:p-6 rounded-lg">
                <div className="text-center mb-8">
                  <img
                    src={results.banner}
                    alt="Institute Logo"
                    className="h-36 mx-auto w-full object-contain mb-4"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div className="space-y-2 w-full">
                    <p className="text-lg"><strong>Name:</strong> {resultItem.student.studentProfile.fullname}</p>
                    <p className="text-lg"><strong>Class:</strong> {resultItem.class}</p>
                    <p className="text-lg"><strong>Section:</strong> {resultItem.section}</p>
                    <p className="text-lg"><strong>Exam Type:</strong> {resultItem.exam.examType}</p>
                  </div>
                  <img
                    src={resultItem.student.studentProfile.photo}
                    alt="Student"
                    className="w-32 h-40 object-cover border-2 border-gray-300"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left">Subject Code</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Course Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Obtained Marks</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Total Marks</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultItem.result.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3">{item.subjectCode}</td>
                          <td className="border border-gray-300 px-4 py-3">{item.subject}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">{item.marksObtained}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">{item.totalMarks}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">{item.grade}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan="2" className="border border-gray-300 px-4 py-3 text-right">Total Marks:</td>
                        <td colSpan="3" className="border border-gray-300 px-4 py-3">{resultItem.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {!filteredResults.length && !loading && (
          <p className="text-center text-gray-500 mt-8">
            {selectedStudentName
              ? selectedExamType
                ? "No results found for the selected exam type."
                : "No results found for the selected student."
              : "Please select a student to view results."}
          </p>
        )}
      </div>
    </div>
    </>
  );
}

export default Results;
