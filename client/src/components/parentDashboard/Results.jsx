import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildren, fetchStudentResults, selectChildren, selectResults, selectResultsLoading, selectResultsError, clearResults } from "../../redux/parent/results";
import Header from "./layout/Header";
import logo from "../../assets/img.png";
import avatar from "../../assets/avtar.jpg";

function Results() {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [resultId, setResultId] = useState("");  // For optional resultId

  const dispatch = useDispatch();

  // Get children (students) and results from Redux store
  const children = useSelector(selectChildren);
  const results = useSelector(selectResults);
  const loading = useSelector(selectResultsLoading);
  const error = useSelector(selectResultsError);

  useEffect(() => {
    dispatch(fetchChildren()); // Fetch children when component mounts
  }, [dispatch]);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
  };

  const handleFetchResults = () => {
    if (selectedStudentId) {
      dispatch(fetchStudentResults({ studentId: selectedStudentId, resultId }));
    }
  };

  const handleClearResults = () => {
    dispatch(clearResults());
  };

  return (
    <div>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Student dropdown section */}
      <div className="flex justify-start items-center mx-8 my-4">
        <div className="w-2/3 flex items-center">
          <label htmlFor="student-dropdown" className="text-lg font-semibold text-[#121313]" style={{ fontFamily: "Poppins" }}>
            Student:
          </label>
          <select
            id="student-dropdown"
            value={selectedStudentId || ''}
            onChange={handleStudentChange}
            className="ml-4 px-4 py-2 rounded-lg w-36 bg-[#D8E7F5]"
          >
            <option value="">Select a student</option>
            {children.map((student) => (
              <option key={student._id} value={student._id}>
                {student.studentProfile.fullname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fetch and Display Results */}
      <div className="flex justify-center items-center mt-8">
        <div className="w-[90%] p-6 rounded-3xl shadow-2xl h-[830px]">
          <h2 className="text-xl font-medium text-start mb-6">Exam Result Card</h2>

          {/* Table with Marks */}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="p-4 rounded-xl shadow-md w-[90%] h-[470px] mt-12 mr-2 border-2 border-black ml-10">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-6">Subject Code</th>
                    <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-6">Course Name</th>
                    <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-6">Marks Obtained</th>
                    <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-6">Total Marks</th>
                    <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-6">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.theory?.map((result, index) => (
                    <tr key={index}>
                      <td className="text-center border-b-2 border-r-2 py-2">{result.subjectCode}</td>
                      <td className="text-center border-b-2 border-r-2 py-2">{result.courseName}</td>
                      <td className="text-center border-b-2 border-r-2 py-2">{result.marksObtained}</td>
                      <td className="text-center border-b-2 border-r-2 py-2">{result.totalMarks}</td>
                      <td className="text-center border-b-2 border-r-2 py-2">{result.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;
