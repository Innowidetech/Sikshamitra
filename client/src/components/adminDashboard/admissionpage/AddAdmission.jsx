import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createStudentAndParent,  fetchExistingStudents, createStudentForExistingParent } from '../../../redux/admission'; // adjust path as needed

const AddAdmission = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
 const { loading, error, existingStudents = [] } = useSelector((state) => state.admissions);

  const [className, setClassName] = useState('');
const [section, setSection] = useState('');
const [selectedStudentName, setSelectedStudentName] = useState('');

useEffect(() => {
  if (selectedStudentName) {
    const selected = existingStudents.find((stu) => stu._id === selectedStudentName);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        email: selected.email || '',
        studentProfile: {
          ...prev.studentProfile,
          ...selected.studentProfile
        }
      }));
    }
  }
}, [selectedStudentName, existingStudents]);



  const [formMode, setFormMode] = useState('new');

 const [formData, setFormData] = useState({
  email: '',
  password: '',
 studentProfile: {
  fullName: '',
  gender: '',
  dob: '',
  registrationNumber: '',
  class: '',
  section: '',
  classType: '',
  address: '', // 👈 add this
},

  photo: '',
  parentProfile: {
    parentEmail: '',
    parentPassword: '',
    priority: '',
    fatherName: '',
    fatherPhoneNumber: '',
    fatherOccupation: '',
    motherName: '',
    motherPhoneNumber: '',
    motherOccupation: '',
    residentialAddress: '',
  },
});

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        photo: files[0],
      }));
    } else if (name.includes('studentProfile[')) {
      const key = name.replace('studentProfile[', '').replace(']', '');
      setFormData((prev) => ({
        ...prev,
        studentProfile: { ...prev.studentProfile, [key]: value },
      }));
    } else if (name.includes('parentProfile[')) {
      const key = name.replace('parentProfile[', '').replace(']', '');
      setFormData((prev) => ({
        ...prev,
        parentProfile: { ...prev.parentProfile, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the payload with FormData for photo upload
    const payload = new FormData();
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('parentEmail', formData.parentEmail);
    payload.append('parentPassword', formData.parentPassword);
    payload.append('studentProfile', JSON.stringify(formData.studentProfile));
    payload.append('parentProfile', JSON.stringify(formData.parentProfile));
    if (formData.photo) {
      payload.append('photo', formData.photo);
    }

    await dispatch(createStudentAndParent(payload));
    onClose();
  };

const handleSearchStudents = () => {
  if (!className || !section) {
    alert("Please select class and section");
    return;
  }

  setFormMode('existing'); // lock it
  dispatch(fetchExistingStudents({ class: className, section }));
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-blue-800">Application Form For Admission</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
          </div>

          {/* Toggle Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFormMode('new')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${formMode === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              New Student & Parent
            </button>
            <button
              onClick={() => setFormMode('existing')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${formMode === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Add Student for Existing Parent
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formMode === 'new' ? (
              <>
                {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input type="email" name="email" placeholder="Student Email" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <input type="password" name="password" placeholder="Student Password" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <input type="text" name="studentProfile[fullName]" placeholder="Full Name" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <input type="date" name="studentProfile[dob]" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <select name="studentProfile[gender]" className="border rounded-lg px-4 py-2" onChange={handleInputChange}>
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
  <input type="text" name="studentProfile[registrationNumber]" placeholder="Registration Number" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <input type="text" name="studentProfile[class]" placeholder="Class" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <input type="text" name="studentProfile[section]" placeholder="Section" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  <select name="studentProfile[classType]" className="border rounded-lg px-4 py-2" onChange={handleInputChange}>
    <option value="">Class Type</option>
    <option value="primary">Primary</option>
    <option value="secondary">Secondary</option>
  </select>
  <input type="file" name="photo" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
</div>


                {/* Parent Info */}
          <div className="space-y-4">
  <h4 className="font-medium text-lg">Parent/Guardian Information</h4>

  {/* Father's Section with Email/Password/Priority */}
  <h5 className="font-semibold text-md text-gray-700">Father / Guardian Information</h5>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input type="email" name="parentProfile[parentEmail]" placeholder="Email (of Father/Guardian)" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="password" name="parentProfile[parentPassword]" placeholder="Password (for Login)" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <select name="parentProfile[priority]" className="border rounded-lg px-4 py-2" onChange={handleInputChange}>
      <option value="">Select Priority</option>
      <option value="father">Father</option>
      <option value="mother">Mother</option>
      <option value="guardian">Guardian</option>
    </select>
    <input type="text" name="parentProfile[fatherName]" placeholder="Father's/Guardian's Name" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="parentProfile[fatherPhoneNumber]" placeholder="Phone Number" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="parentProfile[fatherOccupation]" placeholder="Occupation" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  </div>

  {/* Mother's Section */}
  <h5 className="font-semibold text-md text-gray-700 mt-4">Mother's Information</h5>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input type="text" name="parentProfile[motherName]" placeholder="Mother's Name" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="parentProfile[motherPhoneNumber]" placeholder="Mother's Phone Number" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="parentProfile[motherOccupation]" placeholder="Mother's Occupation" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
  </div>

  {/* Residential Address */}
  <div className="mt-4">
    <input type="text" name="parentProfile[residentialAddress]" placeholder="Residential Address (Parent/Guardian)" className="w-full border rounded-lg px-4 py-2" onChange={handleInputChange} />
  </div>
</div>

              </>
            ) : (
              <>
  {/* Top Filters: Class, Section, Search, Select Student */}
<div className="flex flex-wrap items-center gap-4 mb-6">
  {/* Class Dropdown */}
  <select
    value={className}
    onChange={(e) => setClassName(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="">Class</option>
    {[...Array(12)].map((_, i) => (
      <option key={i + 1} value={i + 1}>{i + 1}</option>
    ))}
  </select>

  {/* Section Dropdown */}
  <select
    value={section}
    onChange={(e) => setSection(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="">Section</option>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
  </select>

  {/* Search Button & Student Dropdown */}
<div className="flex items-center gap-4">
  <button
  type="button" // not submit
  onClick={handleSearchStudents}
  className="bg-blue-600 text-white px-3 py-2 rounded-full text-lg"
>
  🔍
</button>

 {/* Select Student Dropdown: only show after search and if data exists */}
{existingStudents.length > 0 && (
  <select
    value={selectedStudentName}
    onChange={(e) => setSelectedStudentName(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="">Select Student</option>
    {existingStudents.map((student) => (
      <option key={student._id} value={student._id}>
        {student.studentProfile.fullName}
      </option>
    ))}
  </select>
)}

</div>
</div>



  {/* Existing Student Form */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#e6eff6] p-6 rounded-xl">
    <input type="text" name="studentProfile[fullName]" placeholder="Full name" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="email" name="email" placeholder="Student Email-ID" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="email" name="parentEmail" placeholder="Parent Email-ID" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="studentProfile[registrationNumber]" placeholder="Registration Number" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />

    <select name="studentProfile[gender]" className="border rounded-lg px-4 py-2" onChange={handleInputChange}>
      <option value="">Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>

    <input type="date" name="studentProfile[dob]" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="studentProfile[class]" placeholder="Class" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="studentProfile[section]" placeholder="Section" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />

    <select name="studentProfile[classType]" className="border rounded-lg px-4 py-2" onChange={handleInputChange}>
      <option value="">Class Type</option>
      <option value="primary">Primary</option>
      <option value="secondary">Secondary</option>
    </select>

    <input type="password" name="password" placeholder="Student Password" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />
    <input type="text" name="studentProfile[address]" placeholder="Address" className="border rounded-lg px-4 py-2" onChange={handleInputChange} />

    <input type="file" name="photo" accept=".pdf,.doc,.docx,.jpg,.png" className="border rounded-lg px-4 py-2 text-red-600" onChange={handleInputChange} />
  </div>

  {/* Register Button */}
  <div className="flex justify-center mt-6">
    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Register
    </button>
  </div>
</>

            )}

            {/* Submit buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          {/* Show error if any */}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddAdmission;
