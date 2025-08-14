import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplicantResults,
  submitSelectedResults,
} from '../../redux/adminEntranceSlice';
import { toast } from 'react-toastify';
import { FileText, FileSpreadsheet } from 'lucide-react';

const ApplicantDetails = () => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    applicantResults,
    loading,
    error,
    submitResultStatus,
  } = useSelector((state) => state.adminEntrance);

  // Fetch results on mount
  useEffect(() => {
    dispatch(fetchApplicantResults());
  }, [dispatch]);

  // Handle toast notifications
  useEffect(() => {
    if (submitResultStatus === 'success') {
      toast.success('Results submitted successfully');
      setSelectedIds([]);
    } else if (submitResultStatus === 'failed') {
      toast.error('Failed to submit results');
    }
  }, [submitResultStatus]);

  // Toggle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit selected results
  const handleSubmit = () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one applicant result');
      return;
    }

    // ✅ Changed from applicantResultIds to resultIds
    dispatch(submitSelectedResults({ resultIds: selectedIds }));
  };

  return (
    <div className="p-6">
      {/* Top Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <button className="flex items-center gap-2 border border-[#1E3A8A] text-[#1E3A8A] px-4 py-2 rounded-md text-sm">
          <FileText className="w-4 h-4" />
          Question Paper
        </button>
        <button className="flex items-center gap-2 border border-[#1E3A8A] text-[#1E3A8A] px-4 py-2 rounded-md text-sm">
          <FileSpreadsheet className="w-4 h-4" />
          Applicant Exam Results
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading applicant results...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-[#1E3A8A] text-white text-left">
                <th className="py-2 px-4">Select</th>
                <th className="py-2 px-4">Student Name</th>
                <th className="py-2 px-4">Date of Birth</th>
                <th className="py-2 px-4">Gender</th>
                <th className="py-2 px-4">Class</th>
                <th className="py-2 px-4">Percentage</th>
                <th className="py-2 px-4">Contact</th>
                <th className="py-2 px-4">E-mail</th>
              </tr>
            </thead>
            <tbody>
              {applicantResults
                ?.filter((res) => res.applicantId)
                .map((result) => {
                  const student = result.applicantId.studentDetails || {};
                  return (
                    <tr
                      key={result._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          className="accent-green-600"
                          checked={selectedIds.includes(result._id)}
                          onChange={() => handleCheckboxChange(result._id)}
                        />
                      </td>
                      <td className="py-2 px-4">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-2 px-4">
                        {student.dob
                          ? new Date(student.dob).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="py-2 px-4">{student.gender || '-'}</td>
                      <td className="py-2 px-4">
                        {result.applicantId.classApplying || '-'}
                      </td>
                      <td className="py-2 px-4">
                        {result.resultPercentage || '-'}
                      </td>
                      <td className="py-2 px-4">{student.phoneNumber || '-'}</td>
                      <td className="py-2 px-4">{student.email || '-'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination + Submit */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
        {/* Dummy Pagination */}
        <div className="flex items-center gap-2">
          <button className="text-[#1E3A8A] px-2">&lt;</button>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`w-8 h-8 rounded-full text-sm ${
                num === 1
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#1E3A8A] hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
          <button className="text-[#1E3A8A] px-2">&gt;</button>
        </div>

        {/* Send Result Button */}
        <button
          onClick={handleSubmit}
          className="bg-[#1E3A8A] text-white px-6 py-2 rounded-md text-sm"
        >
          Send Result
        </button>
      </div>
    </div>
  );
};

export default ApplicantDetails;
