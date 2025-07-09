import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAdminScheduleMeeting , fetchAdminConnects } from '../../redux/adminConnectQueriesSlice';
import { fetchTeachers } from '../../redux/teachersSlice';
import { fetchParents } from '../../redux/parentSlice';
import { fetchStudents } from '../../redux/studentsSlice';
import { fetchEmployees } from '../../redux/adminEmployee';
import { toast } from 'react-toastify';

const AdminSchedulePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2025-05-07');
  const [startTime, setStartTime] = useState('04:00');
  const [endDate, setEndDate] = useState('2025-05-07');
  const [endTime, setEndTime] = useState('05:00');
  const [sendToSuperAdmin, setSendToSuperAdmin] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const teachers = useSelector((state) => state.teachers.teachers || []);
  const parents = useSelector((state) => state.parents.parents || []);
  const students = useSelector((state) => state.students.students || []);
  const staffList = useSelector((state) => state.adminEmployee.staffList || []);
  const connects = useSelector((state) => state.adminConnectQueries.connects); // ✅ Correct



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchTeachers());
      dispatch(fetchParents());
      dispatch(fetchStudents());
      dispatch(fetchEmployees());
      dispatch(fetchAdminConnects());
    } else {
      toast.error('Unauthorized: Please log in again.');
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const toggleRecipient = (type, id) => {
    setRecipients((prev) => {
      const exists = prev.some((r) => r.type === type && r.id === id);
      return exists
        ? prev.filter((r) => !(r.type === type && r.id === id))
        : [...prev, { type, id }];
    });
  };

  const resolveNameByTypeAndId = (type, id) => {
    if (type === 'Teacher') {
      const t = teachers.find((t) => t._id === id);
      return t?.profile?.fullname || t?.name || 'N/A';
    }
    if (type === 'Parent') {
      const p = parents.find((p) => p._id === id);
      return p?.parentProfile?.fatherName || 'N/A';
    }
    if (type === 'Student') {
      for (const s of students) {
        const studentObj = s?.parent?.parentProfile?.parentOf?.[0]?.student;
        if (studentObj?._id === id) {
          return studentObj?.studentProfile?.fullname || 'N/A';
        }
      }
      return 'N/A';
    }
    if (type === 'Staff') {
      const s = staffList.find((s) => s._id === id);
      return s?.name || 'N/A';
    }
    return 'Unknown';
  };

  const renderDropdown = (label, type, list, getLabel, getId) => (
    <div className="relative w-full">
      <label className="block text-sm mb-1">{label}</label>
     <div
      className="border p-2 rounded-md cursor-pointer"
      style={{ backgroundColor: '#1461921A' }}
      onClick={() => setOpenDropdown((prev) => (prev === type ? null : type))}
    >
        {recipients.filter((r) => r.type === type).length > 0
          ? `${recipients.filter((r) => r.type === type).length} selected`
          : 'Enter Name'}
      </div>
      {openDropdown === type && (
        <div className="absolute z-10 mt-1 max-h-40 overflow-y-auto bg-white border rounded-md shadow-md w-full">
          {list.length > 0 ? (
            list.map((item) => {
              const id = getId(item);
              const selected = recipients.some((r) => r.type === type && r.id === id);
              return (
                <label key={id} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleRecipient(type, id)}
                    className="w-4 h-4"
                  />
                  <span>{getLabel(item)}</span>
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

const handleSubmit = async () => {
  if (!title || (recipients.length === 0 && !sendToSuperAdmin)) {
    toast.error('Please fill all fields and select at least one recipient');
    return;
  }

  const attendants = [];

  recipients.forEach((r) => {
    const name = resolveNameByTypeAndId(r.type, r.id);
    if (name !== 'N/A') {
      attendants.push(name);
    }
  });

  if (sendToSuperAdmin) {
    attendants.push('Super Admin');
  }

  const payload = {
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    attendants,
  };

  console.log("✅ Final payload to be sent:", payload);

  try {
    await dispatch(createAdminScheduleMeeting(payload)).unwrap();  // <-- fixed here
    toast.success('🎉 Meeting scheduled successfully!');
    dispatch(fetchAdminConnects()); // Refresh meetings list after successful creation
  } catch (err) {
    toast.error('❌ Failed to schedule meeting.');
  }
};


  const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div
          className="text-sm text-blue-600 cursor-pointer font-medium"
          onClick={() => navigate(-1)}
        >
          &larr; Meet
        </div>
        <div className="text-sm text-gray-500">
          {formattedTime}, {formattedDate}
        </div>
      </div>

      {/* Form Box */}
      <div className="border border-[#CBD5E0] rounded-md p-6 max-w-4xl mx-auto shadow-sm">
        <h2 className="text-lg font-semibold text-[#3E5FD7] mb-4">Schedule a Meeting</h2>
        <div className="mb-6">
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            className="border rounded p-2 w-full bg-[#1461921A]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <h2 className="text-lg font-semibold text-[#3E5FD7] mb-4">Add your time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1">Start time of meeting</label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded w-full bg-[#1461921A]"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-2 rounded w-full bg-[#1461921A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">End time of meeting</label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded w-full bg-[#1461921A]"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2 rounded w-full bg-[#1461921A]"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Super Admin */}
            <div className="flex flex-col">
              <label className="text-sm mb-1">Super Admin</label>
              <input
                type="checkbox"
                className="w-full h-10 border rounded bg-[#1461921A]"
                checked={sendToSuperAdmin}
                onChange={(e) => setSendToSuperAdmin(e.target.checked)}
              />
            </div>

            {/* Teachers */}
            {renderDropdown(
              'Teacher',
              'Teacher',
              teachers,
              (t) => `${t?.profile?.fullname || t?.name || 'Unnamed'}`,
              (t) => t._id
            )}

            {/* Parents */}
            {renderDropdown(
              'Parents',
              'Parent',
              parents,
              (p) => `${p?.parentProfile?.fatherName || 'Unnamed'}`,
              (p) => p._id
            )}

            {/* Students */}
            {renderDropdown(
              'Students',
              'Student',
              students,
              (s) => {
                const student = s?.parent?.parentProfile?.parentOf?.[0]?.student;
                const profile = student?.studentProfile;
                return profile
                  ? `${profile?.fullname || 'Unnamed'} (Class ${profile?.class || '-'}${profile?.section || ''})`
                  : 'Unnamed';
              },
              (s) => s?.parent?.parentProfile?.parentOf?.[0]?.student?._id
            )}

            {/* Staff */}
            {renderDropdown(
              'Staff',
              'Staff',
              staffList,
              (s) => `${s?.name || 'Unnamed'} (${s?.employeeRole || 'Role N/A'})`,
              (s) => s._id
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#4C78FF] text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Generate Meet Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulePage;
