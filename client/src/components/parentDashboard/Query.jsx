import React from 'react';
import Header from './layout/Header';
import contactImage from "../../assets/contact.png";
import { MessageCircle, User } from 'lucide-react';

function Query() {
  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <div className="flex justify-between items-center mx-8 pt-6">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Queries</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Queries</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex justify-between mx-8 mt-8">
        {/* Left Side - Query Related Text and Form */}
        <div className="w-2/3 pr-8">
          <h2 className="text-xl font-semibold text-[#146192] mb-4">Have a question or query?</h2>
          <p className="text-lg text-gray-700 mb-4">
            Please feel free to reach out to us. Fill out the form below and we'll get back to you as soon as possible.
          </p>
          {/* Query Form */}
          <form className="space-y-4">
  {/* Parent Name and Parent Mobile Number */}
  <div className="flex items-center space-x-4">
    <div className="w-1/2">
      <label className="block text-sm font-semibold text-[#146192]" htmlFor="parentName">Parent Name</label>
      <input
        type="text"
        id="parentName"
        className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
        placeholder="Enter parent name"
      />
    </div>
    <div className="w-1/2">
      <label className="block text-sm font-semibold text-[#146192]" htmlFor="parentMobile">Parent Mobile No</label>
      <input
        type="tel"
        id="parentMobile"
        className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
        placeholder="Enter parent mobile number"
      />
    </div>
  </div>

  {/* Student Name and Query Message */}
  <div className=" items-center space-x-4 mt-4">
    <div className="w-1/1">
      <label className="block text-sm font-semibold text-[#146192]" htmlFor="studentName">Student Name</label>
      <input
        type="text"
        id="studentName"
        className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
        placeholder="Enter student name"
      />
    </div>
    <div className="w-1/1">
      <label className="block text-sm font-semibold text-[#146192]" htmlFor="queryMessage">Your Query</label>
      <textarea
        id="queryMessage"
        rows="4"
        className="px-4 py-2 border rounded-lg w-full border-[#00000091] mt-2"
        placeholder="Enter your query here"
      ></textarea>
    </div>
  </div>

  {/* Submit Button */}
  <div className="flex items-center justify-center mt-4">
    <button
      type="submit"
      className="px-6 py-2 bg-[#146192] text-white rounded-md hover:bg-[#0a4e6f]"
    >
      Submit Query
    </button>
  </div>
</form>

        </div>

        {/* Right Side - Image and Contact Information */}
        <div className="w-1/2">
          <img
             src={contactImage}  // Use the imported image // Placeholder image, replace with your own
            alt="Query image"
            className="w-full h-auto rounded-lg mb-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-[#146192] mb-2">Contact Information</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Location:</strong> 1234 Main Street, City, Country
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Email:</strong> support@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Query;
