import React from 'react';
import { X } from 'lucide-react';

const AdmitCardModal = ({ onClose, result }) => {
  const { student, exam, result: resultList, totalPercentage } = result;
  const profile = student?.studentProfile;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">
        <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Exam Result Card</h2>
          <p className="text-sm text-gray-600">{exam.examType}</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p><strong>Name:</strong> {profile.fullname}</p>
            <p><strong>Class:</strong> {result.class}</p>
            <p><strong>Section:</strong> {result.section}</p>
            <p><strong>Exam Type:</strong> {exam.examType}</p>
          </div>
          <div>
            <p><strong>Registration No:</strong> {profile.registrationNumber}</p>
            <img src={profile.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border" />
          </div>
        </div>

        <table className="w-full border mt-4 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Subject Code</th>
              <th className="border px-2 py-1">Course Name</th>
              <th className="border px-2 py-1">Marks Obtained</th>
              <th className="border px-2 py-1">Total Marks</th>
              <th className="border px-2 py-1">Grade</th>
            </tr>
          </thead>
          <tbody>
            {resultList.map((subj) => (
              <tr key={subj._id}>
                <td className="border px-2 py-1">{subj.subjectCode}</td>
                <td className="border px-2 py-1">{subj.subject}</td>
                <td className="border px-2 py-1">{subj.marksObtained}</td>
                <td className="border px-2 py-1">{subj.totalMarks}</td>
                <td className="border px-2 py-1">{subj.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 font-semibold">
          Total Percentage: <span className="text-green-600">{totalPercentage}</span>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardModal;
