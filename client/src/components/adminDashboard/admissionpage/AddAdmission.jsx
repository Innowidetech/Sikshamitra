import React, { useState } from 'react';

const AddAdmission = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    studentProfile: {
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      address: '',
      registrationNumber: '',
      class: '',
      section: '',
      classType: '',
      fees: ''
    },
    photo: '',
    parentUsername: '',
    parentEmail: '',
    parentPassword: '',
    parentProfile: {
      fatherName: '',
      fatherPhoneNumber: '',
      fatherOccupation: '',
      fatherAddress: '',
      motherName: '',
      motherPhoneNumber: '',
      motherOccupation: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('studentProfile[')) {
      const field = name.replace('studentProfile[', '').replace(']', '');
      setFormData((prev) => ({
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
          [field]: value
        }
      }));
    } else if (name.includes('parentProfile[')) {
      const field = name.replace('parentProfile[', '').replace(']', '');
      setFormData((prev) => ({
        ...prev,
        parentProfile: {
          ...prev.parentProfile,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Add New Student</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[firstName]"
                  placeholder="First Name"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[lastName]"
                  placeholder="Last Name"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <select
                  name="studentProfile[gender]"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  type="date"
                  name="studentProfile[dob]"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[address]"
                  placeholder="Address"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[registrationNumber]"
                  placeholder="Registration Number"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[class]"
                  placeholder="Class"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[section]"
                  placeholder="Section"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="studentProfile[classType]"
                  placeholder="Class Type"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="studentProfile[fees]"
                  placeholder="Fees"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="file"
                  name="photo"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Parent Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Parent/Guardian Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="parentUsername"
                  placeholder="Parent Username"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="parentEmail"
                  placeholder="Parent Email"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="parentPassword"
                  placeholder="Parent Password"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="parentProfile[fatherName]"
                  placeholder="Father's Name / Guardian"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  name="parentProfile[fatherPhoneNumber]"
                  placeholder="Father's Phone / Guardian"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="parentProfile[fatherOccupation]"
                  placeholder="Father's Occupation / Guardian"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="parentProfile[fatherAddress]"
                  placeholder="Father's Address / Guardian"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="parentProfile[motherName]"
                  placeholder="Mother's Name (Optional)"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  name="parentProfile[motherPhoneNumber]"
                  placeholder="Mother's Phone (Optional)"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="parentProfile[motherOccupation]"
                  placeholder="Mother's Occupation (Optional)"
                  className="border rounded-lg px-4 py-2"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdmission;
