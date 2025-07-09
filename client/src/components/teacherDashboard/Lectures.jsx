import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLectureTimetable, createOrUpdateLectureTimetable, createOnlineLecture, deleteLecturePeriod
} from '../../redux/teacher/lectureSlice'
import Header from '../adminDashboard/layout/Header';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation

function Lectures({ handleTabChange }) {
  const dispatch = useDispatch();
  const { loading, data, error, onlineLectureStatus } = useSelector((state) => state.lecture);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // ✅ Create Online Lecture Modal
  const [editableTimetable, setEditableTimetable] = useState({});
 const handleDeletePeriod = async (periodId, day) => {
  try {
    const resultAction = await dispatch(deleteLecturePeriod(periodId));
    if (deleteLecturePeriod.fulfilled.match(resultAction)) {
      // Remove from editableTimetable UI state
      setEditableTimetable((prev) => ({
        ...prev,
        [day]: (prev[day] || []).filter((item) => item._id !== periodId),
      }));
      toast.success('Period deleted successfully');
    } else {
      toast.error(resultAction.payload || 'Failed to delete period');
    }
  } catch (err) {
    console.error(err);
    toast.error('An error occurred while deleting');
  }
};
  const [lectureForm, setLectureForm] = useState({
    subject: '',
    topic: '',
    className: '',
    section: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const openEditModal = () => {
    setEditableTimetable(teacherTimetable);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleLectureFormChange = (e) => {
    const { name, value } = e.target;
    setLectureForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOnlineLecture = () => {
    dispatch(createOnlineLecture(lectureForm))
      .unwrap()
      .then(() => {
        alert('Online lecture created successfully!');
        closeCreateModal();
      })
      .catch((err) => alert('Failed to create online lecture: ' + err));
  };

  const handleInputChange = (day, slot, field, value) => {
    setEditableTimetable((prev) => {
      const updated = { ...prev };
      const dayLectures = [...(updated[day] || [])];

      const index = dayLectures.findIndex(
        (item) => getTimeSlot(item.startTime) === slot
      );

      if (index !== -1) {
        // Update existing lecture
        dayLectures[index] = {
          ...dayLectures[index],
          [field]: value,
        };
      } else {
        // Create new lecture entry
        const newLecture = {
          startTime: slot.split('-')[0], // or use correct format expected
          [field]: value,
          subject: '',
          class: '',
          section: '',
        };
        dayLectures.push(newLecture);
      }

      updated[day] = dayLectures;
      return updated;
    });
  };

  const submitEdit = () => {
    dispatch(createOrUpdateLectureTimetable(editableTimetable))
      .unwrap()
      .then(() => {
        closeEditModal();
        dispatch(fetchLectureTimetable()); // Refresh timetable after update
      })
      .catch(err => {
        alert('Failed to update timetable: ' + err);
      });
  };

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

  // Updated getTimeSlot function with safety checks
  const getTimeSlot = (startTime) => {
    if (!startTime || typeof startTime !== 'string') return '';

    let timeStr = startTime.trim();

    if (/AM|PM/i.test(timeStr)) {
      const parts = timeStr.split(' ');
      if (parts.length !== 2) return '';
      const [time, meridian] = parts;
      let [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return '';
      if (meridian.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;
      timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const [hour, minute] = timeStr.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return '';

    const timeNum = hour + minute / 60;

    if (timeNum >= 9 && timeNum < 10) return '9:00-10:00';
    if (timeNum >= 10 && timeNum < 11) return '10:00-11:00';
    if (timeNum >= 11 && timeNum < 12) return '11:00-12:00';
    if (timeNum >= 12 && timeNum < 13) return lunchBreakTime; // Lunch break
    if (timeNum >= 13 && timeNum < 14) return '1:00-2:00';
    if (timeNum >= 14 && timeNum < 15) return '2:00-3:00';
    if (timeNum >= 15 && timeNum < 16) return '3:00-4:00';
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
          doc.text(`${lecture.subject} (${lecture.teacher?.profile?.fullname || 'N/A'})`, 40 + (idx * 35), yOffset);
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
          doc.text(`${lecture.subject} (${lecture.teacher?.profile?.fullname || 'N/A'})`, 40 + (idx * 35), yOffset);
        } else {
          doc.text('No class', 40 + (idx * 35), yOffset);
        }
      });
      yOffset += 10;
    });

    // Save PDF
    doc.save('class_timetable.pdf');
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
            {/* Class Timetable - Desktop */}
            {Object.keys(classTimetable).length > 0 && (
              <div className=" justify-center mt-12 mx-8">
                <div className="w-full p-6">
                  {/* Buttons aligned left */}
                  <div className="w-full p-6 flex justify-end space-x-4 mb-6">
                    <div className="w-full p-6 flex justify-end space-x-4 mb-6">
                      <button
                        onClick={openCreateModal}
                        className="bg-[#146192] text-white px-4 py-2 rounded-md text-sm"
                      >
                        Create Online Lecture
                      </button>

                      <button
                        onClick={() => handleTabChange('scheduledlec')}
                        className="bg-[#146192] text-white px-4 py-1 rounded-md text-sm"
                      >
                        Scheduled Lecture
                      </button>

                    </div>
                  </div>
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
                                      <span>{lecture.subject}</span><br />
                                      <small>({lecture.teacher.profile.fullname})</small><br />
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
            {/* Teacher Timetable - Desktop */}
            {Object.keys(teacherTimetable).length > 0 && (
              <div className="justify-center mt-12 mx-8">
                <div className="w-full p-6">
                  {/* Teacher Timetable */}
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
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={openEditModal}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700"
                      >
                        {Object.keys(teacherTimetable).length === 0 ? 'Create Teacher Timetable' : 'Edit Teacher Timetable'}
                      </button>
                    </div>
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

            {/* Modal for creating online lecture */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold text-blue-800">Create Online Lecture</h2>
                    <button onClick={closeCreateModal} className="text-gray-600 text-xl font-bold">&times;</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ['subject', 'Subject'],
                      ['topic', 'Topic'],
                      ['className', 'Class'],
                      ['section', 'Section'],
                      ['startDate', 'Start Date'],
                      ['startTime', 'Start Time'],
                      ['endDate', 'End Date'],
                      ['endTime', 'End Time'],
                    ].map(([key, label]) => (
                      <input
                        key={key}
                        name={key}
                        placeholder={label}
                        value={lectureForm[key]}
                        onChange={handleLectureFormChange}
                        className="border p-2 rounded-md"
                        type={key.includes('Date') ? 'date' : key.includes('Time') ? 'time' : 'text'}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={closeCreateModal}
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateOnlineLecture}
                      className="px-6 py-2 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
           {isEditModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Edit Teacher's Timetable</h2>
        <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>

      {/* Description */}
      <p className="text-blue-600 font-medium mb-6">Edit and Save Teacher's Timetable details</p>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(editableTimetable).map((day) => (
          <div key={day} className="bg-[#f4fafe] border border-blue-100 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{day}</h3>

            {timeSlots.map((slot) => {
              const lecture = (editableTimetable[day] || []).find(
                (item) => getTimeSlot(item.startTime) === slot
              ) || { subject: '', section: '', class: '', startTime: slot.split('-')[0] };

              const periodId = lecture._id;

              return (
                <div key={slot} className="mb-5">
                  <div className="flex justify-between items-center text-sm text-blue-700 font-semibold mb-2">
                    <span>{slot}</span>
                    {periodId && (
                      <button
                        onClick={() => handleDeletePeriod(periodId, day)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={lecture.subject}
                      onChange={(e) => handleInputChange(day, slot, 'subject', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Class"
                      value={lecture.class}
                      onChange={(e) => handleInputChange(day, slot, 'class', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Section"
                      value={lecture.section}
                      onChange={(e) => handleInputChange(day, slot, 'section', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={closeEditModal}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={submitEdit}
          className="px-6 py-2 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

          </>
        )}
      </div>
    </>
  );
}
export default Lectures;
