import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentResults, selectResults, selectResultsLoading, selectResultsError, clearResults } from '../../redux/parent/results';
import Header from './layout/Header';

function Results() {
  const dispatch = useDispatch();
  const results = useSelector(selectResults);
  const loading = useSelector(selectResultsLoading);
  const error = useSelector(selectResultsError);

  const [formData, setFormData] = useState({
    classParam: '',
    section: '',
    examType: '',
    studentName: localStorage.getItem('studentName') || ''
  });

  useEffect(() => {
    return () => {
      dispatch(clearResults());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchStudentResults(formData));
  };

  const renderResultTable = () => {
    if (!results?.result?.[0]?.result) return null;

    const resultData = results.result[0];
    const examDetails = {
      class: resultData.class,
      section: resultData.section.toUpperCase(),
      examType: resultData.examType,
      total: resultData.total,
      percentage: resultData.totalPercentage
    };


    console.log(results)

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-2">Exam Report Card</h2>
          <div className="grid grid-cols-2 gap-4 text-sm justify-around">
            <div>
              <p><span className="font-medium">Student Name:</span> {examDetails.class}</p>
              <p><span className="font-medium">Class:</span> {examDetails.class}</p>
              <p><span className="font-medium">Section:</span> {examDetails.section}</p>
            </div>
            <div className='grid justify-end'>
              <p><span className="font-medium">Exam Type:</span> {examDetails.examType}</p>
              <p><span className="font-medium">Date:</span> {new Date(resultData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b px-6 py-4 text-left text-sm font-semibold">S.No</th>
                <th className="border-b px-6 py-4 text-left text-sm font-semibold">Subject Code</th>
                <th className="border-b px-6 py-4 text-left text-sm font-semibold">Subject</th>
                <th className="border-b px-6 py-4 text-left text-sm font-semibold">Marks Obtained</th>
                <th className="border-b px-6 py-4 text-left text-sm font-semibold">Total Marks</th>
                <th className="border-b px-6 py-4 text-left text-sm font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {resultData.result.map((subject, index) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="border-b px-6 py-4 text-sm">{index + 1}</td>
                  <td className="border-b px-6 py-4 text-sm">{subject.subjectCode}</td>
                  <td className="border-b px-6 py-4 text-sm">{subject.subject}</td>
                  <td className="border-b px-6 py-4 text-sm">{subject.marks}</td>
                  <td className="border-b px-6 py-4 text-sm">{subject.outOfMarks}</td>
                  <td className="border-b px-6 py-4 text-sm font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subject.grade === 'A' ? 'bg-green-100 text-green-800' :
                      subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subject.grade}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td colSpan={3} className="border-b px-6 py-4 text-sm text-right">
                  Total :
                </td>
                <td  className="border-b px-6 py-4 text-sm">
                  {examDetails.total} 
                </td>
                <td  className="border-b px-6 py-4 text-sm text-right">
                  Percentage :
                </td>
                <td  className="border-b px-6 py-4 text-sm">
                ({examDetails.percentage})
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <div className="flex justify-end space-x-4">
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2.5 rounded-md text-sm transition-colors"
            onClick={() => window.print()}
          >
            Print Report Card
          </button>
        </div> */}
      </div>
    );
  };

  return (
    <>
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

      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Exam Result</h1>
          
          <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600 text-sm sm:text-base font-medium">Student Name:</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                  className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 w-full text-sm sm:text-base"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-600 text-sm sm:text-base font-medium">Class:</label>
                <select
                  name="classParam"
                  value={formData.classParam}
                  onChange={handleInputChange}
                  className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 w-full text-sm sm:text-base"
                  required
                >
                  <option value="">Select</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-600 text-sm sm:text-base font-medium">Section:</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 w-full text-sm sm:text-base"
                  required
                >
                  <option value="">Select</option>
                  {['A', 'B', 'C', 'D'].map(section => (
                    <option key={section} value={section.toLowerCase()}>{section}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600 text-sm sm:text-base font-medium">Exam type:</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 w-full text-sm sm:text-base"
                  required
                >
                  <option value="">Select</option>
                  <option value="Unit Tests">Unit Tests</option>
                  <option value="Annual Exam">Annual Exam</option>
                  <option value="Half Yearly">Half Yearly</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base h-[42px] transition-colors"
                  disabled={loading}
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="text-red-500 mb-6 p-4 bg-red-50 rounded-md text-sm sm:text-base text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading results...</p>
            </div>
          ) : (
            renderResultTable()
          )}
        </div>
      </div>
    </>
  );
}

export default Results;