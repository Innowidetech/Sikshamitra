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
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px] mt-10">Time Table</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Time Table</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex justify-end mt-4 mx-8 gap-4 pr-20">
        <button
          onClick={toggleSchedule}
          className="bg-[#146192] text-white py-2 px-4 rounded-lg flex items-center"
        >
          <i className="fas fa-video mr-2"></i> Scheduled Lecture
        </button>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-[#146192] text-white py-2 px-4 rounded-lg flex items-center"
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

      {/* Scheduled Lecture Box (show above timetable if toggled) */}
      {showSchedule && (
        <div className="xl:flex justify-center mt-12 mx-8">
          <div className="w-[95%] p-6 rounded-xl shadow-xl bg-white border border-[#146192]">
            <h2 className="text-2xl font-bold text-[#146192] mb-4 text-center">SCHEDULED LECTURES</h2>
            {onlineLectures.length === 0 ? (
              <p className="text-center text-gray-600">No scheduled lectures.</p>
            ) : (
              <table className="w-full border border-gray-300 text-center">
                <thead className="bg-blue-100 text-[#146192] font-semibold">
                  <tr>
                    <th className="border border-gray-300 py-2">Subject</th>
                    <th className="border border-gray-300 py-2">Topic</th>
                    <th className="border border-gray-300 py-2">Teacher</th>
                    <th className="border border-gray-300 py-2">Start Time</th>
                    <th className="border border-gray-300 py-2">End Time</th>
                    <th className="border border-gray-300 py-2">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {onlineLectures.map((lecture, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="py-2">{lecture.subject}</td>
                      <td className="py-2">{lecture.topic}</td>
                      <td className="py-2">{lecture.teacherName}</td>
                      <td className="py-2">{lecture.startTime}</td>
                      <td className="py-2">{lecture.endTime}</td>
                      <td className="py-2">
                        <a href={lecture.lectureLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                          Join
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Class Timetable Box (always visible below) */}
      <div className="flex justify-center mt-12 mx-8" id="timetable">

        <div className="w-[95%] p-6 rounded-xl shadow-xl bg-white border border-gray-300">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#146192]">CLASS TIMETABLE</h2>
          <table className="table-fixed w-full text-center border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black bg-blue-200 py-3">Day</th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="border border-black bg-blue-200 py-3">{slot}</th>
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
  style={{ minHeight: '80px' }} // adjust height as needed
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
    </>
  );
}

export default TimeTable;
