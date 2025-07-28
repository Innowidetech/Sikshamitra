import React, { useState } from "react";
import { RiFileUploadFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { addSuperAdminStaff } from "../../../redux/superAdmin/superAdminStaffSlice"; // adjust path as needed


const SuperAdminAddStaff = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    employeeType: "",
    name: "",
    mobileNumber: "",
    address: "",
    highestEducation: {
      degree: "",
      university: "",
      city: "",
    },
    designation: "",
    salary: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData((prev) => ({
        ...prev,
        photo: files[0],
      }));
    } else if (["degree", "university", "city"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        highestEducation: {
          ...prev.highestEducation,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file, // ✅ Correctly store file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("email", formData.email);
    submissionData.append("password", formData.password);
    submissionData.append("employeeType", formData.employeeType);
    submissionData.append("name", formData.name);
    submissionData.append("mobileNumber", formData.mobileNumber);
    submissionData.append("address", formData.address);
    submissionData.append("designation", formData.designation);
    submissionData.append("salary", formData.salary);
    submissionData.append(
      "highestEducation[degree]",
      formData.highestEducation.degree
    );
    submissionData.append(
      "highestEducation[university]",
      formData.highestEducation.university
    );
    submissionData.append(
      "highestEducation[city]",
      formData.highestEducation.city
    );

    if (formData.photo) {
      submissionData.append("photo", formData.photo); // ✅ This is good
    }

    dispatch(addSuperAdminStaff(submissionData))
      .unwrap()
      .then(() => {
        toast.success("Staff member added successfully");
        setFormData({
          email: "",
          password: "",
          employeeType: "",
          name: "",
          phone: "",
          address: "",
          highestEducation: { degree: "", university: "", city: "" },
          designation: "",
          salary: "",
          photo: null,
        });
      })
      .catch(() => {
        toast.error("Provide all the details to add staff member.");
      });
  };

  return (
    <div>
      <div className="pb-8">
        <h1 className="text-2xl font-light text-black xl:text-[38px]">staff</h1>
        <hr className="mt-2 border-[#146192] border-[1px] w-[80px]" />
        <h1 className="mt-2 text-sm md:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Add staff</span>
        </h1>
        <h2 className="mt-6 mb-6 text-xl font-semibold text-[#525252]">
          Staff Details
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Login Details */}
        <div className="border shadow rounded-md">
          <div className="bg-[#005077] text-white text-sm font-semibold px-4 py-2 rounded-t-md">
            Login Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-10">
            <div>
              <label className="text-sm pb-2 text-[16px] text-[#303972] mb-2 font-weight-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
              />
            </div>
            <div>
              <label className="text-sm pb-2 text-[16px] text-[#303972] mb-2 font-weight-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            <div>
              <label className="text-sm pb-2 text-[16px] text-[#303972] mb-2 font-weight-600">
                Employee Type
              </label>
              <select
                name="employeeType"
                className="w-full border rounded px-2 py-1 mt-1"
                value={formData.employeeType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="accountant">Accountant</option>
                <option value="blogsManager">Blogs Manager</option>
                <option value="groupD">Staff</option>
              </select>
            </div>
          </div>
        </div>

        {/* Staff Details */}
        <div className="border shadow rounded-md ">
          <div className="bg-[#005077] text-white text-sm font-semibold px-4 py-2 rounded-t-md">
            Staff Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <label className="text-[16px] text-[#303972] mb-2 font-weight-600 ml-4">
                Staff Name *
              </label>
              <input
                type="text"
                name="name"
                className="w-full border rounded px-2 py-1 mt-1 ml-4 "
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="text-[16px] text-[#303972] mb-2 font-weight-600 ml-3 ">
                Phone Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                className="w-full border rounded px-2 py-1 mt-1 ml-3"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+91 xxxxxxx"
              />
            </div>
            <div className="col-span-2 w-full mt-4 p-4">
              <label className="text-[16px] text-[#303972]  font-weight-600 font-medium block mb-2">
                Address *
              </label>
              <textarea
                name="address"
                rows="4"
                className="w-full border rounded px-3 py-2 resize-none"
                value={formData.address}
                onChange={handleChange}
                placeholder="Jakarta, Indonesia"
              ></textarea>
            </div>

            {/* Education Section */}
            <div className="col-span-2 w-full p-8 ">
              <label className="text-sm font-medium block mb-2 text-[16px] text-[#303972] ml-4">
                Highest Education *
              </label>
              <div className="w-full border border-[#005077] rounded-lg p-6">
                <div className="flex flex-col items-start gap-6">
                  <div className="w-[420px]">
                    <label className="text-[16px] text-[#303972] mb-2 font-weight-600 block">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      className="w-full border rounded px-3 py-2"
                      value={formData.highestEducation.degree}
                      onChange={handleChange}
                      placeholder="B.Tech"
                    />
                  </div>
                  <div className="w-[420px]">
                    <label className="text-[16px] text-[#303972] mb-2 font-weight-600 block">
                      University
                    </label>
                    <input
                      type="text"
                      name="university"
                      className="w-full border rounded px-3 py-2"
                      value={formData.highestEducation.university}
                      onChange={handleChange}
                      placeholder="University Name"
                    />
                  </div>
                  <div className="w-[420px]">
                    <label className="text-[16px] text-[#303972] mb-2 font-weight-600 block">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="w-full border rounded px-3 py-2"
                      value={formData.highestEducation.city}
                      onChange={handleChange}
                      placeholder="Place"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="col-span-2">
              <label className="text-[16px] text-[#303972] mb-2 font-semibold block ml-4">
                ID Proof{" "}
                <span className="text-xs text-gray-500">
                  (e.g. Aadhar, PAN, etc.)
                </span>
              </label>
              <label
                htmlFor="photo"
                className="w-full h-24 border border-dashed rounded cursor-pointer flex flex-col justify-center items-center hover:bg-gray-50 transition ml-4"
              >
                <div className="text-gray-400 text-sm flex flex-col items-center">
                  <RiFileUploadFill size={24} />
                  <p>Click to upload or drag and drop</p>
                  {formData.photo && (
                    <p className="text-[12px] text-gray-600 mt-1">
                      Selected: {formData.photo.name}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  id="photo"
                  accept="image/*,application/pdf"
                  name="photo"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {/* Designation & Salary */}
            <div>
              <label className="text-[16px] text-[#303972] mb-2 font-weight-600 ml-4">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                className="w-full border rounded px-2 py-1 mt-1 ml-4"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Teacher"
              />
            </div>
            <div>
              <label className="text-[16px] text-[#303972] mb-2 font-weight-600 ml-3">
                Salary *
              </label>
              <input
                type="number"
                name="salary"
                className="w-full border rounded px-2 py-1 mt-1 mb-5 ml-3"
                value={formData.salary}
                onChange={handleChange}
                placeholder="20000"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#005077] hover:bg-[#003f5c] text-white px-6 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminAddStaff;
