import React, { useState, useEffect } from 'react';
import { SectionHeader } from './common/SectionHeader';

const ParentForm = ({ onNext, onBack, formData, updateFormData }) => {
  const [localFormData, setLocalFormData] = useState({
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    email: '',
    address: '',
    aadharCard: null,
    voterId: null,
    panCard: null,
    ...formData,
  });

  // Handle input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change (for document uploads)
  const handleFileChange = (name, e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(localFormData);
    onNext();
  };

  return (
    <div className="p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto" style={{ fontFamily: 'Poppins' }}>
      <SectionHeader title="PARENTS DETAILS" />

      <form onSubmit={handleSubmit} className="md:max-w-xl lg:max-w-3xl xl:max-w-5xl space-y-6 text-[#1982C4]">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Father's Name*</label>
            <input
              type="text"
              name="fatherName"
              value={localFormData.fatherName}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter father's name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Mother's Name*</label>
            <input
              type="text"
              name="motherName"
              value={localFormData.motherName}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter mother's name"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Father's Phone*</label>
            <input
              type="tel"
              name="fatherPhone"
              value={localFormData.fatherPhone}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Mother's Phone*</label>
            <input
              type="tel"
              name="motherPhone"
              value={localFormData.motherPhone}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              value={localFormData.email}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Address*</label>
            <textarea
              name="address"
              value={localFormData.address}
              onChange={handleInputChange}
              required
              className="w-full border rounded p-2 h-20"
              placeholder="Enter complete address"
            />
          </div>
        </div>

        {/* <div className="lg:w-[480px]">
          <label className="block text-sm mb-3 lg:text-lg font-semibold">Upload Documents*</label>
          <div className="md:flex gap-4 bg-[#1982C440] rounded-xl py-4">
            {['aadharCard', 'voterId', 'panCard'].map((docType) => (
              <div key={docType} className="p-4 text-center mt-2 md:mt-0">
                <p className="text-sm mb-2 font-extrabold text-[#146192] py-2">{docType.replace(/([A-Z])/g, ' $1')}</p>
                <hr className="border border-black w-[60px] -translate-y-4 translate-x-10" />
                <input
                  type="file"
                  required={!localFormData.documents.some((doc) => doc.name === docType)}
                  className="hidden"
                  id={docType}
                  onChange={(e) => handleFileChange(docType, e)}
                />
                <label
                  htmlFor={docType}
                  className="text-[#1982C4] text-xs p-1 lg:p-2 cursor-pointer rounded-full bg-white border-[#1982C4] border"
                >
                  {localFormData.documents.find((doc) => doc.name === docType)
                    ? localFormData.documents.find((doc) => doc.name === docType).url.name
                    : `Upload ${docType.replace(/([A-Z])/g, ' $1')}`}
                </label>
              </div>
            ))}
          </div>
        </div> */}

<div className="grid md:grid-cols-3 gap-6 bg-[#1982C440] rounded-xl py-6 lg:w-[480px] px-4">
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Upload Aadhar Card*</label>
            <input
              type="file"
              name="aadharCard"
              accept="application/pdf, image/*"
              onChange={(e) => handleFileChange('aadharCard', e)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Upload Voter ID*</label>
            <input
              type="file"
              name="voterId"
              accept="application/pdf, image/*"
              onChange={(e) => handleFileChange('voterId', e)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 lg:text-lg font-semibold">Upload Pan Card*</label>
            <input
              type="file"
              name="panCard"
              accept="application/pdf, image/*"
              onChange={(e) => handleFileChange('panCard', e)}
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-[#1982C4] rounded-full hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#1982C4] text-white rounded-full"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParentForm;
