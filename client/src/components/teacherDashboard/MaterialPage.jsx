import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStudyMaterial, resetCreateStatus } from '../../redux/teacher/studyMSlice';
import Header from '../adminDashboard/layout/Header';

const MaterialPage = () => {
  const dispatch = useDispatch();
  const { createStatus, error } = useSelector((state) => state.studyMaterial);

  const [formData, setFormData] = useState({
    subject: '',
    classs: '',
    chapter: '',
    section: '',
    photo: null, // This holds the file to send under the "photo" key
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0], // Get the first selected file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const uploadData = new FormData();
    uploadData.append('subject', formData.subject);
    uploadData.append('classs', formData.classs);
    uploadData.append('chapter', formData.chapter);
    uploadData.append('section', formData.section);
    uploadData.append('photo', formData.photo); // Correct key for backend

    dispatch(createStudyMaterial(uploadData));
  };

  const handleResetStatus = () => {
    dispatch(resetCreateStatus());
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 mt-20 md:ml-60">
        <div className="flex justify-between items-center mx-8">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">Study Material</h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xl">Home</span> {'>'}
              <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Study Material</span>
            </h1>
          </div>
          <Header />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 mt-20 md:ml-72">Upload Study Material</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md md:ml-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md bg-[#14619278]"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Chapter</label>
            <input
              type="text"
              name="chapter"
              value={formData.chapter}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md bg-[#14619278]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block font-medium mb-2">Class</label>
            <input
              type="text"
              name="classs"
              value={formData.classs}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md bg-[#14619278]"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md bg-[#14619278]"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-2 font-medium">Upload File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-red-400 rounded-md"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-[#146192] hover:bg-[#0e4b71] text-white font-semibold py-3 rounded-md"
            disabled={createStatus === 'pending'}
          >
            {createStatus === 'pending' ? 'Uploading...' : 'Upload Material'}
          </button>
        </div>
      </form>

      {createStatus === 'success' && (
        <div className="mt-4 text-green-500 text-center">
          Material uploaded successfully!
        </div>
      )}

      {createStatus === 'failed' && (
        <div className="mt-4 text-red-500 text-center">
          {error || 'Failed to upload material'}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleResetStatus}
          className="text-blue-500 underline mt-4"
        >
          Reset Upload Status
        </button>
      </div>
    </>
  );
};

export default MaterialPage;
