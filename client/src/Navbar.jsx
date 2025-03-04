import React, { useState, useEffect } from 'react';
import { CiLogin } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-full overflow-hidden">
      <section className="flex justify-between items-center px-4 py-2 mx-auto xl:ml-[61px] xl:mr-[60px] xl:mt-[30px] ml-[25px] mr-[25px]">
        {/* Logo Section */}
        <div style={{ fontFamily: 'Poppins', flexGrow: 1 }}>
          <h1 className="text-[30px] w-[85px] h-[40px] xl:text-3xl xl:max-h-[64px] xl:max-w-[135px] xl:text-[48px] font-semibold text-[#FF9F1C]">
            LOGO
          </h1>
        </div>

        {/* Navigation Section (hidden on small screens) */}
        <div className="hidden md:flex md:text-xs space-x-8 items-center text-[#1982C4] xl:text-[22.42px] lg:font-semibold" style={{ fontFamily: 'Poppins' }}>
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button className="flex items-center md:rounded-[21.54px] xl:max-w-[152] xl:max-h-[50.27px] border px-4 py-1 lg:font-light" onClick={() => navigate('/login')}>
            <CiLogin className="text-[#1982C4] mr-2" />
            Login
          </button>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#1982C4] text-2xl"
          >
            ☰
          </button>
        </div>
      </section>

      {/* Mobile Menu Background Overlay */}
      <div
        className={`fixed inset-0 bg-opacity-50 md:hidden z-40 ${isMenuOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-64  bg-[#14213D] md:hidden z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end items-center p-4">
          <button onClick={() => setIsMenuOpen(false)} className="text-white text-2xl">
            ×
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-6 ">
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
          <div className="flex items-center py-2 px-4  translate-x-14 rounded-full border w-[100px] text-white" onClick={() => navigate('/login')}>
            <CiLogin className="mr-2" />
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
