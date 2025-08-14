import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import { fetchTeachers } from '../../redux/teachersSlice';
import { fetchParents } from '../../redux/parentSlice';
import { fetchStudents } from '../../redux/studentsSlice';
import { fetchEmployees } from '../../redux/adminEmployee';
import { createAdminMeeting } from '../../redux/adminConnectQueriesSlice';

const AdminInstantPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [sendToSuperAdmin, setSendToSuperAdmin] = useState(false);
  const [selected, setSelected] = useState({
    teacher: [],
    parents: [],
    students: [],
    staff: [],
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [generated, setGenerated] = useState(null);

  const teachers = useSelector((s) => s.teachers.teachers || []);
  const parents = useSelector((s) => s.parents.parents || []);
  const students = useSelector((s) => s.students.students || []);
  const staff = useSelector((s) => s.adminEmployee.staffList || []);
  const loading = useSelector((s) => s.adminConnectQueries.loading);

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchParents());
    dispatch(fetchStudents());
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const weekday = now.toLocaleDateString([], { weekday: 'long' });
      const date = now.toLocaleDateString([], { month: 'long', day: 'numeric' });
      setCurrentTime(`${time}, ${weekday}, ${date}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getId = (role, item) => {
    try {
      switch (role) {
        case 'teacher':
        case 'parents':
        case 'staff':
          return item?._id?.toString();
        case 'students':
          return item?.parent?.parentProfile?.parentOf?.[0]?.student?._id?.toString();
        default:
          return '';
      }
    } catch {
      return '';
    }
  };

  const getLabel = (role, item) => {
    switch (role) {
      case 'teacher':
        return item?.profile?.fullname || item?.name || 'Unnamed';
      case 'parents':
        return item?.parentProfile?.fatherName || 'Unnamed';
      case 'students':
        const student = item?.parent?.parentProfile?.parentOf?.[0]?.student?.studentProfile;
        return student?.fullname || 'Unnamed';
      case 'staff':
        return item?.name || 'Unnamed';
      default:
        return 'Unknown';
    }
  };

  const handleCheck = (role, id) => {
    setSelected((prev) => {
      const already = prev[role].includes(id);
      return {
        ...prev,
        [role]: already ? prev[role].filter((x) => x !== id) : [...prev[role], id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warn('Please enter a title.');
      return;
    }

    const attendants = [];

    const pushNames = (list, roleKey) => {
      list.forEach((item) => {
        const id = getId(roleKey, item);
        if (selected[roleKey].includes(id)) {
          const name = getLabel(roleKey, item);
          if (name && name !== 'Unnamed') {
            attendants.push(name); // ✅ Only pushing names as string
          }
        }
      });
    };

    pushNames(teachers, 'teacher');
    pushNames(parents, 'parents');
    pushNames(students, 'students');
    pushNames(staff, 'staff');

    if (sendToSuperAdmin) {
      attendants.push('Super Admin');
    }

    if (attendants.length === 0) {
      toast.warn('Please select at least one member.');
      return;
    }

    const meetingLink = `https://meet.jit.si/${title.trim().replace(/\s+/g, '-')}-${Date.now()}`;

    const payload = {
      title: title.trim(),
      attendants, // ✅ Only names, not objects
      meetingLink,
    };

    try {
      const res = await dispatch(createAdminMeeting(payload)).unwrap();
      toast.success('✅ Instant meeting created!');
      setGenerated(res);
      setTitle('');
      setSelected({ teacher: [], parents: [], students: [], staff: [] });
      setSendToSuperAdmin(false);
    } catch (err) {
      toast.error(err?.message || '❌ Failed to create meeting');
    }
  };

  const renderDropdown = (role, label, list) => {
    const isOpen = dropdownOpen === role;
    return (
      <div className="relative w-full sm:w-[220px] text-sm font-medium">
        <label className="block text-sm mb-1">{label}</label>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => (prev === role ? null : role))}
          className="w-full border rounded px-2 py-1 bg-white flex justify-between items-center"
        >
          {selected[role].length === 0 ? 'Select' : `${selected[role].length} selected`}
          <span className="ml-2">&#9662;</span>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-40 overflow-y-auto">
            {list.map((item, i) => {
              const id = getId(role, item);
              if (!id) return null;
              return (
                <label key={id || i} className="block px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected[role].includes(id)}
                    onChange={() => handleCheck(role, id)}
                    className="mr-2"
                  />
                  {getLabel(role, item)}
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="text-sm text-blue-600 cursor-pointer font-medium px-4 py-3"
        onClick={() => navigate(-1)}
      >
        &larr; Meet
      </div>

      <div className="flex justify-center items-start pt-20 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl border border-blue-400 bg-white p-6 rounded-md shadow-md
            sm:p-6
            md:p-8
            "
        >
          <h2 className="text-blue-600 font-semibold text-lg mb-4">Generate Admin Meeting Link</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Meeting Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <h3 className="text-blue-600 font-semibold mb-2">Members</h3>
          <div
            className="
              flex flex-wrap gap-4 mb-6
              sm:gap-4
              md:flex-nowrap md:gap-6
              "
          >
            <div className="flex items-center gap-2 mt-1 min-w-[120px]">
              <input
                type="checkbox"
                id="superAdminCheck"
                checked={sendToSuperAdmin}
                onChange={() => setSendToSuperAdmin((prev) => !prev)}
                className="h-4 w-4"
              />
              <label htmlFor="superAdminCheck" className="text-sm font-medium">
                Super Admin
              </label>
            </div>

            {renderDropdown('teacher', 'Teachers', teachers)}
            {renderDropdown('parents', 'Parents', parents)}
            {renderDropdown('students', 'Students', students)}
            {renderDropdown('staff', 'Staff', staff)}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Meet Link'}
            </button>
          </div>

          {generated && (
            <div className="mt-6 bg-green-50 border border-green-400 text-green-800 px-4 py-3 rounded break-words">
              <p className="font-semibold">Meeting Created!</p>
              <p>
                <strong>Title:</strong> {generated.title}
              </p>
              <p>
                <strong>Link:</strong>{' '}
                <a
                  href={generated.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {generated.meetingLink}
                </a>
              </p>
              <p>
                <strong>Created:</strong> {new Date(generated.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminInstantPage;
