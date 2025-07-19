import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTeachers } from '../../redux/teachersSlice';
import { fetchParents } from '../../redux/parentSlice';
import { fetchStudents } from '../../redux/studentsSlice';
import { fetchEmployees } from '../../redux/adminEmployee';
import { createAdminInstantMeeting } from '../../redux/adminConnectQueriesSlice';
import { toast } from 'react-toastify';

const AdminInstantPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState('');
  const [title, setTitle] = useState('');
  const [sendToSuperAdmin, setSendToSuperAdmin] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState({
    teacher: [],
    parents: [],
    students: [],
    staff: [],
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  const teachers = useSelector((state) => state.teachers.teachers || []);
  const parents = useSelector((state) => state.parents.parents || []);
  const students = useSelector((state) => state.students.students || []);
  const staffList = useSelector((state) => state.adminEmployee.staffList || []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchTeachers());
      dispatch(fetchParents());
      dispatch(fetchStudents());
      dispatch(fetchEmployees());
    } else {
      toast.error('Unauthorized: Please log in again.');
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const handleCheckboxChange = (role, id) => {
    setSelectedMembers((prev) => {
      const alreadySelected = prev[role].includes(id);
      return {
        ...prev,
        [role]: alreadySelected
          ? prev[role].filter((n) => n !== id)
          : [...prev[role], id],
      };
    });
  };

  const getUserLabel = (role, item) => {
    switch (role) {
      case 'teacher':
        return `${item?.profile?.fullname || item?.name || 'Unnamed'} (${(item?.profile?.subjects || []).join(', ')})`;
      case 'parents':
        return item?.parentProfile?.fatherName || 'Unnamed';
      case 'students': {
        const student = item?.parent?.parentProfile?.parentOf?.[0]?.student?.studentProfile;
        return student
          ? `${student.fullname || 'Unnamed'} (Class ${student.class || '-'}${student.section || ''})`
          : 'Unnamed';
      }
      case 'staff':
        return `${item?.name || 'Unnamed'} (${item?.employeeRole || 'Role N/A'})`;
      default:
        return 'Unknown';
    }
  };

  const getId = (role, item) => {
    switch (role) {
      case 'teacher':
      case 'parents':
        return item._id;
      case 'students':
        return item?.parent?.parentProfile?.parentOf?.[0]?.student?._id;
      case 'staff':
        return item._id;
      default:
        return '';
    }
  };

  const renderUserGroup = (role, label, list) => {
    const isOpen = openDropdown === role;

    return (
      <div key={role} className="relative">
        <label className="block text-sm mb-1">{label}</label>
        <div
          className="border rounded bg-gray-100 shadow text-sm px-2 py-2 cursor-pointer"
          onClick={() => setOpenDropdown((prev) => (prev === role ? null : role))}
        >
          {selectedMembers[role].length > 0
            ? `${selectedMembers[role].length} selected`
            : 'Select'}
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-md">
            {list.length > 0 ? (
              list.map((item) => {
                const id = getId(role, item);
                if (!id) return null;
                const isChecked = selectedMembers[role].includes(id);
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(role, id)}
                    />
                    <span>{getUserLabel(role, item)}</span>
                  </label>
                );
              })
            ) : (
              <div className="px-2 py-2 text-gray-500 text-sm">No records found</div>
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const weekday = now.toLocaleDateString([], { weekday: 'long' });
      const date = now.toLocaleDateString([], {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      setCurrentTime(`${time}, ${weekday}, ${date}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    const totalSelected =
      selectedMembers.teacher.length +
      selectedMembers.parents.length +
      selectedMembers.students.length +
      selectedMembers.staff.length +
      (sendToSuperAdmin ? 1 : 0);

    if (!title || totalSelected === 0) {
      toast.error('Please enter a title and select at least one member.');
      return;
    }

    const attendants = [];

    const pushAttendants = (list, roleKey, roleLabel) => {
      list.forEach((item) => {
        const id = getId(roleKey, item);
        if (selectedMembers[roleKey].includes(id)) {
          attendants.push({ role: roleLabel, id });
        }
      });
    };

    pushAttendants(teachers, 'teacher', 'Teacher');
    pushAttendants(parents, 'parents', 'Parent');
    pushAttendants(students, 'students', 'Student');
    pushAttendants(staffList, 'staff', 'Staff');

    if (sendToSuperAdmin) {
      attendants.push({ role: 'Admin', id: 'superadmin-fixed-id' });
    }

    try {
      await dispatch(createAdminInstantMeeting({ title, attendants })).unwrap();
      toast.success('Instant meeting created successfully!');
      navigate('/adminconnectpage');
    } catch (err) {
      toast.error(err?.message || 'Failed to create instant meeting');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 pt-12 relative font-sans">
      {/* Top Bar */}
      <div className="w-full bg-white flex justify-between items-center px-4 py-2 text-sm fixed top-0 left-0 shadow z-10">
        <span className="font-medium cursor-pointer" onClick={() => navigate(-1)}>
          &larr; Meet
        </span>
        <span>{currentTime}</span>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto mt-16 border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Instant Meeting</h2>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm bg-gray-100 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Members */}
        <h3 className="text-sm font-medium mb-2">Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* Super Admin */}
          <div>
            <label className="block text-sm mb-1">Super Admin</label>
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={sendToSuperAdmin}
              onChange={() => setSendToSuperAdmin((prev) => !prev)}
            />
          </div>

          {/* Dropdowns */}
          {renderUserGroup('teacher', 'Teachers', teachers)}
          {renderUserGroup('parents', 'Parents', parents)}
          {renderUserGroup('students', 'Students', students)}
          {renderUserGroup('staff', 'Staff', staffList)}
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
            onClick={handleGenerate}
          >
            Generate Meet Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminInstantPage;
