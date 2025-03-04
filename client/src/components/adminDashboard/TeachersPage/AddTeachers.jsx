import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addTeacherAsync } from '../../../redux/teachersSlice';

function AddTeacherModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    employeeType: '',
    profile: {
      fullname: '',
      phoneNumber: '',
      gender: '',
      class: '',
      section: '',
      subjects: [],
      photo: null,
      address: '',
      dob: '',
      pob: '',
      employeeId: '',
      salary: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    },
    education: [{
      university: '',
      degree: '',
      startDate: '',
      endDate: '',
      city: ''
    }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [name]: value } : edu
      )
    }));
  };

  const handleSubjectsChange = (e) => {
    const subjects = e.target.value.split(',').map(subject => subject.trim());
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        subjects
      }
    }));
  };

  const handlePhotoChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        photo: e.target.files[0]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields based on employeeType
      if (formData.employeeType === 'teaching') {
        if (!formData.profile.class || !formData.profile.section || formData.profile.subjects.length === 0) {
          toast.error('Class, section, and subjects are required for teaching staff!');
          return;
        }
      }

      const resultAction = await dispatch(addTeacherAsync(formData)).unwrap();
      toast.success('Teacher added successfully!');
      setFormData({
        email: '',
        password: '',
        employeeType: '',
        profile: {
          fullname: '',
          phoneNumber: '',
          gender: '',
          class: '',
          section: '',
          subjects: [],
          photo: null,
          address: '',
          dob: '',
          pob: '',
          employeeId: '',
          salary: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          accountHolderName: ''
        },
        education: [{
          university: '',
          degree: '',
          startDate: '',
          endDate: '',
          city: ''
        }]
      });
      onClose();
    } catch (error) {
      toast.error('Failed to add teacher!');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="min-h-screen px-4 py-6 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-3xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Employee</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[80vh]">
              {/* Login Details */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">Login Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Employee Type</label>
                    <select
                      required
                      name="employeeType"
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.employeeType}
                      onChange={handleChange}
                    >
                      <option value="">Select Employee Type</option>
                      <option value="teaching">Teaching</option>
                      <option value="accountant">Accountant</option>
                      <option value="librarian">Librarian</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Full Name</label>
                    <input
                      type="text"
                      name="profile.fullname"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Phone Number</label>
                    <input
                      type="tel"
                      name="profile.phoneNumber"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Gender</label>
                    <select
                      required
                      name="profile.gender"
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Employee ID</label>
                    <input
                      type="text"
                      name="profile.employeeId"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.employeeId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#303972]">Address</label>
                    <textarea
                      name="profile.address"
                      required
                      rows={3}
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Date of Birth</label>
                    <input
                      type="date"
                      name="profile.dob"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Place of Birth</label>
                    <input
                      type="text"
                      name="profile.pob"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.pob}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Photo</label>
                    <input
                      type="file"
                      name="photo"
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>
              </div>

              {/* Teaching Details - Only shown for teaching staff */}
              {formData.employeeType === 'teaching' && (
                <div className="p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-[#303972] mb-4">Teaching Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#303972]">Class</label>
                      <input
                        type="text"
                        name="profile.class"
                        required
                        className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                        value={formData.profile.class}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#303972]">Section</label>
                      <input
                        type="text"
                        name="profile.section"
                        required
                        className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                        value={formData.profile.section}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#303972]">
                        Subjects (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="subjects"
                        required
                        placeholder="Math, Science, English"
                        className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                        value={formData.profile.subjects.join(', ')}
                        onChange={handleSubjectsChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Details */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Bank Name</label>
                    <input
                      type="text"
                      name="profile.bankName"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.bankName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Account Number</label>
                    <input
                      type="text"
                      name="profile.accountNumber"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.accountNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">IFSC Code</label>
                    <input
                      type="text"
                      name="profile.ifscCode"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.ifscCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Account Holder Name</label>
                    <input
                      type="text"
                      name="profile.accountHolderName"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.accountHolderName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Salary</label>
                    <input
                      type="number"
                      name="profile.salary"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.profile.salary}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">Education</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">University</label>
                    <input
                      type="text"
                      name="university"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.education[0].university}
                      onChange={(e) => handleEducationChange(e, 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.education[0].degree}
                      onChange={(e) => handleEducationChange(e, 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.education[0].startDate}
                      onChange={(e) => handleEducationChange(e, 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.education[0].endDate}
                      onChange={(e) => handleEducationChange(e, 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.education[0].city}
                      onChange={(e) => handleEducationChange(e, 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 text-[#285A87] border rounded-md">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default AddTeacherModal;