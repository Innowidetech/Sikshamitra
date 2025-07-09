import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLectureTimetable } from '../../redux/teacher/lectureSlice';
import Header from '../adminDashboard/layout/Header';
export default function ScheduledLec() {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.lecture.loading);
  const error = useSelector((state) => state.lecture.error);
  const data = useSelector((state) => state.lecture.data);

  useEffect(() => {
    dispatch(fetchLectureTimetable());
  }, [dispatch]);

  const lectures = data?.onlineLectures || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading lectures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
<>
    <div className="flex justify-between items-center mx-8 md:ml-72 mt-20">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Lectures</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Online Scheduled Lectures</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>
    <div className="max-w-6xl mx-auto p-4 md:ml-72 mt-10">
      <h1 className="text-lg font-semibold mb-4">Scheduled Online Lectures</h1>

      {lectures.length === 0 ? (
        <p className="text-gray-600">No lectures scheduled.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Title/Topic</th>
                <th className="border px-4 py-2">Class</th>
                <th className="border px-4 py-2">Section</th>
                <th className="border px-4 py-2">Teacher Name</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Lectures Link</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture) => (
                <tr key={lecture._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {new Date(lecture.startDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{lecture.subject}</td>
                  <td className="border px-4 py-2">{lecture.topic}</td>
                  <td className="border px-4 py-2">{lecture.class}</td>
                  <td className="border px-4 py-2">{lecture.section}</td>
                  <td className="border px-4 py-2">{lecture.teacherName}</td>
                  <td className="border px-4 py-2">{lecture.startTime}</td>
                  <td className="border px-4 py-2">
                    <a
                      href={lecture.lectureLink.replace('meetinglink:', 'https://')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {lecture.lectureLink.replace('meetinglink:', '').replace('https://', '')}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
