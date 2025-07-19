import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './layout/Header';
import html2pdf from 'html2pdf.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

function TimeTable() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [onlineLectures, setOnlineLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSchedule = () => setShowSchedule(!showSchedule);

  const handleDownload = () => generatePDF();

  const generatePDF = () => {
    const timetableElement = document.getElementById('timetable');
    const options = {
      margin: 5,
      filename: 'timetable.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    html2pdf().set(options).from(timetableElement).save();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get(
          'https://sikshamitra.onrender.com/api/student/timetable',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        setTimetable(data.classTimetable.timetable);
        setOnlineLectures(data.onlineLectures || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch timetable');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const timeSlots = [
    '9:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'
  ];

  const getTimeSlot = (startTime) => {
    const time = startTime.split(' ')[0];
    if (time >= '9:00' && time < '10:00') return '9:00-10:00';
    if (time >= '10:00' && time < '11:00') return '10:00-11:00';
    if (time >= '11:00' && time < '12:00') return '11:00-12:00';
    if (time >= '12:00' && time < '1:00') return '12:00-1:00';
    if (time >= '1:00' && time < '2:00') return '1:00-2:00';
    if (time >= '2:00' && time < '3:00') return '2:00-3:00';
    if (time >= '3:00' && time < '4:00') return '3:00-4:00';
    return '';
  };

  if (loading) return <div className="text-center mt-10">Loading timetable...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
       {/* Header */}
        {/* Page Heading – Visible only on md (tablet) and above */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">TimeTable</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">TimeTable</span>
    </h1>
  </div>

  {/* Right: Header Icons (also visible in mobile) */}
  <Header />
</div>

     <div className="flex flex-col md:flex-row justify-center md:justify-end mt-20 mx-2 gap-3 md:gap-3 md:pr-16">
  <button
    onClick={toggleSchedule}
    className="bg-[#146192] text-white py-2 px-4 rounded-lg flex items-center justify-center"
  >
    <i className="fas fa-video mr-2"></i> Scheduled Lecture
  </button>

  <div className="relative">
    <button
      onClick={toggleDropdown}
      className="bg-[#285A871A] text-[#285A87] py-2 px-4 rounded-lg flex items-center justify-center w-full md:w-auto"
    >
      <i className="fas fa-download mr-2"></i> Download
    </button>

    {isDropdownOpen && (
      <div className="absolute bg-white shadow-md mt-2 right-0 border border-[#146192] rounded-md z-50">
        <ul className="text-center py-2">
          <li
            onClick={handleDownload}
            className="cursor-pointer py-2 px-4 hover:bg-gray-200 text-[#146192] font-semibold"
          >
            PDF
          </li>
        </ul>
      </div>
    )}
  </div>
</div>

{showSchedule && (
  <div className="xl:flex justify-center mt-12 mx-4 md:mx-8 pl-2 md:pl-6">
    <div className="w-full md:w-[95%] p-4 md:p-6 rounded-xl shadow-xl bg-white border border-[#146192]">
      <h2 className="text-xl md:text-2xl font-bold text-[#146192] mb-4 text-left">
        Scheduled Lectures
      </h2>

      {onlineLectures.length === 0 ? (
        <p className="text-center text-gray-600">No scheduled lectures.</p>
      ) : (
        <div className="space-y-6">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Title/Topic</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Teacher Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Join</th>
                </tr>
              </thead>
              <tbody>
                {onlineLectures.map((lecture, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(lecture.startDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lecture.startTime}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lecture.subject}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lecture.topic}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lecture.teacherName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a
                        href={lecture.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-[#146192] text-white px-3 py-1 rounded hover:bg-[#0f4e7c] transition"
                      >
                        Join
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {onlineLectures.map((lecture, idx) => (
              <div
                key={idx}
                className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
              >
                <p className="text-sm mb-1">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(lecture.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Time:</span>{" "}
                  {lecture.startTime} - {lecture.endTime}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Subject:</span>{" "}
                  {lecture.subject}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Topic:</span>{" "}
                  {lecture.topic}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Teacher:</span>{" "}
                  {lecture.teacherName}
                </p>
                <div className="mt-2">
                  <a
                    href={lecture.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-[#146192] text-white px-4 py-2 rounded hover:bg-[#0f4e7c] transition text-sm"
                  >
                    Join Lecture
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}


      {/* Class Timetable Box (always visible below) */}
       <div className="hidden md:flex justify-center mt-12 mx-8" id="timetable">
        <div className="w-[95%] p-6 rounded-xl shadow-xl bg-white border border-gray-300">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#146192]">CLASS TIMETABLE</h2>
          <table className="table-fixed w-full text-center border-collapse border border-black">
            <thead>
              <tr>
                {/* Diagonal Day-Time Cell */}
                <th className="relative w-[100px] h-[60px] border border-black bg-[#1982C438] overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute w-full h-full">
                      <svg viewBox="0 0 100 60" className="w-full h-full">
                        <line x1="100" y1="0" x2="0" y2="60" stroke="black" strokeWidth="1" />
                      </svg>
                    </div>
                    <span className="absolute top-1 right-16 text-base font-semibold">Day</span>
                    <span className="absolute bottom-1 left-12 text-base font-semibold">Time</span>
                  </div>
                </th>
                {timeSlots.map((slot, idx) => (
                  <th key={idx} className="border border-black bg-[#1982C438] py-2 font-medium text-sm text-[#0f4a70]">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                <tr key={day}>
                  <td className="border border-black font-semibold py-4 capitalize bg-white">{day}</td>
                  {timeSlots.map((slot, index) => {
                    if (slot === '12:00-1:00') {
                      return (
                        <td
                          key={index}
                          className="border border-black bg-red-500 text-white font-bold flex items-center justify-center h-full"
                          style={{ minHeight: '80px' }}
                        >
                          LUNCH BREAK
                        </td>
                      );
                    }
                    const data = timetable[day]?.find(item => getTimeSlot(item.startTime) === slot);
                    return (
                      <td key={index} className="border border-black py-3">
                        {data ? (
                          <>
                            <span className="font-medium">{data.subject}</span><br />
                            <span className="text-gray-500 text-sm">{data.teacher.profile.fullname}</span>
                          </>
                        ) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet view */}
<div className="block md:hidden space-y-6">
  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
    <div key={day} className="bg-[#f3faff] border border-gray-300 rounded-xl shadow p-4">
      <h3 className="text-lg font-bold text-[#146192] mb-4 capitalize">{day}</h3>
      {timeSlots.map((slot, idx) => {
        if (slot === '12:00-1:00') {
          return (
            <div key={idx} className="flex justify-between bg-red-500 text-white font-bold px-4 py-2 rounded mb-2">
              <span>{slot}</span>
              <span>LUNCH BREAK</span>
            </div>
          );
        }
        const data = timetable[day]?.find(item => getTimeSlot(item.startTime) === slot);
        return (
          <div key={idx} className="flex justify-between items-center bg-white px-4 py-3 rounded border border-gray-200 mb-2 shadow-sm">
            <div className="text-sm text-[#0f4a70] font-semibold">{slot}</div>
            <div className="text-right">
              {data ? (
                <>
                  <div className="font-medium text-sm">{data.subject}</div>
                  <div className="text-gray-500 text-xs">{data.teacher.profile.fullname}</div>
                </>
              ) : (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ))}
</div>
    </>
  );
}

export default TimeTable;
