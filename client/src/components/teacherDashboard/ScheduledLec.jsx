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
      {/* Header */}
      <Header />

      {/* Page Heading */}
      <div className="flex justify-between items-center mx-4 md:ml-72 mt-20">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Lectures</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h2 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">
              Online Scheduled Lectures
            </span>
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:ml-72 mt-10">
        <h1 className="text-lg font-semibold mb-4">Scheduled Online Lectures</h1>

        {lectures.length === 0 ? (
          <p className="text-gray-600">No lectures scheduled.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-gray-300 rounded-lg">
              <table className="min-w-full border-collapse text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Subject</th>
                    <th className="border px-4 py-2">Title/Topic</th>
                    <th className="border px-4 py-2">Class</th>
                    <th className="border px-4 py-2">Section</th>
                    <th className="border px-4 py-2">Teacher Name</th>
                    <th className="border px-4 py-2">Time</th>
                    <th className="border px-4 py-2">Lecture Link</th>
                  </tr>
                </thead>
                <tbody>
                  {lectures.map((lecture) => {
                    const meetingLink = lecture.meetingLink;
                    const formattedHref = meetingLink ? encodeURI(meetingLink) : null;
                    const displayText = meetingLink
                      ? meetingLink.replace('https://', '')
                      : '';

                    return (
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
                        <td className="border px-4 py-2 break-all">
                          {formattedHref ? (
                            <a
                              href={formattedHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {displayText}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No link</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-6">
              {lectures.map((lecture) => {
                const meetingLink = lecture.meetingLink;
                const formattedHref = meetingLink ? encodeURI(meetingLink) : null;
                const displayText = meetingLink
                  ? meetingLink.replace('https://', '')
                  : '';

                return (
                  <div
                    key={lecture._id}
                    className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
                  >
                    <div className="mb-2">
                      <span className="font-semibold">Date: </span>
                      {new Date(lecture.startDate).toLocaleDateString()}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Subject: </span>
                      {lecture.subject}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Title/Topic: </span>
                      {lecture.topic}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Class: </span>
                      {lecture.class}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Section: </span>
                      {lecture.section}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Teacher Name: </span>
                      {lecture.teacherName}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Time: </span>
                      {lecture.startTime}
                    </div>
                    <div className="mb-2 break-all">
                      <span className="font-semibold">Lecture Link: </span>
                      {formattedHref ? (
                        <a
                          href={formattedHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {displayText}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No link</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
