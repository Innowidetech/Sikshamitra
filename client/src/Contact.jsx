import React, { useState } from 'react';
import ContactNavimg from './assets/contactnavimg.png';
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoMail } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { firstName, lastName, email, phoneNumber, message } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('https://sikshamitra.onrender.com/api/user/contactUs', formData);
      
      if (response.status === 200) {
        toast.success('Message sent successfully! We will get back to you soon.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setSubmitted(true);

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending message. Please try again later.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="xl:min-w-[1440px] bg-[#FF9F1C] xl:mt-[30px] mt-[20px] flex flex-col xl:flex-row overflow-hidden max-w-full">
        <div className="p-4 xl:p-0 text-white md:flex md:flex-col md:justify-center  xl:ml-[69px] xl:w-[50%] order-2 xl:-translate-y-10">
          <h1 className="md:text-[16px] text-xs flex md:grid md:justify-start">
            HOME / ADMISSION
          </h1>
          <h3 className="md:text-[68px] font-medium text-xl md:mt-4 xl:mt-0 grid xl:grid md:justify-start">
            <span className="block xl:mt-6">CONTACT US</span>
          </h3>
        </div>

        <div className="xl:w-[600px] xl:h-[262px] flex justify-end order-2 md:-translate-y-10 xl:translate-y-0">
          <img
            src={ContactNavimg}
            alt="ContactNavimg"
            className="xl:max-w-full h-[200px] xl:ml-0 ml-4 max-w-full xl:h-[350px] xl:-translate-y-8 rotate-6"
          />
        </div>
      </section>

      <section className='grid md:flex mx-6 py-16 min-h-screen justify-center'>
        <div className='bg-[#1982C4] text-white rounded-xl px-10 z-20 md:translate-x-4 lg:translate-x-8 order-2 md:order-none -translate-y-4 md:translate-y-0' style={{ fontFamily: 'Poppins' }}>
          <h1 className='font-medium xl:text-[28px] lg:text-xl py-6 '>Contact Information</h1>
          <p className='font-light xl:text-[20px] lg:text-xl xl:py-6'>Fill up the form and our team will get back you!</p>
          <div className='flex items-center py-4 xl:py-6'>
            <BiSolidPhoneCall className='h-6 w-8' />
            <label>+0123 456 789</label>
          </div>
          <div className='flex items-center py-4 xl:py-6'>
            <IoMail className='h-6 w-8' />
            <label>hello@gmail.com</label>
          </div>
          <div className='flex items-center py-4 xl:py-6'>
            <IoLocationOutline className='h-6 w-8' />
            <label>102 Street 2174, India</label>
          </div>
          <div className='flex px-4 py-6 gap-6'>
            <FaFacebook className='lg:h-6 lg:w-8 cursor-pointer' />
            <FaSquareInstagram className='lg:h-6 lg:w-8 cursor-pointer' />
            <FaWhatsapp className='lg:h-6 lg:w-8 cursor-pointer' />
            <FaXTwitter className='lg:h-6 lg:w-8 cursor-pointer' />
          </div>
        </div>

        <div className='border-2 p-2 shadow-2xl rounded-xl lg:mx-4 lg:-translate-x-4 xl:translate-x-0 md:-translate-x-2'>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 mx-6 lg:gap-6 xl:mx-10 md:gap-4" style={{ fontFamily: 'Poppins' }}>
              <div className="mt-4 md:px-6 md:py-4">
                <label className="block text-sm font-medium lg:text-lg">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleChange}
                  placeholder="Riya"
                  className="mt-1 block w-full p-2 border-b border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mt-4 md:px-6 md:py-4">
                <label className="block text-sm font-medium lg:text-lg">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                  placeholder="Domini"
                  className="mt-1 block w-full p-2 border-b border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mt-4 md:mt-0 md:px-6 md:py-4">
                <label className="block text-sm font-medium lg:text-lg">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="john@gmail.com"
                  className="mt-1 block w-full p-2 border-b border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mt-4 md:mt-0 md:px-6 md:py-4">
                <label className="block text-sm font-medium lg:text-lg">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handleChange}
                  placeholder="9876543212"
                  className="mt-1 block w-full p-2 border-b border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2 mt-4 md:mt-0 md:px-6 md:py-4">
                <label className="block text-sm font-medium lg:text-lg">
                  Message
                </label>
                <textarea
                  name="message"
                  value={message}
                  onChange={handleChange}
                  placeholder="lorem"
                  className="mt-1 block w-full p-2 border-b border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="mt-4 text-center flex justify-end">
              <button
                type="submit"
                className="bg-[#1982C4] text-white py-2 lg:-translate-x-14 rounded-xl mb-4 min-w-[130px] md:min-w-[200px] xl:w-[200px] xl:h-[60px]"
                disabled={loading}
              >
                {loading ? 'Submitting...' : submitted ? 'Submitted' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </section>
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

export default Contact;
