import React, { useState, useEffect, useRef } from 'react';
import Header from '../adminStaffDashboard/layout/Header';
import {useDispatch,useSelector} from 'react-redux';
import {
  fetchSchoolNames,
  updateFormField,
  toggleSchoolSelection,
  submitQuery,
  resetForm
} from '../../redux/superAdminStaff/superAdminStaffQuerySlice';

import contactImage from '../../assets/contact1.png';


const SuperAdminStaffSendQuery = () => {
  // const [form, setForm] = useState({
  //   name: '',
  //   contact: '',
  //   email: '',
  //   schools: [],
  //   message: '',
  // });

 const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

 const handleChange = (e) => {
  dispatch(updateFormField({ field: e.target.name, value: e.target.value }));
};

  
  const {form, schoolNames  } = useSelector((state) => state.superAdminStaffSendQuery);

 const handleRecipientToggle = (name) => {
  dispatch(toggleSchoolSelection(name));
};

  useEffect(() => {
   dispatch(fetchSchoolNames());
  }, [dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitQuery(form));
      if (submitQuery.fulfilled.match(resultAction)) {
    dispatch(resetForm());
    alert('Query submitted successfully!');
  } else {
    alert('Something went wrong while submitting the query.');
  }
  };

 // const schoollist = ['Khusan Akhmedov,street no 2 Abc colony, Hyderabad','Rise High School,yz colony,Delhi','Ion E-Techno School,Shanthi Nagar','Rise up School,ghyt colony,Delhi'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      {/* Top Header */}
      <Header />

      <div className="p-4 md:p-6">
        {/* Breadcrumb Section */}
        <div className="flex justify-between items-center mx-8 py-6 md:ml-64 pt-10">
          <div className="inline-block">
            <h1 className="text-xl font-light text-black xl:text-[32px]">Staff Query</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> {'>'}{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Send Query
              </span>
            </h1>
          </div>
        </div>

        {/* Form + Image Card Section */}
        <div className="md:ml-64 max-w-5xl mx-auto pt-7">
          <h2 className="text-xl text-[#003049] font-semibold mb-2">Contact Us for Any Query!</h2>
          <p className="text-sm text-gray-600 mb-4">We are here for you! How can we help?</p>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">Staff Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">Contact</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-gray-700 text-sm mb-1">Email ID</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              </div>
               {/* Role and recipient select */}
              <div className="flex flex-wrap gap-4 items-start">
                <label className="flex items-center text-sm gap-1">
                  School List
                </label>

                {/* Dropdown for school list */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="border px-4 py-2 rounded bg-white shadow text-sm w-44 text-left"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      {form.sendTo.length > 0
                        ? `${form.sendTo.length} Selected`
                        : 'Select schools'}
                    </button>
                    {showDropdown && (
                      <div className="absolute mt-1 border rounded bg-white max-h-40 overflow-y-auto text-sm w-44 shadow z-10">
{schoolNames.map((school, i) => (
  <label key={i} className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full sm:w-76 md:w-86 lg:w-104">
    <input
      type="checkbox"
      checked={Array.isArray(form.sendTo) && form.sendTo.some(s => s.schoolCode === school.schoolCode)}
      onChange={() => handleRecipientToggle(school)} // pass full object
    />
    <div>
      <div className="font-semibold">{school.schoolName}</div>
      <div className="text-xs text-gray-600">{school.location}</div>
    </div>
  </label>
))}
                      </div>
                    )}
                  </div>
             
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Query</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>

              

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1da1f2] hover:bg-[#0d8de1] text-white rounded font-medium"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Image Section */}
            <div className="hidden md:block w-[250px]">
              <img
                src={contactImage}
                alt="Contact illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminStaffSendQuery;















