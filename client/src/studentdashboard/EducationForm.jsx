import React, { useState, useEffect } from 'react';
import { SectionHeader } from './common/SectionHeader';

const EducationForm = ({ onNext, onBack, formData, updateFormData }) => {
  const [sections, setSections] = useState([{
    school: '',
    class: '',
    startDate: '',
    endDate: '',
    city: '',
    educationDocuments: null
  }]);

  useEffect(() => {
    if (formData && formData.length > 0) {
      setSections(formData);
    }
  }, [formData]);

  const handleAddSection = () => {
    setSections([...sections, {
      school: '',
      class: '',
      startDate: '',
      endDate: '',
      city: '',
      educationDocuments: null
    }]);
  };

  const handleRemoveSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleInputChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setSections(newSections);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange(index, 'educationDocuments', file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(sections);
    onNext();
  };

  return (
    <div className="p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto" style={{ fontFamily: 'Poppins' }}>
      <SectionHeader title="EDUCATION DETAILS" />
      <h1 className="text-[#1982C4] font-semibold text-lg md:text-xl">ADD SCHOOL</h1>
      <hr className="w-32 border-[#1982C4] mb-4" />

      <form onSubmit={handleSubmit} className="md:max-w-xl lg:max-w-3xl xl:max-w-5xl space-y-6 text-[#1982C4]">
        {sections.map((section, index) => (
          <div key={index} className="space-y-6">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">Section {index + 1}</div>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(index)}
                  className="text-red-500 text-sm cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1 font-semibold lg:text-lg">School*</label>
                <input
                  type="text"
                  value={section.school}
                  onChange={(e) => handleInputChange(index, 'school', e.target.value)}
                  required
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-semibold lg:text-lg">Class*</label>
                <input
                  type="text"
                  value={section.class}
                  onChange={(e) => handleInputChange(index, 'class', e.target.value)}
                  required
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                />
              </div>
            </div>

            <div className="md:flex md:gap-6">
              <div>
                <label className="block text-sm mb-1 font-semibold lg:text-lg">Start Date *</label>
                <input
                  type="date"
                  value={section.startDate}
                  onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                  required
                  className="w-full border rounded p-2 border-[#C1BBEB] md:w-[150px] lg:w-[200px] xl:w-[300px]"
                />
              </div>
              <div className="md:mt-0">
                <label className="block text-sm mb-1 font-semibold lg:text-lg">End Date *</label>
                <input
                  type="date"
                  value={section.endDate}
                  onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                  required
                  className="w-full border rounded p-2 border-[#C1BBEB] md:w-[150px] lg:w-[250px] xl:w-[300px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">City *</label>
              <input
                type="text"
                value={section.city}
                onChange={(e) => handleInputChange(index, 'city', e.target.value)}
                required
                className="w-full border rounded p-2 border-[#C1BBEB] md:w-[270px] lg:w-[420px] xl:w-[620px]"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-semibold lg:text-lg">Upload Documents*</label>
              <div className="border-2 rounded-lg p-4 text-center border-[#C1BBEB] md:w-[300px] lg:w-[420px] xl:w-[620px]">
                <p className="text-sm text-gray-500">Upload your files here</p>
                <input
                  type="file"
                  name="educationDocuments"
                  required={!section.educationDocuments}
                  className="hidden"
                  id={`education-docs-${index}`}
                  onChange={(e) => handleFileChange(index, e)}
                />
                <label
                  htmlFor={`education-docs-${index}`}
                  className="text-blue-600 text-sm mt-2 cursor-pointer inline-block"
                >
                  {section.educationDocuments ? section.educationDocuments.name : 'Choose File'}
                </label>
              </div>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={handleAddSection}
            className="px-6 py-2 bg-[#1982C4] border rounded-full text-white"
          >
            Add Section +
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border-[#1982C4] border rounded-full hover:bg-gray-50"
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

export default EducationForm;