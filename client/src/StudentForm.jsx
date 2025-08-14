import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentForm = ({ onNext, formData, updateFormData }) => {
  const [localFormData, setLocalFormData] = useState({
    examId: '',
    resultPercentage: '',
    studentAddress: '',
    placeOfBirth: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    parentAddress: '',
    parentEmail: '', // ✅ New email field
    aadharCard: null,
    panCard: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayClick = (e) => {
    e.preventDefault();
    navigate("/payment-form");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    updateFormData({ [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: file
      }));
      updateFormData({ [name]: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      const studentDetails = {
        examId: localFormData.examId,
        resultPercentage: localFormData.resultPercentage,
        address: localFormData.studentAddress,
        placeOfBirth: localFormData.placeOfBirth
      };

      const parentDetails = {
        fatherName: localFormData.fatherName,
        fatherPhone: localFormData.fatherPhone,
        motherName: localFormData.motherName,
        motherPhone: localFormData.motherPhone,
        address: localFormData.parentAddress,
        email: localFormData.parentEmail
      };

      data.append('studentDetails', JSON.stringify(studentDetails));
      data.append('parentDetails', JSON.stringify(parentDetails));
      data.append('applicationFee', 0);

      if (localFormData.aadharCard) data.append('aadharCard', localFormData.aadharCard);
      if (localFormData.panCard) data.append('panCard', localFormData.panCard);

      const response = await axios.post(
        "https://sikshamitra.onrender.com/api/user/applyOnline",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Application submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        onNext();
      } else {
        toast.error("Failed to submit application. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting form", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Banner Header */}
      <div className="w-full bg-[#FF9F1C] md:px-12 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0 shadow-md">
        <h1 className="text-white text-lg sm:text-xl md:text-3xl font-semibold text-center md:ml-16">
          Online Application Form
        </h1>
        <img
          src="src/assets/entrance-banner.png"
          alt="Entrance Exam"
          className="h-40 sm:h-24 md:h-40 object-contain"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto space-y-8"
        style={{ fontFamily: 'Poppins' }}
      >
        {/* STUDENT DETAILS */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#146192] text-white p-3 rounded-t-lg">
            <h2 className="text-lg lg:text-2xl font-semibold">STUDENT DETAILS</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Exam ID*</label>
                <input
                  type="text"
                  name="examId"
                  value={localFormData.examId}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Exam Percentage*</label>
                <input
                  type="number"
                  name="resultPercentage"
                  value={localFormData.resultPercentage}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1982C4]">Address*</label>
              <textarea
                name="studentAddress"
                value={localFormData.studentAddress}
                onChange={handleInputChange}
                className="w-full border rounded p-2 border-[#C1BBEB] h-20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1982C4]">Place of Birth*</label>
              <input
                type="text"
                name="placeOfBirth"
                value={localFormData.placeOfBirth}
                onChange={handleInputChange}
                className="w-full border rounded p-2 border-[#C1BBEB]"
                required
              />
            </div>
          </div>
        </div>

        {/* PARENTS DETAILS */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#146192] text-white p-3 rounded-t-lg">
            <h2 className="text-lg lg:text-2xl font-semibold">PARENTS DETAILS</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Father's Name*</label>
                <input
                  type="text"
                  name="fatherName"
                  value={localFormData.fatherName}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Mother's Name*</label>
                <input
                  type="text"
                  name="motherName"
                  value={localFormData.motherName}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Father's Phone*</label>
                <input
                  type="tel"
                  name="fatherPhone"
                  value={localFormData.fatherPhone}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Mother's Phone*</label>
                <input
                  type="tel"
                  name="motherPhone"
                  value={localFormData.motherPhone}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Parent Address*</label>
                <textarea
                  name="parentAddress"
                  value={localFormData.parentAddress}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB] h-20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1982C4]">Parent Email*</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={localFormData.parentEmail}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-[#C1BBEB]"
                  required
                />
              </div>
            </div>

            {/* Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4 text-center shadow-sm">
                <p className="underline font-medium mb-3">Aadhar Card</p>
                <label className="cursor-pointer inline-block px-4 py-2 rounded bg-[#146192] text-white hover:bg-blue-600">
                  Upload PDF/Doc
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    name="aadharCard"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {localFormData.aadharCard && (
                  <p className="mt-2 text-sm text-green-600">{localFormData.aadharCard.name}</p>
                )}
              </div>

              <div className="border rounded-lg p-4 text-center shadow-sm">
                <p className="underline font-medium mb-3">PAN Card</p>
                <label className="cursor-pointer inline-block px-4 py-2 rounded bg-[#146192] text-white hover:bg-blue-600">
                  Upload PDF/Doc
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    name="panCard"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {localFormData.panCard && (
                  <p className="mt-2 text-sm text-green-600">{localFormData.panCard.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-full text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1982C4]'
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handlePayClick}
            className="px-6 py-2 bg-[#1982C4] text-white rounded-full"
          >
            Pay
          </button>
        </div>
      </form>
    </>
  );
};

export default StudentForm;
