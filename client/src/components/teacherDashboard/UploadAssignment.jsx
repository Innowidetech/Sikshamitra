import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';

function UploadAssignment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.chapter || !formData.file) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('subject', formData.subject);
    uploadData.append('chapter', formData.chapter);
    uploadData.append('photo', formData.file);

    // Make the API call here with uploadData using fetch or axios
    // Example:
    // await fetch('https://sikshamitra.onrender.com/api/student/assignment/:assignmentId', { method: 'POST', body: uploadData })

    alert('Assignment submitted successfully!');
    navigate('/assignments');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-[#146192] mb-6">Upload Assignment</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {/* Chapter Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Chapter</label>
            <select
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Chapter</option>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Chapter 2">Chapter 2</option>
              <option value="Chapter 3">Chapter 3</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Upload File</label>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#146192] text-white px-4 py-2 rounded-md hover:bg-[#0e4a73] transition duration-300"
          >
            <FaUpload />
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadAssignment;
