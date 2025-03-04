import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import {fetchStudentResults,selectResults,selectResultsLoading,selectResultsError,clearResults} from '../../redux/parent/results';
import Header from './layout/Header';

function AnnualResults() {
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

  const renderResultSlip = () => {
    if (!results?.result?.[0]) return null;

    const resultData = results.result[0];
    const studentProfile = resultData.studentId.studentProfile;

    return (
      <>
      <div className="overflow-hidden print-section">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <img 
              src="https://amritmahotsav.nic.in/writereaddata/Portal/Images/azadi_ka_amrit_mahotsav_eng.png" 
              alt="Azadi Ka Amrit Mahotsav" 
              className="h-16"
            />
          </div>
          <h3 className="text-center text-xl font-bold">RESULT SLIP</h3>
        </div>

        {/* Student Info */}
        <div className="p-6 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className='flex gap-4' style={{fontFamily:'Roboto'}}>
              <p className="font-light">Name : </p>
              <p className="text-lg">{`${studentProfile.firstName} ${studentProfile.lastName}`}</p>
            </div>
            <div className='flex gap-4' style={{fontFamily:'Roboto'}}>
              <p className="font-light">Class : </p>
              <p className="text-lg">{resultData.class}th</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="space-y-4">
              <div className='flex gap-4' style={{fontFamily:'Roboto'}}>
                <p className="font-light">Roll Number : </p>
                <p className="text-lg">{studentProfile.registrationNumber}</p>
              </div>
              <div className='flex gap-4' style={{fontFamily:'Roboto'}}>
                <p className="font-light">Section : </p>
                <p className="text-lg">{resultData.section.toUpperCase()}</p>
              </div>
            </div>
            {studentProfile.photo && (
              <div className="ml-4">
                <img 
                  src={studentProfile.photo}
                  alt="Student" 
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Marks Table */}
        <div className="p-6">
          <table className="w-full border border-black rounded-lg">
            <thead>
              <tr className="font-medium" style={{fontFamily:'Roboto'}}>
                <th className="p-3 text-left">SNO</th>
                <th className="p-3 text-left">Subject Code</th>
                <th className="p-3 text-left">Course Name</th>
                <th className="p-3 text-center">Marks</th>
                <th className="p-3 text-center">Total Marks</th>
                <th className="p-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {resultData.result.map((subject, index) => (
                <tr key={subject._id} className="border border-black">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{subject.subjectCode}</td>
                  <td className="p-3">{subject.subject}</td>
                  <td className="p-3 text-center">{subject.marks}</td>
                  <td className="p-3 text-center">{subject.outOfMarks}</td>
                  <td className="p-3 text-center">
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
              <tr className="font-semibold">
                <td colSpan="3" className="p-3 text-right">Total:</td>
                <td className="p-3 text-center">{resultData.total}</td>
                <td className="p-3 text-center">
                  {resultData.totalPercentage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </>
    );
  };

  return (
    <>
     <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Annual Result</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[180px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Annual Result</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>
    <div className="px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading results...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8 bg-white rounded-lg shadow-lg">
              {error}
            </div>
          ) : (
            renderResultSlip()
          )}
        </div>

        {/* Search Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Search Results</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <select
                  name="classParam"
                  value={formData.classParam}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-blue-50 border border-blue-100"
                  required
                >
                  <option value="">Select Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-blue-50 border border-blue-100"
                  required
                >
                  <option value="">Select Section</option>
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <option key={section} value={section.toLowerCase()}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-blue-50 border border-blue-100"
                  required
                >
                  <option value="">Select Exam Type</option>
                  <option value="Annual Exam">Annual Exam</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Student Name"
                  className="w-full p-2 rounded-md bg-blue-50 border border-blue-100"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md transition-colors"
              >
                Search Results
              </button>
            </form>
          </div>

          <div className="p-6">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Result Slip
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default AnnualResults;