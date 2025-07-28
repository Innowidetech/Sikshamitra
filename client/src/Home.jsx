import Testimonial1 from "./assets/testimonial1.png";
import Testimonial2 from "./assets/testimonial2.png";
import Testimonial3 from "./assets/testimonial3.png";
// home page
import smallTeddy from "./assets/teddysmall.png";
import sectionimg1 from "./assets/sectionimg1.png";
import sectionimg2 from "./assets/sectionimg2.png";
import sectionimg3 from "./assets/sectionimg3.png";
import sectionimg4 from "./assets/sectionimg4.png";

import trophyImg from "./assets/introsection1.png";
import dashboardImg from "./assets/introsection3.png";
import popupMenu from "./assets/introsection2.png";
import mobile1 from "./assets/introsection4.png";
import dollImg from "./assets/introsection5.png";
import cloud from "./assets/cloudimg1.png";
import studygirl from "./assets/dashboardimg1.png";
import rainbow from "./assets/dashboardimg2.png";
import planet from "./assets/blogsimg1.png";
import pencil from "./assets/blogsimg2.png";
import student from "./assets/blogsimg4.png";
import teacher from "./assets/blogsimg3.png";
import starGroup from "./assets/starsgroup.png";
import bag from "./assets/bag.png";
import kidplay from "./assets/kidplay.png";
import card1 from "./assets/card1.png";
import card11 from "./assets/card11.png";
import card2 from "./assets/card2.png";
import card21 from "./assets/card21.png";
import card31 from "./assets/card31.png";
import card3 from "./assets/card3.png";
import value1 from "./assets/value1.png";
import value2 from "./assets/value2.png";
import value3 from "./assets/value3.png";
import value4 from "./assets/value4.png";
import rocket from "./assets/rocketimg.png";
import star1 from "./assets/star1.png";
import clip1 from "./assets/clip1.png";
import stbg from "./assets/stbg.png";
import admission1 from "./assets/admission1.png";
import admission2 from "./assets/admisson2.png";
import admission3 from "./assets/admisson3.png";
import arrowDown from "./assets/admisson4.png";
import admission5 from "./assets/admisson5.png";
import Vector from "./assets/Vector5.png";
import admission6 from "./assets/admisson6.png";
import vector111 from "./assets/vector111.png";
import {
  FaBus,
  FaBook,
  FaUsers,
  FaMoneyBill,
  FaChalkboardTeacher,
  FaClipboardList,
} from "react-icons/fa";

