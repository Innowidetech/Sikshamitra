// ... keep all your existing imports ...
import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

function TimeTable() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDownload = (format) => {
    if (format === 'PDF') {
      generatePDF();
    }
    setIsDropdownOpen(false);
  };

  const generatePDF = () => {
    const timetableElement = document.getElementById('timetable');
    const options = {
      margin: 10,
      filename: 'timetable.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().from(timetableElement).set(options).save();
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('https://sikshamitra.onrender.com/api/student/timetable', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setTimetable(response.data.classTimetable.timetable);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch timetable data');
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) return <div>Loading timetable...</div>;
  if (error) return <div>{error}</div>;

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

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Time Table</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Time Table</span>
          </h1>
        </div>
        <div><Header /></div>
      </div>

      <div className="flex justify-end mt-4 mx-8 pr-20">
        <button
          onClick={toggleDropdown}
          className="bg-[#146192] text-white py-2 px-4 rounded-lg flex items-center"
        >
          <i className="fas fa-download mr-2"></i> Download
        </button>
        {isDropdownOpen && (
          <div className="absolute bg-white shadow-md mt-2 right-10 border border-[#146192] rounded-md">
            <ul className="text-center py-2">
              <li
                onClick={() => handleDownload('PDF')}
                className="cursor-pointer py-2 px-4 hover:bg-gray-200 text-[#146192] font-semibold"
              >
                PDF
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Desktop/Laptop View */}
      <div className="hidden xl:flex justify-center mt-12 mx-8" id="timetable">
        <div className="w-[90%] p-6 rounded-xl shadow-xl h-[800px]">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#146192]">CLASS TIMETABLE</h2>
          <div className="overflow-x-auto p-4 border-2 border-[#146192] rounded-lg">
            <table className="table-auto w-full text-center border-collapse" style={{ height: '600px' }}>
              <thead>
                <tr className="text-black">
                  <th className="border-b-2 border-[#146192] py-2 bg-[#1982C438]">Day</th>
                  {timeSlots.map((slot) => (
                    <th key={slot} className={`border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]`}>
                      {slot === '12:00-1:00' ? (
                        <div className="text-black font-bold">12:00-1:00</div>
                      ) : slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, index) => (
                  <tr key={index} className="bg-gray-50">
                    <td className="border-b border-[#146192] py-2 capitalize">{day}</td>
                    {timeSlots.map((slot) => {
                      if (slot === '12:00-1:00') {
                        return (
                          <td key={slot} className="border-b border-l-2 border-[#146192] py-2 bg-red-500 text-white">
                            Lunch Break
                          </td>
                        );
                      }
                      const data = timetable[day]?.find(item => getTimeSlot(item.startTime) === slot);
                      return (
                        <td key={slot} className="border-b border-l-2 border-[#146192] py-2">
                          {data ? (
                            <>
                              <span>{data.subject}</span><br />
                              <span>({data.teacher.profile.fullname})</span>
                            </>
                          ) : 'No class'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="xl:hidden mt-8 px-4">
        <h2 className="text-2xl font-bold text-center text-[#146192] mb-6">CLASS TIMETABLE</h2>
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, idx) => (
          <div key={idx} className="mb-6 border rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center bg-[#1982C438] text-black font-semibold">
              <div className="w-1/2 text-center py-2 border-r">Day<br /><span className="font-bold capitalize">{day}</span></div>
              <div className="w-1/2 text-center py-2">Time</div>
            </div>
            {timeSlots.map((slot, index) => {
              const data = timetable[day]?.find(item => getTimeSlot(item.startTime) === slot);
              return (
                <div key={index} className="flex border-t">
                  <div className="w-1/2 bg-[#1982C438] py-3 text-center border-r font-semibold">{slot}</div>
                  <div className="w-1/2 py-3 text-center text-sm">
                    {slot === '12:00-1:00' ? (
                      <span className="text-red-600 font-semibold">LUNCH</span>
                    ) : data ? (
                      <>
                        <span className="font-medium">{data.subject}</span><br />
                        <span className="text-gray-500 text-xs">(Teacher: {data.teacher.profile.fullname})</span>
                      </>
                    ) : (
                      'No class'
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
