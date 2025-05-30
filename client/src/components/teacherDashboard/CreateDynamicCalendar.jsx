import { useLocation } from 'react-router-dom';
import Header from '../adminDashboard/layout/Header';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTeacherCalendarEvent } from '../../redux/teacher/teacherDashboardSlice'; // Adjust path as needed

const CreateDynamicCalendar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Assuming token is stored in Redux (adjust if you get it differently)
  const token = useSelector((state) => state.auth.token);

  const selectedDate = location.state?.selectedDate || new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
  date: selectedDate,
  title: '',
  description: '',
  displayTo: {
    admin: false,
    teacher: false,
    student: false,
    parent: false,
  },
});


  // Local UI state for error/loading feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCheckboxChange = (role) => {
  setFormData((prev) => ({
    ...prev,
    displayTo: {
      ...prev.displayTo,
      [role]: !prev.displayTo[role],
    },
  }));
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async () => {
  setError(null);
  setSuccess(false);

  // Validation
  if (!formData.date || !formData.title || !formData.description) {
    setError('Please fill all required fields.');
    return;
  }

  const visibleRoles = Object.entries(formData.displayTo)
  .filter(([_, value]) => value)
  .map(([key]) => key);


  if (visibleRoles.length === 0) {
    setError('Please select at least one visibility option.');
    return;
  }

  setLoading(true);

  try {
   const calendarData = {
  date: formData.date,
  title: formData.title,
  description: formData.description,
  displayTo: visibleRoles,
};

    const resultAction = await dispatch(
      createTeacherCalendarEvent({ token, calendarData })
    );

    if (createTeacherCalendarEvent.fulfilled.match(resultAction)) {
      setSuccess(true);
      setFormData({
        date: selectedDate,
        title: '',
        description: '',
        displayTo: { admin: false, teacher: false, student: false, parent: false},
      });
    } else {
      setError(resultAction.payload || 'Failed to create calendar event');
    }
  } catch (err) {
    setError('Unexpected error occurred.');
  }

  setLoading(false);
};


  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light xl:text-[35px]">Create Dynamic Calendar</h1>
          <hr className="mt-2 border-[#146192] w-[250px]" />
          <p className="mt-2">
            <span>Home</span> {'>'} <span className="text-[#146192]">Dynamic Calendar</span>
          </p>
        </div>
        <Header />
      </div>

      {/* Form Box */}
      <div className="bg-white shadow-md border rounded-lg p-6 max-w-4xl w-full mx-auto mb-12 mt-8">
        <h2 className="text-center text-[#146192] font-semibold text-lg mb-10 border-b-2 border-[#146192] pb-2">
          FILL THE DETAILS TO UPLOAD THE DYNAMIC CALENDAR
        </h2>

        {/* Error & Success Messages */}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">Event created successfully!</p>}

        {/* Date and Title */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="font-semibold">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-[#14619245] rounded outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="w-full mt-1 p-2 bg-[#14619245] rounded outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="font-semibold">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows={4}
            className="w-full mt-1 p-2 bg-[#14619245] rounded outline-none"
          ></textarea>
        </div>

        {/* Display To */}
        <div className="mb-4">
          <label className="font-semibold">Display to *</label>
          <div className="flex flex-wrap gap-4 mt-2 ">
            {['admin', 'teacher', 'student', 'parent'].map((role) => (
              <label key={role} className="flex items-center space-x-2 ">
                <input
                  type="checkbox"
                  checked={formData.displayTo[role]}
                  onChange={() => handleCheckboxChange(role)}
                  className="accent-[#146192] w-5 h-5  "
                />
                <span className="capitalize ">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-2 border border-[#146192] rounded-lg text-[#146192] hover:bg-[#146192] hover:text-white transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDynamicCalendar;