function Home() {
  return (
    <>
      <div className="bg-[#FF9F1C] -mt-28  pb-12">
        <section className="h-[500px] w-full border  shadow-[0px_2px_rgba(0,0,0,0.2)] pt-24   ">
          <div className="bg-[#FF9F1C] p-6 md:p-12 relative overflow-hidden ">
            {/* Teddy Bear - Top Left */}
            <img
              src={smallTeddy}
              alt="Teddy Bear"
              className="absolute top-6 left-6 w-16 h-16 md:w-20 md:h-20"
            />

            {/* Content Wrapper */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Text Section */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  Welcome to <br />
                  <span className="text-white font-extrabold">
                    ESikshamitra!
                  </span>
                </h1>
                <p className="mt-4 text-[#2C2C2C] md:text-lg max-w-md">
                  Our platform streamlines communication between teachers,
                  students, and parents, ensuring that everyone stays informed
                  and engaged in the learning process.
                </p>
              </div>

              {/* Image Section */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <img
                  src={sectionimg1}
                  alt="Kid 1"
                  className="rounded-xl object-cover w-full h-auto"
                />
                <img
                  src={sectionimg2}
                  alt="Kid 2"
                  className="rounded-xl object-cover w-full h-auto"
                />
                <img
                  src={sectionimg3}
                  alt="Teddy Bear"
                  className="rounded-xl object-cover w-34 ml-24 mb-6 h-auto"
                />
                <img
                  src={sectionimg4}
                  alt="Kid 3"
                  className="rounded-xl object-cover w-full h-auto"
                />
              </div>
            </div>

            {/* Teddy Bear - Bottom Right */}
          </div>
        </section>
      </div>

      {/*  End of Section */}
      <div className="bg-[#FDF4EA] w-full overflow-hidden">
        {/* Combined Container */}
        <div className="relative w-full p-4 flex justify-center items-center min-h-screen">
          {/* Trophy Icon */}
          <img
            src={trophyImg}
            alt="Trophy"
            className="absolute top-2 left-14 w-[230px] h-[230px] object-contain"
          />

          {/* Dashboard Panel */}
          <img
            src={dashboardImg}
            alt="Dashboard UI"
            className="absolute w-[730px] top-10 h-[650px] object-contain"
          />

          {/* Menu Popup */}
          <img
            src={popupMenu}
            alt="Popup Menu"
            className="absolute left-[250px] top-[250px] w-[240px] h-[220px] object-contain"
          />

          {/* Mobile Preview Left */}
          <img
            src={mobile1}
            alt="Mobile UI 1"
            className="absolute right-[200px] top-[60px] w-[440px] h-[600px] object-contain"
          />

          {/* Doll Bottom Right */}
          <img
            src={dollImg}
            alt="Girl Character"
            className="absolute bottom-0 top-[320px] right-[170px]   w-[280px] h-auto object-contain"
          />
        </div>

        {/* Quote Section Below with no gap */}
        <div className="w-full  flex flex-col md:flex-row justify-center items-center gap-6">
          <img
            src={studygirl}
            alt="Girl Character"
            className="w-[280px] md:w-[400px] ml-14"
          />
          <h2 className="text-[#146192] text-3xl font-bold font-['Roboto Slab'] max-w-2xl text-center md:text-left">
            “Together on ESikshamitra, parents guide the way and children embark
            on their journey—one click can unlock a world of opportunities.”
          </h2>
          <img
            src={rainbow}
            alt="Rainbow"
            className="w-[100px] pt-[80px] mt-auto md:w-[120px] "
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start  p-4 pt-32 space-y-6 md:space-y-0">
        {/* Left Card */}
        <div className="relative w-full max-w-[700px] mx-auto bg-[#f7931e] text-white rounded-tr-[30px] rounded-bl-[0px] rounded-br-[0px] rounded-tl-[0px] px-10 py-12">
          {/* Text Content */}
          <div className="w-[60%] sm:w-[65%] z-10 relative">
            <h2 className="text-xl sm:text-2xl font-semibold leading-snug">
              Confidence that
              <br />
              builds a brighter
              <br />
              future
            </h2>
            <button className="mt-6 bg-white text-[#1d588e] font-medium px-4 py-2 rounded-md text-sm">
              Learn More
            </button>
          </div>

          {/* Background Image Behind Kid */}
          <img
            src={stbg} // your new background image
            alt="Background Shape"
            className="absolute -right-10 bottom-[-50px] w-[48%] z-0"
          />

          {/* Kid Image Overlapping */}
          <img
            src={kidplay}
            alt="Kid"
            className="absolute -right-1 bottom-0 w-[45%] sm:w-[42%] z-10"
          />

          {/* Optional Decorations */}
          <div className="absolute top-[-60px] left-[-20px] text-white text-3xl z-0">
            <img src={clip1} alt="Clip" className="w-[90px] h-[90px]" />
          </div>
          <div className="absolute bottom-6 left-1/3 text-white text-4xl z-0">
            <img src={star1} alt="Star" className="w-[80px] h-[80px]" />
          </div>
        </div>

        {/* Right Card */}
        <div className=" relative w-full max-w-md mx-auto">
          {/* Blue Container */}
          <div className="bg-[#1d588e] text-white rounded-tr-[30px] rounded-bl-[0px] rounded-br-[0px] rounded-tl-[0px] p-6 pt-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold leading-snug  underline-offset-4">
              Helping kids
              <br />
              to shoot their
              <br />
              dreams.
            </h2>
            <button className="mt-6 bg-white text-[#1d588e] font-semibold px-5 py-2 rounded-full">
              Learn More
            </button>

            {/* Background elements (optional stars & rocket) */}
            <div className="absolute top-[50px] right-[40px] opacity-20">
              <img src={rocket} alt="Star" className="w-[150px] h-[150px]" />
            </div>
          </div>

          {/* Bag Image Positioned Above */}
          <img
            src={bag}
            alt="Bag"
            className="absolute -bottom-[150px] right-[-80px] w-[100px] md:w-[250px] lg:w-[300px] z-10"
          />
        </div>
      </div>

      <div className="p-8 md:p-20  flex flex-col md:flex-row justify-evenly items-center gap-6  ">
        <div>
          <h1 className="text-[#146192] text-[50px] font-bold font-['Roboto Slab'] max-w-2xl text-center md:text-left">
            Smart and clever kids <br /> ready to{" "}
            <span className="text-[#f7931e]">fly high!</span>
          </h1>
        </div>
        <div>
          <p className="text-[#494949] text-[18px]  font-['Roboto Slab'] max-w-xl text-center md:text-left">
            Through engaging play and challenges, children build sharper
            thinking, smarter choices, and soaring confidence.
          </p>
        </div>
      </div>

      {/* Three Cards */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center p-6">
        <div className="relative bg-[#1d588e] text-white rounded-tr-[30px] rounded-bl-[8px] rounded-br-[0px] rounded-tl-[0px] w-[318px] h-[318px] p-4 overflow-hidden">
          <h2 className="text-[28px] font-semibold z-10 relative">
            Life skills
            <br />
            for kids
          </h2>

          {/* Optional Decorative Icon (Paper Plane) */}
          <img
            src={card11}
            alt="plane icon"
            className="absolute bottom-[-20px] left-[-10px] w-[90px] opacity-30"
          />

          {/* Child Image (Overlapping from bottom) */}
          <img
            src={card1}
            alt="Child"
            className="absolute bottom-0 right-0 w-[260px] object-contain"
          />
        </div>
        <div className="relative bg-[#B5C837] text-white rounded-tr-[30px] rounded-bl-[8px] rounded-br-[0px] rounded-tl-[0px] w-[318px] h-[318px] p-4 overflow-hidden">
          <h2 className="text-[28px] font-semibold z-10 relative">
            Imagination
            <br />
            is power
          </h2>
          <img
            src={card21}
            alt="plane icon"
            className="absolute bottom-4 left-4 w-[70px] opacity-30"
          />
          {/* Child Image (Overlapping from bottom) */}
          <img
            src={card2}
            alt="Child"
            className="absolute bottom-0 right-0 w-[320px] object-contain"
          />
        </div>
        <div className="relative bg-[#FF9F1C] text-white rounded-tr-[30px] w-[318px] h-[318px]  overflow-hidden">
          {/* Text on the right */}
          <h2 className="text-[28px] font-semibold z-10 absolute top-4 right-4 text-right">
            Grow your
            <br /> own wings
          </h2>

          {/* Child image on the left */}
          <img
            src={card3}
            alt="Child"
            className="absolute bottom-0  left-0 w-[220px] object-contain"
          />

          {/* Paper plane icon on the right-bottom */}
          <img
            src={card31}
            alt="Plane Icon"
            className="absolute bottom-[-50px] right-[-20px] w-[160px] opacity-30"
          />
        </div>
      </div>
      {/* Three Cards */}

      {/* info of the student  */}
      <img
        src={cloud}
        alt="Cloud"
        className="md:width-[1400px] mb-[-80px] ml-6"
      />
      <div className="bg-[#1c4875] text-white  md:px-10 md:pt-10 ">
        {/* Heading */}
        <h2 className="text-2xl md:text-[40px] font-semibold leading-snug text-center md:text-left md:pb-8">
          “Here’s our streamlined admission process to <br /> make things easier
          for you.”
        </h2>

        {/* Horizontal Layout: Steps | Admission Button | Character */}

        <div className="mt-10 flex flex-col lg:flex-row items-center justify-between ">
          {/* Left: Step Buttons */}
          <div className="flex flex-col space-y-6 md:ml-32">
            {/* Step 1 */}
            <div className="relative w-fit">
              <div
                className="h-14 w-20 rounded-l-full rounded-r-[8px] flex items-center justify-center pr-10 z-10"
                style={{ backgroundColor: "#fca5a5" }}
              >
                <img src={admission1} alt="Step 1" className="h-6 w-6" />
              </div>
              <button
                className="absolute top-1 left-10 pl-10 pr-6 py-3 rounded-full text-white font-medium shadow-md whitespace-nowrap"
                style={{ backgroundColor: "#f95f62" }}
              >
                Click on ADMISSION
              </button>
            </div>

            {/* Step 2 */}
            <div className="relative w-fit">
              <div
                className="h-14 w-20 rounded-l-full rounded-r-[8px] flex items-center justify-center pr-10 z-10"
                style={{ backgroundColor: "#F4D0A1" }}
              >
                <img src={admission2} alt="Step 2" className="h-6 w-6" />
              </div>
              <button
                className="absolute top-1 left-10 pl-8 pr-6 py-3 rounded-full text-white font-medium shadow-md whitespace-nowrap"
                style={{ backgroundColor: "#E8A349" }}
              >
                Choose online / offline
              </button>
            </div>

            {/* Step 3 */}
            <div className="relative w-fit">
              <div
                className="h-14 w-20 rounded-l-full rounded-r-[8px] flex items-center justify-center pr-10 z-10"
                style={{ backgroundColor: "#FF90B6" }}
              >
                <img src={admission3} alt="Step 3" className="h-6 w-6" />
              </div>
              <button
                className="absolute top-1 left-10 pl-8 pr-6 py-3 rounded-full text-white font-medium shadow-md whitespace-nowrap"
                style={{ backgroundColor: "#E84980" }}
              >
                Enter details
              </button>
            </div>
          </div>

          {/* Center: ADMISSION Button */}
          <div className="mt-6 lg:mt-0 flex flex-col items-center space-y-4">
            <button className="bg-white text-[#1c4875] font-bold px-10 py-3 rounded-full shadow-md border-2 border-white hover:scale-105 transition-transform whitespace-nowrap md:mt-10">
              ADMISSION
            </button>

            {/* Arrow image below button */}
            <img
              src={arrowDown}
              alt="Arrow"
              className="w-12 h-16 mt-12 ml-16 mt-auto"
            />
          </div>

          {/* Right: Character Image */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <img
              src={admission5}
              alt="Student Character"
              className="max-w-[450px] md:max-w-[360px] h-auto"
            />
            <img
              src={admission6}
              alt="Arrow"
              className="md:w-[110px] md:h-[130px] mt-auto"
            />
          </div>
        </div>
      </div>
      <img src={cloud} alt="Cloud" className="width-full mt-[-50px]" />
      <img
        src={vector111}
        alt="Cloud"
        className="width-full mt-[-10px] ml-[40px]"
      />
      {/* info of the student  */}
      <div className="relative">
        <img
          src={Vector}
          alt="Cloud"
          className="absolute width-full m-auto ml-[1200px] mt-[-190px] "
        />
      </div>
      <h1 className=" flex justify-center text-2xl md:text-3xl font-semibold text-[#292929] mb-6 ">
        OUR CORE VALUES
      </h1>

      {/* four Cards */}
      <div></div>

      <div className="flex flex-col font-roboto md:flex-row gap-4 justify-center items-center p-6 m-12 pb-20">
        <div className="relative bg-[#f8f1e8] w-[240px] h-[240px] rounded-[40px] flex flex-col items-center justify-center shadow-md">
          <img src={value1} alt="icon" className="w-14 h-14 mb-2" />

          <p className="text-center text-[20px] font-medium text-black leading-tight">
            Seamless <br /> Communication
          </p>

          <div className="absolute bottom-[-12px] w-12 h-8 bg-[#f7931e] rounded-full"></div>
        </div>
        <div className="relative bg-[#f8f1e8] w-[240px] h-[240px] rounded-[40px] flex flex-col items-center justify-center shadow-md">
          <img src={value2} alt="icon" className="w-14 h-14 mb-2" />

          <p className="text-center text-[20px] font-medium text-black leading-tight">
            Seamless <br />
            Communication
          </p>

          <div className="absolute bottom-[-12px] w-12 h-8 bg-[#f7931e] rounded-full"></div>
        </div>
        <div className="relative bg-[#f8f1e8] w-[240px] h-[240px] rounded-[40px] flex flex-col items-center justify-center shadow-md">
          <img src={value3} alt="icon" className="w-14 h-14 mb-2" />

          <p className="text-center text-[20px] font-medium text-black leading-tight">
            Data-Driven <br /> Insights
          </p>

          <div className="absolute bottom-[-12px] w-12 h-8 bg-[#f7931e] rounded-full"></div>
        </div>
        <div className="relative bg-[#f8f1e8] w-[240px] h-[240px] rounded-[40px] flex flex-col items-center justify-center shadow-md">
          <img src={value4} alt="icon" className="w-14 h-14 mb-2" />

          <p className="text-center text-[20px] font-medium text-black leading-tight">
            Enhanced <br /> Learning Experience
          </p>

          <div className="absolute bottom-[-12px] w-12 h-8 bg-[#f7931e] rounded-full"></div>
        </div>
      </div>
      {/* four Cards */}

      {/*  End of 2 */}
      <h1 className="flex justify-center text-3xl font-bold text-[#146192]">
        FEATURES
      </h1>
      <section className="bg-[#fdf5ef] min-h-screen flex items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-6xl h-[650px]">
          {/* Center Orange Circle - Lower z-index */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="bg-[#FF9F1C] text-white rounded-full w-[420px] h-[420px] flex flex-col items-center justify-center text-center shadow-xl border-8 border-white">
              <h1 className="text-[46px] font-bold leading-tight">
                ESikshamitra
              </h1>
              <p className="text-[12px] mt-3 max-w-[280px] px-4 font-medium">
                One Platform for All Educational Needs
              </p>
            </div>
          </div>

          {/* Top Row Cards - Higher z-index to appear above circle */}
          <div className="absolute top-4 left-[30%]   -translate-x-[180px] z-20 ">
            <div className="bg-white shadow-lg rounded-lg   p-5 text-center space-y-3 md:w-[360px] md:h-[160px] border border-gray-100">
              <div className="flex justify-start">
                <div className="flex justify-center">
                  <FaBook size={28} className="text-[#1d588e]" />
                </div>
                <h2 className="font-semibold text-xl text-[#1d588e] pl-4">
                  Library
                </h2>
              </div>
              <p className="text-gray-600 text-md leading-relaxed">
                A complete digital library system with easy book issuing,
                returning, and real-time inventory tracking.
              </p>
            </div>
          </div>

          <div className="absolute top-4 left-[40%] translate-x-[180px]  z-20">
            <div className="bg-white shadow-lg rounded-lg w-64 p-5 md:w-[360px] md:h-[160px] text-center space-y-3 border border-gray-100">
              <div className="flex justify-start">
                <div className="flex justify-center">
                  <FaBus size={28} className="text-[#1d588e]" />
                </div>
                <h2 className="font-semibold text-xl text-[#1d588e] pl-2">
                  Transportation
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Seamless transport updates for parents with real-time driver
                details and live tracking.
              </p>
            </div>
          </div>

          {/* Middle Row Left/Right - Same level as circle */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 z-5">
            <div className="bg-white shadow-lg rounded-lg md:w-[360px] md:h-[160px] p-5 text-center space-y-3 border border-gray-100">
              <div className="flex justify-start">
                <div className="flex justify-center">
                  <FaChalkboardTeacher size={28} className="text-[#1d588e]" />
                </div>
                <h2 className="font-semibold text-xl text-[#1d588e] pl-3">
                  Meeting & Feedback System
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Unified system for queries, feedback, and meetings—ensuring
                seamless communication and connection.
              </p>
            </div>
          </div>

          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-5">
            <div className="bg-white shadow-lg rounded-lg md:w-[360px] md:h-[160px] p-5 text-center space-y-3 border border-gray-100">
              <div className="flex justify-start">
                <div className="flex justify-center">
                  <FaMoneyBill size={28} className="text-[#1d588e]" />
                </div>
                <h2 className="font-semibold text-xl text-[#1d588e] pl-2">
                  Accounts
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comprehensive account management system with monthly and yearly
                reports of income and expenditure.
              </p>
            </div>
          </div>

          {/* Bottom Row Cards - Higher z-index to appear above circle */}
          <div className="absolute bottom-4 left-[30%] -translate-x-[180px] z-20">
            <div className="bg-white shadow-lg rounded-lg md:w-[360px] md:h-[160px] p-5 text-center space-y-3 border border-gray-100">
              <div className="flex justify-start">
                <div className="flex justify-center">
                  <FaUsers size={28} className="text-[#1d588e]" />
                </div>
                <h2 className="font-semibold text-xl text-[#1d588e]">
                  Admissions
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                From entrance exams to admissions, manage the entire process
                online with ease and efficiency.
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 left-[40%] translate-x-[180px] -translate-x-64 z-20">
            <div className="bg-white shadow-lg md:w-[360px] md:h-[160px] rounded-lg w-64 p-5 text-center space-y-3 border border-gray-100">
              <div className="flex justify-start">
                <div className="flex justify-center">
                  <FaClipboardList size={28} className="text-[#1d588e]" />
                </div>
                <h2 className="font-semibold text-xl text-[#1d588e] pl-2">
                  Role-Based Management
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Role-based access for admins, teachers, parents, and students
                with online classes, meetings, and attendance – all in one
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*  End of 2 */}

      {/* Blog section */}
      <div className="bg-gradient-to-b from-white to-[#FDF4EA] py-10 px-4 md:px-12 text-center">
        <div className="flex justify-center items-center p-12">
          <img src={planet} alt="Planet" className="w-40 h-30 mt-auto" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#146192] mb-2">
              “Find the Right School for a brighter Future”.
            </h2>
            <p className="text-sm md:text-base text-[#146192] mb-6">
              Discover top schools for classes 1 to 12 near you. Compare,
              explore & make informed decision.
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#146192] mb-6">
              OUR LATEST BLOGS
            </h3>
          </div>
          <img src={pencil} alt="Pencil" className="w-40 h-30 mb-10" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center ">
          <div className="bg-[#FFFFFF] rounded-xl p-10 flex items-center gap-6 w-full max-w-3xl shadow-sm">
            {/* Image with Blob Shape */}
            <div className="w-[150px] h-[150px]">
              <img
                src={student}
                alt="Kids"
                className="w-full h-full object-cover"
                style={{
                  clipPath: "ellipse(46% 40% at 45% 43%)",
                }}
              />
            </div>

            {/* Text Content */}
            <div className="max-w-md">
              <h3 className="text-[#1d588e] font-semibold text-md md:text-lg mb-1">
                Tips for Personalized Learning Strategies
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                Discover practical strategies that educators can implement to
                tailor learning experiences to meet the unique needs of each
                student.
              </p>
            </div>
          </div>
          <div className="bg-[#FFFFFF] rounded-xl flex items-center gap-6 w-full max-w-3xl shadow-sm p-10">
            {/* Image with Blob Shape */}
            <div className="w-[150px] h-[150px]">
              <img
                src={teacher}
                alt="Kids"
                className="w-full h-full object-cover"
                style={{
                  clipPath: "ellipse(46% 40% at 45% 43%)",
                }}
              />
            </div>

            {/* Text Content */}
            <div className="max-w-md">
              <h3 className="text-[#1d588e] font-semibold text-md md:text-lg mb-1">
                Tips for Personalized Learning Strategies
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                Discover practical strategies that educators can implement to
                tailor learning experiences to meet the unique needs of each
                student.
              </p>
            </div>
          </div>
        </div>

        <button className="mt-8 bg-[#FFA500] hover:bg-[#e69500] text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 pl-5 pr-6">
          View
        </button>
      </div>
      {/* Blog section */}

      <section className="max-w-7xl mx-auto py-14 -translate-y-10 lg:translate-y-0">
        <div>
          <h1
            className="text-xl md:text-3xl text-center"
            style={{ fontFamily: "Poppins" }}
          >
            <span className="text-[#000000]">OUR HAPPY</span>{" "}
            <span className="text-[#194FC4]">PARENTS</span>
          </h1>
          <hr className="border-[#507169] mx-auto w-[100px] mt-4 font-bold border" />
        </div>
        <div className="py-4">
          <p className="md:text-xl mx-4">
            "Discover how our dedicated community and nurturing environment have
            transformed the educational journey for our families. Hear firsthand
            from parents about the positive impact our school has had on their
            children's growth and development."
          </p>
        </div>
        <div className="grid  md:grid-cols-3 lg:grid-cols-3 md:justify-between gap-4 px-4 md:px-0 py-6 md:py-12 mx-auto justify-center items-center md:items-start md:mx-6">
          {/* First Testimonial */}
          <div className="relative flex-1 max-w-[280px] py-4 md:py-0">
            <div className="h-[250px] w-[220px] bg-[#FF3935] absolute transform rotate-12  rounded-3xl lg:w-[272px] lg:h-[268px]"></div>
            <div
              className="h-[250px] w-[220px] bg-white relative rounded-3xl shadow-xl  lg:w-[260px] lg:h-[272px]"
              style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.55)" }}
            >
              <h2 className="text-black text-center py-12 lg:py-16">
                "We are grateful for the nurturing environment where our
                daughter has flourished academically and socially!"
                <h3 className="text-start pl-4 py-4">--Anitha Verma</h3>
              </h2>
              <img
                src={Testimonial1}
                alt="Testimonial1"
                className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 lg:w-[86px] lg:h-[88px]"
              />
            </div>
          </div>

          {/* Second Testimonial */}
          <div className="relative flex-1 max-w-[280px] py-4 md:py-0 mt-[30px] md:mt-0">
            <div className="h-[250px] w-[220px] bg-[#43665E] absolute transform rotate-12 rounded-3xl lg:w-[272px] lg:h-[268px]"></div>
            <div
              className="h-[250px] w-[220px] bg-white relative rounded-3xl shadow-xl lg:w-[260px] lg:h-[272px]"
              style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.55)" }}
            >
              <h2 className="text-black text-center py-12 lg:py-16">
                "We are grateful for the nurturing environment where our
                daughter has flourished academically and socially!"
                <h3 className="text-start pl-4 py-4">--Anitha Verma</h3>
              </h2>
              <img
                src={Testimonial2}
                alt="Testimonial2"
                className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 lg:w-[86px] lg:h-[88px]"
              />
            </div>
          </div>

          {/* Third Testimonial */}
          <div className="relative flex-1 max-w-[280px] py-4 md:py-0 mt-[30px] md:mt-0">
            <div className="h-[250px] w-[220px] bg-[#C2089A] absolute transform rotate-12 rounded-3xl lg:w-[272px] lg:h-[268px]"></div>
            <div
              className="h-[250px] w-[220px] bg-white relative rounded-3xl shadow-xl lg:w-[260px] lg:h-[272px]"
              style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.55)" }}
            >
              <h2 className="text-black text-center py-12 lg:py-16">
                "We are grateful for the nurturing environment where our
                daughter has flourished academically and socially!"
                <h3 className="text-start pl-4 py-4">--Anitha Verma</h3>
              </h2>
              <img
                src={Testimonial3}
                alt="Testimonial3"
                className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 rounded-full h-16 w-16 lg:w-[86px] lg:h-[88px]"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="relative bg-[#24588e] text-white text-center py-20  overflow-hidden rounded-md ">
          {/* Top Left Stars */}
          <img
            src={starGroup}
            alt="stars"
            className="absolute top-10 left-10 w-10 md:w-12"
          />

          {/* Bottom Right Stars */}
          <img
            src={starGroup}
            alt="stars"
            className="absolute bottom-4 right-4 w-10 md:w-12"
          />

          <h2 className="text-xl md:text-3xl font-semibold mb-4">
            Have Questions About School Applications or Support?
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-base mb-6">
            If you're a parent or student looking for help applying to a school,
            understanding your options, or learning how ShikshaMitra can support
            your education — we’re here to help. Reach out to us with your
            queries, and our team will guide you through the next steps.
          </p>
          <button className="bg-[#f7931e] text-white px-5 py-2 rounded text-sm font-medium hover:bg-[#e4820f] transition">
            CONTACT
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
