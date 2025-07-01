import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOrUpdateLectureTimetable } from '../../redux/teacher/lectureSlice'; // Redux action

function EditLectureTimetable() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    subject: '',
    teacher: '',
    class: '',
    section: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrUpdateLectureTimetable(formData)); // Dispatch the form data
  };

  return (
    <div className="mx-8 mt-6 md:ml-72">
      <h2 className="text-3xl font-bold mb-6 text-[#146192]">Edit Teacher Timetable</h2>
      <div className="overflow-hidden p-4 border-2 border-[#146192] rounded-lg">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="day" className="block text-sm font-semibold">Day</label>
            <input
              type="text"
              id="day"
              name="day"
              className="border p-2 w-full mt-1"
              value={formData.day}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-semibold">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="border p-2 w-full mt-1"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="teacher" className="block text-sm font-semibold">Teacher</label>
            <input
              type="text"
              id="teacher"
              name="teacher"
              className="border p-2 w-full mt-1"
              value={formData.teacher}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-semibold">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="border p-2 w-full mt-1"
              value={formData.startTime}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-semibold">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="border p-2 w-full mt-1"
              value={formData.endTime}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-[#146192] text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLectureTimetable;
