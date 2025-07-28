import React from 'react';
import { FaArrowRight, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Footerimg1 from './assets/footerimg1.png';
import Footerimg2 from './assets/footerimg2.png';
import Footerimg3 from './assets/footerimg3.png';
import Footerimg4 from './assets/footerimg4.png';
import Footerimg5 from './assets/footerimg5.png';
import Footerimg6 from './assets/footerimg6.png';
import logo from './assets/logo.png';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#FF9F1C] text-white py-8 pl-6 md:pl-0 grid md:grid-cols-2 md: justify-evenly lg:grid-cols-4">
      <div className="mb-6 md:mb-0 xl:h-[262px] xl:w-[281px] xl:ml-[80px] md:mx-4 xl:mx-0">
        <div>
          <img
            src={logo}
            alt="Logo"
            className="w-[110px] h-[100px] xl:w-[160px] xl:h-[120px] object-contain -mt-5"
          />
        </div>
        <p className="text-sm max-w-sm">
          Our platform streamlines communication between teachers, students, and parents, ensuring that everyone stays informed and engaged in the learning process.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Facebook" className="bg-[#1877F2] p-2 rounded-md">
            <FaFacebookF className="text-white text-xl" />
          </a>
          <a href="#" aria-label="Twitter" className="bg-[#1DA1F2] p-2 rounded-md">
            <FaTwitter className="text-white text-xl" />
          </a>
          <a href="#" aria-label="YouTube" className="bg-[#FF0000] p-2 rounded-md">
            <FaYoutube className="text-white text-xl" />
          </a>
          <a href="#" aria-label="Instagram" className="bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-2 rounded-md">
            <FaInstagram className="text-white text-xl" />
          </a>
        </div>

      </div>

      <div className="mb-6 xl:ml-[80px] md:mx-4 xl:mx-0">
        <h3 className="text-lg font-medium mb-4 xl:text-[25px]">Quick Links</h3>
        <ul className="space-y-3">
          <li className="flex items-center">
            <FaArrowRight className="mr-2" />
            <a href="/" className="text-sm xl:text-lg hover:underline">Home</a>
          </li>
          <li className="flex items-center">
            <FaArrowRight className="mr-2" />
            <a href="/about" className="text-sm xl:text-lg hover:underline">About Us</a>
          </li>
          <li className="flex items-center">
            <FaArrowRight className="mr-2" />
            <a href="/blog" className="text-sm xl:text-lg hover:underline">Blog</a>
          </li>
          <li className="flex items-center">
            <FaArrowRight className="mr-2" />
            <a href="/contact" className="text-sm xl:text-lg hover:underline">Contact Us</a>
          </li>
        </ul>
      </div>
      <div className="mb-6 xl:ml-[-80px] md:mx-4 lg:mx-0 lg:-translate-x-14 lg:mt-0 xl:translate-x-0 xl:mx-0 md:mt-[20px] xl:mt-0" style={{ fontFamily: 'Poppins' }}>
        <h3 className="text-lg font-medium mb-4 xl:text-[25px]">Media Gallery</h3>
        <div className="grid grid-cols-3">
          <img src={Footerimg1} alt="Footerimg1" className="w-full h-auto rounded-lg xl:w-[93px] xl:h-[82px]" />
          <img src={Footerimg2} alt="Footerimg2" className="w-full h-auto rounded-lg xl:w-[93px] xl:h-[82px]" />
          <img src={Footerimg3} alt="Footerimg3" className="w-full h-auto rounded-lg xl:w-[93px] xl:h-[82px]" />
          <img src={Footerimg4} alt="Footerimg4" className="w-full h-auto rounded-lg xl:w-[93px] xl:h-[82px]" />
          <img src={Footerimg5} alt="Footerimg5" className="w-full h-auto rounded-lg xl:w-[93px] xl:h-[82px]" />
          <img src={Footerimg6} alt="Footerimg6" className="w-full h-auto rounded-lg xl:w-[93px] xl:h-[82px]" />
        </div>
      </div>

      <div className=' md:mx-4 xl:mx-0 md:mt-[20px] xl:mt-0' style={{ fontFamily: 'Poppins' }}>
        <h3 className="text-lg font-medium mb-4 xl:text-[25px]">Get In Touch</h3>
        <div className="flex items-center mb-3">
          <FaMapMarkerAlt className="mr-3 h-6 w-6" />
          <p className="text-sm xl:w-[300px]">144 Platte Street, CA Colony, Madhya Pradesh, India</p>
        </div>
        <div className="flex items-center mb-3">
          <FaPhoneAlt className="mr-3 h-4 w-4 md:w-6 md:h-6" />
          <p className="text-sm">Call: +91 090909090</p>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="mr-3 h-6 w-6 text-white" />
          <p className="text-sm">info@shikshmitra@gmail.com</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
