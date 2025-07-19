import React, { useState } from "react";
import { X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function AddStudent({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    // username: "",
    email: "",
    password: "",
    // parentUsername: "",
    parentEmail: "",
    parentPassword: "",
    // firstName: "",
    // lastName: "",
    fullname: "",
    gender: "",
    dob: "",
    photo: null,
    address: "",
    registrationNumber: "",
    class: "",
    section: "",
    classType: "",
    // fees: "",

    fatherName: "",
    motherName: "",
    fatherPhoneNumber: "",
    motherPhoneNumber: "",
    fatherOccupation: "",
    motherOccupation: "",
    parentAddress: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const studentData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        studentProfile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          dob: formData.dob,
          photo: formData.photo,
          address: formData.address,
          registrationNumber: formData.registrationNumber,
          class: formData.class,
          section: formData.section,
          classType: formData.classType,
          fees: formData.fees,
        },
        parentUsername: formData.parentUsername,
        parentEmail: formData.parentEmail,
        parentPassword: formData.parentPassword,
        parentProfile: {
          fatherName: formData.fatherName,
          fatherPhoneNumber: formData.fatherPhoneNumber,
          fatherOccupation: formData.fatherOccupation,
          fatherAddress: formData.fatherAddress,
          motherName: formData.motherName,
          motherPhoneNumber: formData.motherPhoneNumber,
          motherOccupation: formData.motherOccupation,
        },
      };

      // Prepare FormData to send data to backend
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(studentData));

      // Append the photo file separately if it exists
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      // Send the POST request to the API
      const response = await axios.post(
        "https://sikshamitra.onrender.com/api/admin/registersp",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check for success and show appropriate message
      if (response.status === 200) {
        toast.success("Student added successfully!");
        setFormData({
          // Reset form data
        });
        onAdd(response.data); // Pass the response data to onAdd
        onClose(); // Close the modal
      } else {
        toast.error("Failed to add student!");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="min-h-screen px-4 py-6 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-3xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Student
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 overflow-y-auto max-h-[80vh]"
            >
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">
                  Student Login Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Parent Login Details */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">
                  Parent Login Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.parentUsername}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentUsername: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.parentEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.parentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Student Profile */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">
                  Student Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Gender
                    </label>
                    <select
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Photo
                    </label>
                    <input
                      type="file"
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.files[0] })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Class
                    </label>
                    <input
                      type="number"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.class}
                      onChange={(e) =>
                        setFormData({ ...formData, class: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Section
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Class Type
                    </label>
                    <select
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.classType}
                      onChange={(e) =>
                        setFormData({ ...formData, classType: e.target.value })
                      }
                    >
                      <option value="">Select class type</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Fees
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.fees}
                      onChange={(e) =>
                        setFormData({ ...formData, fees: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Parent Profile */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#303972] mb-4">
                  Parent Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.fatherName}
                      onChange={(e) =>
                        setFormData({ ...formData, fatherName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.motherName}
                      onChange={(e) =>
                        setFormData({ ...formData, motherName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Father's Phone
                    </label>
                    <input
                      type="tel"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.fatherPhoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fatherPhoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Mother's Phone
                    </label>
                    <input
                      type="tel"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.motherPhoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          motherPhoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Father's Occupation
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.fatherOccupation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fatherOccupation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#303972]">
                      Mother's Occupation
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.motherOccupation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          motherOccupation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#303972]">
                      Father's Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="mt-1 p-2 block w-full rounded-md border border-[#C1BBEB]"
                      value={formData.fatherAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fatherAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#285A87] rounded-md hover:bg-[#1e4569]"
                >
                  Add Student
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

export default AddStudent;
