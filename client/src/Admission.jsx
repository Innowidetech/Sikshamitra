import React, { useState, useEffect } from "react";
import Admissionimg1 from "./assets/admissionimg1.png";
import Admissionimg2 from "./assets/admissionimg2.png";
import Admissionimg3 from "./assets/admissionimg3.png";
import Admissionimg4 from "./assets/admissionimg4.png";
import Admissionimg5 from "./assets/admissionimg5.png";
import Admissionimg6 from "./assets/admissionimg6.png";
import Admissionimg7 from "./assets/admissionimg7.png";
import Admissionimg8 from "./assets/admissionimg8.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import processimg from './assets/processimg.png'; // adjust path if needed

function Admission() {
  const [modelopen, Setmodelopen] = useState(false);
  const [schoolList, SetSchoolList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dob: '',
    address: '',
    collegeName: '',
  });

  const { firstName, lastName, phoneNumber, dob, address, collegeName } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getSchoolList = async () => {
    try {
      let response = await axios.get('https://sikshamitra.onrender.com/api/user/schools');
      SetSchoolList(response.data.schools);
    } catch (error) {
      console.error("Error fetching school list:", error);
    }
  };

  useEffect(() => {
    getSchoolList();
  }, []);


  //post

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://sikshamitra.onrender.com/api/user/offline', formData);

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
          phoneNumber: '',
          dob: '',
          address: '',
          collegeName: '',
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
      <section className="xl:min-w-[1440px] bg-[#FF9F1C]  flex flex-col xl:flex-row overflow-hidden max-w-full relative ">
        <div className="p-4 xl:p-0 text-white md:flex md:flex-col md:justify-center xl:ml-[80px] xl:w-[50%] md:order-1 order-2">

          <h3 className=" font-medium text-sm lg:text-3xl grid  justify-end xl:grid  xl:justify-start">
            <span className="block xl:mt-6 xl:text-[60px]">ENTRANCE EXAM</span>
            <p className="block xl:mt-10 xl:text-lg md:justify-center ">Apply to EShikshamitra – a cloud-powered school <br />
              management system that streamlines enrollment with <br />
              a digital, secure, and transparent application process.</p>
          </h3>
          <div className="xl:mb-10 xl:mt-5 flex gap-2  md:justify-start ">
            <button className="bg-white text-xs font-thin md:w-[250px] p-2 md:h-[52px] text-[#1982C4] md:font-medium xl:text-[15px] rounded-xl xl:rounded-2xl shadow-inner shadow-[#605e5e] "  onClick={() => navigate('/entranceexam')} >
              APPLY FOR ENTERNCE EXAM
            </button>
            {/* <button className="bg-white text-xs font-thin md:w-[150px] p-2 md:h-[52px] text-[#1982C4] md:font-medium xl:text-[15px] rounded-xl xl:rounded-2xl shadow-inner shadow-[#605e5e]" onClick={()=>Setmodelopen(true)}>
              APPLY OFFLINE
            </button> */}
          </div>
        </div>

        <div className="xl:w-[600px] xl:h-[262px] flex justify-start md:justify-end order-1 xl:order-2">
          <img
            src={Admissionimg1}
            alt="Admissionimg1"
            className="xl:max-w-full xl:h-auto h-[200px] xl:ml-0 ml-4 max-w-full"
          />
        </div>
      </section>

      <section className="xl:ml-[112px] mx-auto py-16">
        <div>
          <h1
            className="text-xl md:text-3xl text-center xl:text-[40px]"
            style={{ fontFamily: "Poppins" }}
          >
            <span className="text-[#1982C4] font-medium">WELCOME TO </span>{" "}
            <span className="text-[#1982C4] font-medium">ADMISSTIONS !</span>
          </h1>
        </div>

      </section>



      <section className="xl:max-w-[1100px] xl:min-h-[400px] bg-[#FF9F1C] rounded-3xl xl:mx-auto xl:py-[62px] xl:px-[58px] mx-6 py-6 px-6 -translate-y-10 md:translate-y-0 md:mx-6">
        <div>
          <h1 className="text-white font-semibold xl:text-[35px] text-center">
            APPLY ONLINE & OFFLINE APPLICATION
          </h1>
          <p className="text-white xl:text-[22px] font-light mx-4 mt-4 text-center">
            "Unlock Your Future—Apply Today, Transform Tomorrow"
          </p>
        </div>
        <div
          className="flex flex-col md:flex-row gap-4 md:gap-6 mt-10 md:mt-14 justify-center items-center"
          style={{ fontFamily: "Poppins" }}
        >
          <button className="bg-white  text-[#1982C4] px-6 py-3 xl:text-[22px]  border shadow-md shadow-gray-800  hover:bg-[#1982C4] hover:text-white transition-all rounded-xl" onClick={() => navigate('/applyonline')}>
            Apply Online
          </button>

          <button className="bg-white text-[#1982C4] px-6 py-3 xl:text-[22px] border shadow-md shadow-gray-800 hover:bg-[#1982C4] hover:text-white transition-all rounded-xl">
            Apply Offline
          </button>
        </div>

      </section>
      <div className="w-full px-4 py-10 md:py-16 bg-white" style={{ fontFamily: 'Poppins' }}>
        <h2 className="text-[#145399] text-[24px] md:text-[30px] font-semibold text-center uppercase">
          Admission Process
        </h2>
        <p className="text-center text-[16px] md:text-[18px] mt-2 text-black max-w-[750px] mx-auto">
          Throughout the admissions process we will get to know each other and we will access
          how we can best support your child to ensure their success
        </p>

        <div className="mt-10 md:mt-14 w-full flex justify-center">
          <div className="w-full flex justify-center mt-10 md:mt-14">
            <img
              src={processimg}
              alt="Admission Process Steps"
              className="w-full max-w-5xl object-contain"
            />
          </div>

        </div>
      </div>
      <section className="xl:ml-[112px] md:py-10 xl:py-14">
        <div>
          <h1
            className="text-xl md:text-3xl text-center xl:text-[40px]"
            style={{ fontFamily: "Poppins" }}
          >
            <span className="text-[#1982C4] font-medium">
              Your Future Is Bright!
            </span>
          </h1>
        </div>
        <div className="md:max-w-6xl xl:mx-auto mx-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:mt-14 mt-10 xl:-translate-x-4">
          <div className="flex flex-col items-center justify-center text-center bg-[#FFFFFF] rounded-xl xl:w-[347px] xl:h-[317px] shadow-md shadow-gray-300">
            <img
              src={Admissionimg7}
              alt="Admissionimg7"
              className="h-24 w-24 p-2 xl:w-[130px] xl:h-[144px] "
            />
            <p className="text-black xl:text-[28px] text-xl">
              Strong Academics
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center bg-[#FFFFFF] rounded-xl xl:w-[347px] xl:h-[317px] shadow-md shadow-gray-300">
            <img
              src={Admissionimg2}
              alt="Admissionimg2"
              className="h-24 w-24 p-2 mb-4 xl:w-[130px] xl:h-[144px]"
            />
            <p className="text-black xl:text-[28px] text-xl">
              Talented Teachers
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center bg-[#FFFFFF] rounded-xl xl:w-[347px] xl:h-[317px] shadow-md shadow-gray-300">
            <img
              src={Admissionimg3}
              alt="Admissionimg4"
              className="h-24 w-24 p-2 mb-4 xl:w-[130px] xl:h-[144px]"
            />
            <p className="text-black xl:text-[28px] text-xl">
              Dedicated Counselors
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center bg-[#FFFFFF] rounded-xl xl:w-[347px] xl:h-[317px] shadow-md shadow-gray-300">
            <img
              src={Admissionimg4}
              alt="Admissionimg5"
              className="h-24 w-24 p-2 mb-4 xl:w-[130px] xl:h-[144px]"
            />
            <p className="text-black xl:text-[28px] text-xl">
              Inclusive Academics
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center bg-[#FFFFFF] rounded-xl xl:w-[347px] xl:h-[317px] shadow-md shadow-gray-300">
            <img
              src={Admissionimg5}
              alt="Admissionimg6"
              className="h-24 w-24 p-2 mb-4 xl:w-[130px] xl:h-[144px]"
            />
            <p className="text-black xl:text-[28px] text-xl">
              Sports Availability
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center bg-[#FFFFFF] rounded-xl xl:w-[347px] xl:h-[317px] shadow-md shadow-gray-300">
            <img
              src={Admissionimg6}
              alt="Admissionimg6"
              className="h-24 w-24 p-2 mb-4 xl:w-[130px] xl:h-[144px]"
            />
            <p className="text-black xl:text-[28px] text-xl">
              Higher Education & Support
            </p>
          </div>
        </div>
      </section>

      <section
        className="bg-cover bg-center text-white relative  mb-16 shadow-2xl rounded-xl mt-10"
        style={{
          backgroundImage: `url(${Admissionimg8})`,
          boxShadow: "0px 4px 6px rgba(96, 94, 94, 0.5)",
        }}
      >
        <div className="flex items-center justify-center text-center min-h-[500px]">
          <div>
            <p className="text-lg md:text-3xl xl:text-[40px] font-bold mb-2">
              Keep In Touch
            </p>
            <p className="text-lg md:text-xl font-medium mb-4">
              please email us at hello@gmail.com
            </p>
            <button className="bg-white text-xs font-thin xl:w-[150px] p-2 xl:h-[52px] text-[#FF9F1C] md:font-medium xl:text-[15px] rounded-xl xl:rounded-2xl shadow-inner shadow-[#605e5e]">
              Contact US
            </button>
          </div>
        </div>
      </section>


      {
        modelopen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6  lg:w-[700px] opacity-100 overflow-y-scroll h-[600px] md:overflow-hidden md:h-auto">
              <div className="bg-[#1982C4] p-6 rounded-t-3xl">
                <button
                  onClick={() => Setmodelopen(false)}
                  className="flex justify-self-end text-3xl text-white"
                  style={{ fontFamily: 'Poppins' }}
                >
                  &times;
                </button>
                <h2 className="text-center text-lg font-semibold mb-4 text-white lg:text-2xl xl:text-3xl" style={{ fontFamily: 'Poppins' }}>APPLY OFFLINE</h2>
              </div>
              <div className="bg-white xl:py-8 rounded-b-3xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 mx-6 lg:gap-6 xl:mx-10 md:gap-4" style={{ fontFamily: 'Poppins' }}>
                    <div className="mt-4 ">
                      <label className="block text-sm font-medium text-[#1982C4] lg:text-lg">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Riya"
                        value={firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mt-4 ">
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#1982C4] lg:text-lg">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Williams"
                        value={lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mt-4 md:mt-0">
                      <label className="block text-sm font-medium text-[#1982C4] lg:text-lg">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="+91 9111111111"
                        value={phoneNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        pattern="^[0-9]{10}$"
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />
                    </div>
                    <div className="mt-4 md:mt-0">
                      <label htmlFor="dob" className="block text-sm font-medium text-[#1982C4] lg:text-lg">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={dob}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 mt-4 md:mt-0">
                      <label htmlFor="address" className="block text-sm font-medium text-[#1982C4] lg:text-lg">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        placeholder="lorem"
                        value={address}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1982C4] lg:text-lg">
                        Choose University / College
                      </label>
                      <select
                        name="collegeName"
                        value={collegeName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select a school/university</option>
                        {schoolList.map((school) => (
                          <option key={school._id} value={school.schoolName}>
                            {school.schoolName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      type="submit"
                      className="bg-[#1982C4] text-white py-2 px-4 rounded-full mb-4"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : submitted ? 'Submitted' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
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

export default Admission;
