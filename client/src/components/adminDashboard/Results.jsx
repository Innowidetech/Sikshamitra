import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../../redux/adminResults';
import { Search, FileText, Award, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdmitCardModal = ({ onClose, result, banner }) => {
  const {
    student = {},
    exam = {},
    class: className,
    section,
  } = result;

  const profile = student.studentProfile || {};
  const subjectList = exam.exam || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6 border">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <X size={24} />
        </button>

        {banner && (
          <div className="text-center mb-4">
            <img src={banner} alt="Banner" className="mx-auto w-full max-w-3xl max-h-48 object-contain" />
          </div>
        )}

        <h2 className="text-center text-xl font-bold mb-4 border-b pb-2 uppercase">Admit Card</h2>

        <div className="border p-4 rounded-md mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm space-y-2 leading-relaxed">
              <p><strong>Name:</strong> {profile.fullname || 'N/A'}</p>
              <p><strong>Class:</strong> {className || 'N/A'}</p>
              <p><strong>Exam Type:</strong> {exam.examType || 'N/A'}</p>
            </div>
            <div className="text-sm space-y-2 leading-relaxed">
              <p><strong>Registration Number:</strong> {profile.registrationNumber || 'N/A'}</p>
              <p><strong>Section:</strong> {section || 'N/A'}</p>
              {profile.photo && (
                <img src={profile.photo} alt="Student" className="w-24 h-24 object-cover border rounded-md mt-2" />
              )}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-96 border rounded-md">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-2 py-1">S.N</th>
                <th className="border px-2 py-1">Code</th>
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Timing</th>
                <th className="border px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {subjectList?.length > 0 ? subjectList.map((item, index) => (
                <tr key={item._id}>
                  <td className="border px-2 py-1 text-center">{index + 1}</td>
                  <td className="border px-2 py-1 text-center">{item.subjectCode || 'N/A'}</td>
                  <td className="border px-2 py-1 text-center">{item.subject || 'N/A'}</td>
                  <td className="border px-2 py-1 text-center">{item.duration || 'N/A'}</td>
                  <td className="border px-2 py-1 text-center">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-2">No subjects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ResultSlipModal = ({ onClose, result, banner }) => {
  const profile = result.student?.studentProfile || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg relative p-6 border">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <X size={24} />
        </button>

        {banner && (
          <div className="text-center mb-4">
            <img src={banner} alt="Banner" className="mx-auto w-full max-w-3xl max-h-48 object-contain" />
          </div>
        )}

        <h2 className="text-center text-xl font-bold mb-4 border-b pb-2 uppercase">Result Slip</h2>

        <div className="border p-4 rounded-md mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm space-y-2 leading-relaxed">
              <p><strong>Name:</strong> {profile.fullname || 'N/A'}</p>
              <p><strong>Class:</strong> {result.class || 'N/A'}</p>
              <p><strong>Exam Type:</strong> {result.exam?.examType || 'N/A'}</p>
            </div>
            <div className="text-sm space-y-2 leading-relaxed">
              <p><strong>Registration Number:</strong> {profile.registrationNumber || 'N/A'}</p>
              <p><strong>Section:</strong> {result.section || 'N/A'}</p>
              {profile.photo && (
                <img src={profile.photo} alt="Student" className="w-24 h-24 object-cover border rounded-md mt-2" />
              )}
            </div>
          </div>
        </div>

        {result?.result?.length > 0 && (
          <div className="overflow-y-auto max-h-96 border rounded-md mb-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Subject Code</th>
                  <th className="py-2 px-4 border">Course Name</th>
                  <th className="py-2 px-4 border">Marks Obtained</th>
                  <th className="py-2 px-4 border">Total Marks</th>
                  <th className="py-2 px-4 border">Grade</th>
                </tr>
              </thead>
              <tbody>
                {result?.result?.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border">{item.subjectCode}</td>
                    <td className="py-2 px-4 border">{item.subject}</td>
                    <td className="py-2 px-4 border">{item.marksObtained}</td>
                    <td className="py-2 px-4 border">{item.totalMarks}</td>
                    <td className="py-2 px-4 border">{item.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        <div className="text-sm mt-2 space-y-1">
          <p><strong>Total Marks:</strong> {result.total || 'N/A'}</p>
          <p><strong>Percentage:</strong> {result.totalPercentage || 'N/A'}%</p>
          
        </div>
      </div>
    </div>
  );
};

function Results() {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.adminResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [resultSlipData, setResultSlipData] = useState(null);
  const [bannerUrl, setBannerUrl] = useState('');

  useEffect(() => {
    dispatch(fetchResults());
  }, [dispatch]);

  useEffect(() => {
    if (results?.banner) {
      setBannerUrl(results.banner);
    }
  }, [results]);

  useEffect(() => {
    if (error === 'Unauthorized access') {
      toast.error('Authentication required. Please log in again.');
    } else if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredResults = results?.result?.filter((r) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      r.student?.studentProfile?.registrationNumber?.toLowerCase().includes(search) ||
      r.student?.studentProfile?.fullname?.toLowerCase().includes(search) ||
      r.class?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mx-8 py-10">
        <div>
          <h1 className="text-xl font-light text-black xl:text-[30px]">Results</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2 text-xs xl:text-[17px] md:text-lg">
            Home {'>'} <span className="font-medium text-[#146192]">Results</span>
          </h1>
        </div>
      </div>

      <div className="mx-4 md:mx-8 mb-6">
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Registration Number, Name, or Class"
            className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-[#146192]"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="mx-8 mb-6 hidden lg:block">
        <div className="bg-white rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : (
            <table className="min-w-full divide-y border-2">
              <thead>
                <tr>
                  {['Sno', 'Student Name', 'Registration Number', 'Class', 'Section', 'Student Gender', 'Exam Type', 'Total Marks', 'Percentage', 'Admit Card', 'Result Slip'].map((head, i) => (
                    <th key={i} className="px-2 py-2 border-r text-center">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredResults?.map((result, i) => (
                  <tr key={result._id}>
                    <td className="px-2 py-2 border-r text-center">{i + 1}</td>
                    <td className="px-2 py-2 border-r">{result.student.studentProfile.fullname}</td>
                    <td className="px-2 py-2 border-r">{result.student.studentProfile.registrationNumber}</td>
                    <td className="px-2 py-2 border-r">{result.class}</td>
                    <td className="px-2 py-2 border-r">{result.section}</td>
                    <td className="px-2 py-2 border-r">{result.student.studentProfile.gender}</td>
                    <td className="px-2 py-2 border-r">{result.exam.examType}</td>
                    <td className="px-2 py-2 border-r">{result.total}</td>
                    <td className="px-2 py-2 border-r">{result.totalPercentage}</td>
                    <td className="px-2 py-2 border-r text-center">
                      <FileText className="text-[#146192] cursor-pointer" onClick={() => setSelectedResult(result)} />
                    </td>
                    <td className="px-2 py-2 border-r text-center">
                      <Award className="text-[#146192] cursor-pointer" onClick={() => setResultSlipData(result)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="mx-4 mb-6 lg:hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            {filteredResults?.map((result) => (
              <div key={result._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ['Student Name', result.student.studentProfile.fullname],
                    ['Registration Number', result.student.studentProfile.registrationNumber],
                    ['Class', result.class],
                    ['Section', result.section],
                    ['Gender', result.student.studentProfile.gender],
                    ['Exam Type', result.exam.examType],
                    ['Total Marks', result.total],
                    ['Percentage', result.totalPercentage],
                  ].map(([label, value], i) => (
                    <React.Fragment key={i}>
                      <div className="text-[#146192] font-medium">{label}</div>
                      <div>{value}</div>
                    </React.Fragment>
                  ))}
                  <div className="text-[#146192] font-medium">Admit Card</div>
                  <div><FileText className="text-[#146192] cursor-pointer" onClick={() => setSelectedResult(result)} /></div>
                  <div className="text-[#146192] font-medium">Result Slip</div>
                  <div><Award className="text-[#146192] cursor-pointer" onClick={() => setResultSlipData(result)} /></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedResult && <AdmitCardModal result={selectedResult} onClose={() => setSelectedResult(null)} banner={bannerUrl} />}
      {resultSlipData && <ResultSlipModal result={resultSlipData} onClose={() => setResultSlipData(null)} banner={bannerUrl} />}
    </>
  );
}

export default Results;
