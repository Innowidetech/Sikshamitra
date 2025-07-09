import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMeeting, clearMessages } from '../../redux/teacher/createMeetingSlice'; // ✅ updated slice path
import { fetchMyStudents } from '../../redux/teacher/myStudentsSlice';
import { fetchTeacherConnects } from '../../redux/teacher/teacherQuerySlice'; // ✅ fetch connects
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateMeeting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, successMessage, errorMessage } = useSelector((s) => s.meeting);
  const { data } = useSelector((s) => s.myStudents); // students/parents from API

  const [meetingType, setMeetingType] = useState('instant');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sendToAdmin, setSendToAdmin] = useState(false);
  const [selectedParents, setSelectedParents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showDropdowns, setShowDropdowns] = useState({ parent: false, student: false });

  const [parentNames, setParentNames] = useState([]);
  const [studentNames, setStudentNames] = useState([]);

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
      dispatch(fetchTeacherConnects()); // ✅ Refresh meeting table
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearMessages());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Populate dropdown values from API
  useEffect(() => {
    if (data?.parents?.length) {
      const parents = [];
      const students = [];

      data.parents.forEach((parent) => {
        const { fatherName, motherName } = parent.parentProfile || {};
        const parentDisplay = `${fatherName} / ${motherName}`;
        parents.push(parentDisplay);

        parent.parentProfile?.parentOf?.forEach((child) => {
          const studentName = child.studentProfile?.fullname;
          if (studentName) students.push(studentName);
        });
      });

      setParentNames(parents);
      setStudentNames(students);
    }
  }, [data]);

  const toggleDropdown = (role) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const toggleSelection = (list, setList, name) => {
    setList((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleGenerateLink = () => {
    const attendants = [
      ...(sendToAdmin ? ['Admin'] : []),
      ...selectedParents,
      ...selectedStudents,
    ];

    if (meetingType === 'instant') {
      if (!meetingTitle || attendants.length === 0) {
        toast.error('Please enter title and select members.');
        return;
      }
    } else {
      if (!meetingTitle || !startDate || !startTime || !endDate || !endTime || attendants.length === 0) {
        toast.error('Please fill all required fields.');
        return;
      }
    }

    const payload = {
      title: meetingTitle,
      meetingType,
      attendants,
      ...(meetingType === 'scheduled' && {
        startDate,
        startTime,
        endDate,
        endTime,
      }),
    };

    dispatch(createMeeting(payload))
      .unwrap()
      .then(() => dispatch(fetchTeacherConnects())); // ✅ refresh table after creation
  };

  return (
    <div className="max-w-4xl mx-auto border border-blue-300 rounded-md p-6 mt-10">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-lg font-semibold text-blue-700 mb-4">Schedule a Meeting</h2>

      {/* Meeting Type Toggle */}
      <div className="flex gap-6 mb-6">
        {['instant', 'scheduled'].map((type) => (
          <label key={type} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="meetingType"
              value={type}
              checked={meetingType === type}
              onChange={() => setMeetingType(type)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)} Meeting
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">Title</label>
        <input
          type="text"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
      </div>

      {meetingType === 'scheduled' && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1">Start time of meeting</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">End time of meeting</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border px-2 py-1 rounded bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      <h3 className="text-sm font-semibold text-gray-700 mb-2">Members</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Admin */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sendToAdmin}
            onChange={(e) => setSendToAdmin(e.target.checked)}
          />
          Admin
        </label>

        {/* Parents Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('parent')}
            className="w-full border rounded px-2 py-1 bg-white"
          >
            Parents ▾
          </button>
          {showDropdowns.parent && (
            <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-40 overflow-y-auto">
              {parentNames.map((name, idx) => (
                <label key={idx} className="block px-3 py-1 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedParents.includes(name)}
                    onChange={() =>
                      toggleSelection(selectedParents, setSelectedParents, name)
                    }
                  />
                  {name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Students Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('student')}
            className="w-full border rounded px-2 py-1 bg-white"
          >
            Students ▾
          </button>
          {showDropdowns.student && (
            <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-40 overflow-y-auto">
              {studentNames.map((name, idx) => (
                <label key={idx} className="block px-3 py-1 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedStudents.includes(name)}
                    onChange={() =>
                      toggleSelection(selectedStudents, setSelectedStudents, name)
                    }
                  />
                  {name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleGenerateLink}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Generate Meet Link'}
        </button>
      </div>
    </div>
  );
};

export default CreateMeeting;
