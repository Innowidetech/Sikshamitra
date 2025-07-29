import React, { useState, useEffect } from 'react';
import { CiLogin } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import dripBorder from './assets/drip-border.png'; // Ensure the image is in /assets
import logo from './assets/logo.png'; // Add this at the top with other imports

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'BLOG', path: '/blog' },
    { label: 'ADMISSION', path: '/admission' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <div className="max-w-full overflow-hidden bg-[#FF9F1C]">
      {/* Full-width navbar with drip image */}
      <section
        className="w-full flex justify-between items-center px-6 py-6 md:px-12 h-[190px] md:h-[240px]"
        style={{
          backgroundImage: `url(${dripBorder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt="Logo"
            className="w-[110px] h-[100px] xl:w-[160px] xl:h-[120px] object-contain -mt-20"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center xl:text-[22px] font-medium" style={{ fontFamily: 'Poppins' }}>
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="cursor-pointer text-white relative -mt-20 hover:text-[#FF9F1C]"
            >
              {item.label}
            </button>
          ))}
          <button
            className="flex items-center border px-4 py-2 rounded-full text-white hover:bg-[#ffffff22]  relative -mt-20 "
            onClick={() => navigate('/login')}
          >
            <CiLogin className="mr-2" />
            Login
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-3xl"
          >
            ☰
          </button>
        </div>
      </section>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 md:hidden z-40 ${isMenuOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-[#14213D] md:hidden z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end items-center p-4">
          <button onClick={() => setIsMenuOpen(false)} className="text-white text-2xl">
            ×
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-6">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                setIsMenuOpen(false);
                navigate(item.path);
              }}
              className="text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              {item.label}
            </button>
          ))}
          <div
            className="flex items-center py-2 px-4relative -top-10 translate-x-14 rounded-full border w-[100px] text-white cursor-pointer "
            onClick={() => navigate('/login')}
          >
            <CiLogin className="mr-2 " />
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;