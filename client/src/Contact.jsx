import React, { useState } from "react";
import ContactNavimg from "./assets/contactnavimg.png";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoMail } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
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
      const response = await axios.post(
        "https://sikshamitra.onrender.com/api/user/contactUs",
        formData
      );

      if (response.status === 200) {
        toast.success(
          "Message sent successfully! We will get back to you soon.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        setSubmitted(true);

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error sending message. Please try again later.",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-[#FF9F1C] w-full px-4 flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden h-[220px] md:h-[280px]">
        {/* Left Side - Text */}
        <div className="md:w-1/2 flex justify-end md:justify-end text-right">
          <h2 className="text-white text-3xl md:text-7xl font-bold tracking-wide">
            Get In Touch
          </h2>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img
            src={ContactNavimg}
            alt="Contact"
            className="w-[280px] md:w-[450px] rotate-3 object-contain"
          />
        </div>
      </section>

      <section className="flex flex-col md:flex-row justify-center items-stretch mx-auto max-w-6xl my-10 rounded-xl shadow-lg overflow-hidden bg-[#F5EEE4]">
        {/* Left Blue Panel */}
        <div
          className="bg-[#1982C4] text-white p-8 md:w-[35%] flex flex-col justify-center gap-4"
          style={{ fontFamily: "Poppins" }}
        >
          <h1 className="text-xl font-semibold">Contact Information</h1>
          <p className="text-sm">
            Fill up the form and our Team will get back to you!
          </p>

          <div className="flex items-center gap-3 mt-4 text-sm">
            <BiSolidPhoneCall className="h-5 w-5" />
            <span>+0123 456 789</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <IoMail className="h-5 w-5" />
            <span>hello@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <IoLocationOutline className="h-5 w-5" />
            <span>102 Street 2174, India</span>
          </div>

          <div className="flex gap-4 mt-6">
            <FaFacebook className="h-5 w-5 cursor-pointer" />
            <FaSquareInstagram className="h-5 w-5 cursor-pointer" />
            <FaWhatsapp className="h-5 w-5 cursor-pointer" />
            <FaXTwitter className="h-5 w-5 cursor-pointer" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div
          className="bg-white md:w-[65%] p-8"
          style={{ fontFamily: "Poppins" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleChange}
                  placeholder="Riya"
                  className="w-full border-b border-black outline-none py-1 bg-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                  placeholder="Domini"
                  className="w-full border-b border-black outline-none py-1 bg-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Mail ID</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="john@gmail.com"
                  className="w-full border-b border-black outline-none py-1 bg-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handleChange}
                  placeholder="9876543212"
                  className="w-full border-b border-black outline-none py-1 bg-transparent text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  value={message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full border-b border-black outline-none py-1 bg-transparent text-sm resize-none"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-[#1982C4] text-white px-6 py-2 rounded-md font-semibold text-sm shadow-md"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : submitted
                  ? "Submitted"
                  : "Send Message"}
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
