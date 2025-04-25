import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLectureTimetable } from '../../redux/teacher/lectureSlice';
import Header from '../adminDashboard/layout/Header';
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

function Lectures() {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.lecture);

  const [isModalOpen, setIsModalOpen] = useState(false); // To handle modal visibility
  const [formData, setFormData] = useState({
    day: '',
    timeSlot: '',
    subject: '',
    teacher: '',
    class: '',
    section: '',
  });

  useEffect(() => {
    dispatch(fetchLectureTimetable());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-blue-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-red-600">{error}</span>
      </div>
    );
  }

  // Extract teacherTimetable and classTimetable from data
  const teacherTimetable = data.teacherTimetable?.timetable || {};
  const classTimetable = data.classTimetable?.timetable || {};

  const timeSlots = [
    '9:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'
  ];

  const lunchBreakTime = '12:00-1:00';  // Lunch break slot

  const getTimeSlot = (startTime) => {
    const time = startTime.split(' ')[0];
    if (time >= '9:00' && time < '10:00') return '9:00-10:00';
    if (time >= '10:00' && time < '11:00') return '10:00-11:00';
    if (time >= '11:00' && time < '12:00') return '11:00-12:00';
    if (time >= '12:00' && time < '1:00') return lunchBreakTime; // Lunch break
    if (time >= '1:00' && time < '2:00') return '1:00-2:00';
    if (time >= '2:00' && time < '3:00') return '2:00-3:00';
    if (time >= '3:00' && time < '4:00') return '3:00-4:00';
    return '';
  };

  // PDF generation function for Teacher Timetable
  const downloadTeacherPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Teacher Timetable', 105, 20, { align: 'center' });

    let yOffset = 30; // Starting Y offset for content

    // Table Header
    doc.setFontSize(12);
    doc.text('Day', 15, yOffset);
    timeSlots.forEach((slot, idx) => {
      doc.text(slot, 40 + (idx * 35), yOffset);
    });
    yOffset += 10;

    // Table Content for Teacher Timetable
    Object.entries(teacherTimetable).forEach(([day, lectures]) => {
      doc.text(day, 15, yOffset);
      timeSlots.forEach((slot, idx) => {
        const lecture = lectures.find(item => getTimeSlot(item.startTime) === slot);
        if (lecture) {
          doc.text(`${lecture.subject} (${lecture.teacher?.profile?.fullname})`, 40 + (idx * 35), yOffset);
        } else {
          doc.text('No class', 40 + (idx * 35), yOffset);
        }
      });
      yOffset += 10;
    });

    // Save PDF
    doc.save('teacher_timetable.pdf');
  };

  // PDF generation function for Class Timetable
  const downloadClassPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Class Timetable', 105, 20, { align: 'center' });

    let yOffset = 30; // Starting Y offset for content

    // Table Header
    doc.setFontSize(12);
    doc.text('Day', 15, yOffset);
    timeSlots.forEach((slot, idx) => {
      doc.text(slot, 40 + (idx * 35), yOffset);
    });
    yOffset += 10;

    // Table Content for Class Timetable
    Object.entries(classTimetable).forEach(([day, lectures]) => {
      doc.text(day, 15, yOffset);
      timeSlots.forEach((slot, idx) => {
        const lecture = lectures.find(item => getTimeSlot(item.startTime) === slot);
        if (lecture) {
          doc.text(`${lecture.subject} (${lecture.teacher?.profile?.fullname})`, 40 + (idx * 35), yOffset);
        } else {
          doc.text('No class', 40 + (idx * 35), yOffset);
        }
      });
      yOffset += 10;
    });

    // Save PDF
    doc.save('class_timetable.pdf');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here, you can handle the form submission (e.g., dispatching action to add timetable data)
    console.log(formData);
    setIsModalOpen(false); // Close the modal after form submission
  };

  return (
    <>
      <div className="flex justify-between items-center mx-8 md:ml-72 mt-20">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Lectures</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Lectures</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Timetable Data */}
      <div className="mx-8 mt-6 md:ml-72">
        {Object.keys(teacherTimetable).length === 0 && Object.keys(classTimetable).length === 0 ? (
          <span className="text-lg font-semibold text-gray-600">No timetable data available</span>
        ) : (
          <>
            {/* Teacher Timetable - Desktop */}
            {Object.keys(teacherTimetable).length > 0 && (
              <div className="hidden xl:flex justify-center mt-12 mx-8">
                <div className="w-full p-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#146192] text-white px-4 py-1 rounded-md text-sm"
                  >
                    Create
                  </button>
                  <h2 className="text-3xl font-bold text-center mb-6 text-[#146192]">Teacher Timetable</h2>
                  <div className="overflow-hidden p-4 border-2 border-[#146192] rounded-lg">
                    <table className="table-auto w-full text-center border-collapse">
                      <thead>
                        <tr className="text-black">
                          <th className="border-b-2 border-[#146192] py-2 bg-[#1982C438]">Day</th>
                          {timeSlots.map((slot) => (
                            <th key={slot} className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">
                              {slot}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(teacherTimetable).map(([day, lectures]) => (
                          <tr key={day} className="bg-gray-50">
                            <td className="border-b border-[#146192] py-2 capitalize">{day}</td>
                            {timeSlots.map((slot) => {
                              if (slot === lunchBreakTime) {
                                return (
                                  <td key={slot} className="border-b border-l-2 border-[#146192] py-2 bg-[#FF0707DB]">
                                    <span className="text-xl font-bold">Lunch Break</span>
                                  </td>
                                );
                              }
                              const lecture = lectures.find(item => getTimeSlot(item.startTime) === slot);
                              return (
                                <td key={slot} className="border-b border-l-2 border-[#146192] py-2">
                                  {lecture ? (
                                    <>
                                      <span>{lecture.class}{lecture.section}</span><br />
                                      <small>({lecture.subject})</small><br />
                                    </>
                                  ) : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Download Teacher Timetable PDF Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={downloadTeacherPDF}
                      className="bg-[#146192] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
                    >
                      Download Teacher Timetable as PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Class Timetable - Desktop */}
            {Object.keys(classTimetable).length > 0 && (
              <div className="hidden xl:flex justify-center mt-12 mx-8">
                <div className="w-full p-6">
                  <h2 className="text-3xl font-bold text-center mb-6 text-[#146192]">Class Timetable</h2>
                  <div className="overflow-hidden p-4 border-2 border-[#146192] rounded-lg">
                    <table className="table-auto w-full text-center border-collapse">
                      <thead>
                        <tr className="text-black">
                          <th className="border-b-2 border-[#146192] py-2 bg-[#1982C438]">Day</th>
                          {timeSlots.map((slot) => (
                            <th key={slot} className="border-b-2 border-l-2 border-[#146192] py-2 bg-[#1982C438]">
                              {slot}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(classTimetable).map(([day, lectures]) => (
                          <tr key={day} className="bg-gray-50">
                            <td className="border-b border-[#146192] py-2 capitalize">{day}</td>
                            {timeSlots.map((slot) => {
                              if (slot === lunchBreakTime) {
                                return (
                                  <td key={slot} className="border-b border-l-2 border-[#146192] py-2 bg-[#FF0707DB]">
                                    <span className="text-xl font-bold">Lunch Break</span>
                                  </td>
                                );
                              }
                              const lecture = lectures.find(item => getTimeSlot(item.startTime) === slot);
                              return (
                                <td key={slot} className="border-b border-l-2 border-[#146192] py-2">
                                  {lecture ? (
                                    <>
                                      <span>{lecture.class}{lecture.section}</span><br />
                                      <small>({lecture.subject})</small><br />
                                    </>
                                  ) : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Download Class Timetable PDF Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={downloadClassPDF}
                      className="bg-[#146192] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
                    >
                      Download Class Timetable as PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Create Timetable */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
            <h3 className="text-xl font-bold mb-4">Create Timetable Entry</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="day" className="block text-sm font-semibold">Day</label>
                <select
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="timeSlot" className="block text-sm font-semibold">Time Slot</label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Time Slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-semibold">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="teacher" className="block text-sm font-semibold">Teacher</label>
                <input
                  id="teacher"
                  name="teacher"
                  type="text"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="class" className="block text-sm font-semibold">Class</label>
                <input
                  id="class"
                  name="class"
                  type="text"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="section" className="block text-sm font-semibold">Section</label>
                <input
                  id="section"
                  name="section"
                  type="text"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146192] text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Lectures;
