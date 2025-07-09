import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import contactImage from '../../assets/contact1.png';
import { createAdminQuery } from '../../redux/adminConnectQueriesSlice';
import { fetchTeachers } from '../../redux/teachersSlice';
import { fetchParents } from '../../redux/parentSlice';
import { fetchStudents } from '../../redux/studentsSlice';
import { fetchEmployees } from '../../redux/adminEmployee';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminQueryForm = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchParents());
    dispatch(fetchStudents());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const teachers = useSelector((state) => state.teachers?.teachers || []);
  const parents = useSelector((state) => state.parents?.parents || []);
  const students = useSelector((state) => state.students?.students || []);
  const staffList = useSelector((state) => state.adminEmployee.staffList || []);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    message: '',
    recipients: [],
    sendToSuperAdmin: false,
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleRecipient = (type, id) => {
    setFormData((prev) => {
      const exists = prev.recipients.some((r) => r.type === type && r.id === id);
      const updatedRecipients = exists
        ? prev.recipients.filter((r) => !(r.type === type && r.id === id))
        : [...prev.recipients, { type, id }];
      return { ...prev, recipients: updatedRecipients };
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.message || (formData.recipients.length === 0 && !formData.sendToSuperAdmin)) {
    toast.error('Please fill in all required fields.');
    return;
  }

  const selectedTypes = Array.from(
    new Set(formData.recipients.map((r) => r.type))
  );

  if (formData.sendToSuperAdmin) {
    selectedTypes.push('Super Admin');
  }

  const payload = {
    name: formData.name,
    contact: formData.contact,
    email: formData.email,
    message: formData.message,
    sendTo: selectedTypes,
  };

  try {
    await dispatch(createAdminQuery(payload)).unwrap();

    // ✅ Toast notification on success
    toast.success('Query sent successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });

    setFormData({
      name: '',
      contact: '',
      email: '',
      message: '',
      recipients: [],
      sendToSuperAdmin: false,
    });
  } catch (err) {
    toast.error('Failed to send query. Please try again.', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
};


  const renderDropdown = (label, type, list, getLabel, getId = (item) => item._id) => (
    <div className="relative">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <div
        className="border p-2 rounded-md bg-white cursor-pointer"
        onClick={() => setOpenDropdown((prev) => (prev === type ? null : type))}
      >
        {formData.recipients.filter((r) => r.type === type).length > 0
          ? `${formData.recipients.filter((r) => r.type === type).length} selected`
          : 'Select'}
      </div>
      {openDropdown === type && (
        <div className="absolute z-10 mt-1 max-h-48 overflow-y-auto bg-white border rounded-md shadow-md w-full">
          {list.map((item) => {
            const id = getId(item);
            const selected = formData.recipients.some((r) => r.type === type && r.id === id);
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
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {/* Header and Navigation */}
      <div className="flex justify-between items-center mx-4 md:mx-8 flex-wrap gap-y-4">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Connect & Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-xl xl:text-[17px]">
            Home {'>'} <span className="font-medium text-[#146192]">Connect & Queries</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#146192] text-white px-6 py-2 rounded-md">Queries</button>
          <button className="border border-[#146192] text-[#146192] px-6 py-2 rounded-md">Connect</button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mx-4 md:mx-8 mt-8 bg-white rounded-md shadow p-6 border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Admin Name" className="border p-2 rounded-md" />
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="School Contact" className="border p-2 rounded-md" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="School Email ID" className="border p-2 rounded-md md:col-span-2" />
              </div>

              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Query" rows="5" className="w-full border p-3 rounded-md resize-none"></textarea>

              {/* Super Admin + Dropdowns */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Send to</label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="sendToSuperAdmin"
                    name="sendToSuperAdmin"
                    checked={formData.sendToSuperAdmin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sendToSuperAdmin: e.target.checked,
                      }))
                    }
                    className="w-5 h-5"
                  />
                  <label htmlFor="sendToSuperAdmin" className="text-sm text-gray-700">
                    Super Admin
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {renderDropdown(
                    'Teacher',
                    'Teacher',
                    teachers,
                    (t) => `${t?.profile?.fullname || 'N/A'} (${(t?.profile?.subjects || []).join(', ')})`,
                    (t) => t._id
                  )}
                  {renderDropdown(
                    'Parent',
                    'Parent',
                    parents,
                    (p) => `${p?.parentProfile?.fatherName || 'N/A'}`,
                    (p) => p._id
                  )}
                  {renderDropdown(
                    'Student',
                    'Student',
                    students,
                    (s) => {
                      const profile = s?.parent?.parentProfile?.parentOf?.[0]?.student?.studentProfile;
                      return `${profile?.fullname || 'N/A'} (Class ${profile?.class || '-'}${profile?.section || ''})`;
                    },
                    (s) => s?.parent?.parentProfile?.parentOf?.[0]?.student?._id
                  )}
                  {renderDropdown(
                    'Staff',
                    'Staff',
                    staffList,
                    (s) => `${s.name || 'N/A'} (${s.employeeRole || 'Role N/A'})`,
                    (s) => s._id
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button type="submit" className="bg-[#146192] text-white px-10 py-2 rounded-full text-lg hover:bg-[#0f4e75] transition">
                  Send
                </button>
              </div>
            </div>

            {/* Right-side image */}
            <div className="hidden lg:block">
              <img src={contactImage} alt="Contact Illustration" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminQueryForm;
