import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyStudents } from '../../redux/teacher/myStudentsSlice';
import { postTeaAttendance, resetPostStatus } from '../../redux/teacher/teaAttendanceSlice';
import Header from '../adminDashboard/layout/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MarkAttendance() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, error } = useSelector((state) => state.students);
  const { postLoading, postError, postSuccess } = useSelector((state) => state.teaAttendance);

  const parents = data?.parents || [];
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  const students = parents.flatMap((parent) =>
    parent.parentProfile?.parentOf?.map((studentObj) => ({
      studentId: studentObj._id,
      fullname: studentObj.studentProfile?.fullname || 'N/A',
      registrationNumber: studentObj.studentProfile?.registrationNumber || 'N/A',
      gender: studentObj.studentProfile?.gender || 'N/A',
      dob: studentObj.studentProfile?.dob
        ? studentObj.studentProfile.dob.substring(0, 10)
        : 'N/A',
      fatherName: parent.parentProfile?.fatherName || 'N/A',
      fatherPhoneNumber: parent.parentProfile?.fatherPhoneNumber || 'N/A',
    })) || []
  );

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

  useEffect(() => {
    if (postSuccess) {
      toast.success('Attendance marked successfully!');
      dispatch(resetPostStatus());
      setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
    }
  }, [postSuccess, dispatch, navigate]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      toast.error('Please select a date.');
      return;
    }

    const incomplete = students.some(
      (student) => !attendanceData[student.studentId]
    );

    if (incomplete) {
      toast.warning('Please mark attendance for all students');
      return;
    }

    const attendanceList = students.map((student) => ({
      studentId: student.studentId,
      status: attendanceData[student.studentId], // Must match enum: 'Present', 'Absent', 'Holiday'
    }));

    dispatch(postTeaAttendance({ date, attendance: attendanceList }));
  };

  if (loading) return <p className="text-gray-600">Loading students...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Attendance</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Attendance</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="mx-8 md:ml-72 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#146192]">MARK CLASS ATTENDANCE</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="date" className="font-medium">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-3 py-1 rounded"
              required
            />
          </div>
        </div>

        {postError && <p className="text-red-500 mb-2">{postError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Student Name</th>
                  <th className="border px-4 py-2">Reg. Number</th>
                  <th className="border px-4 py-2">Parent Name</th>
                  <th className="border px-4 py-2">Parent Mobile</th>
                  <th className="border px-4 py-2">Gender</th>
                  <th className="border px-4 py-2">DOB</th>
                  <th className="border px-4 py-2">Present</th>
                  <th className="border px-4 py-2">Absent</th>
                  <th className="border px-4 py-2">Holiday</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.studentId} className="text-center">
                      <td className="border px-4 py-2">{student.fullname}</td>
                      <td className="border px-4 py-2">{student.registrationNumber}</td>
                      <td className="border px-4 py-2">{student.fatherName}</td>
                      <td className="border px-4 py-2">{student.fatherPhoneNumber}</td>
                      <td className="border px-4 py-2">{student.gender}</td>
                      <td className="border px-4 py-2">{student.dob}</td>
                      {['Present', 'Absent', 'Holiday'].map((status) => (
                        <td key={status} className="border px-4 py-2">
                          <input
                            type="radio"
                            name={`attendance-${student.studentId}`}
                            value={status}
                            checked={attendanceData[student.studentId] === status}
                            onChange={() => handleStatusChange(student.studentId, status)}
                            required
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center border px-4 py-2">No students available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#146192] text-white px-6 py-2 rounded hover:bg-[#0e4a73]"
              disabled={postLoading}
            >
              {postLoading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MarkAttendance;
