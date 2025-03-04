import React from 'react'
import Aboutimg1 from './assets/aboutimg1.png';
import Aboutimg2 from './assets/aboutimg2.png';
import Aboutimg3 from './assets/aboutimg3.png';
import AboutIcon1 from './assets/abouticon1.png';
import AboutIcon2 from './assets/abouticon2.png';
import AboutIcon3 from './assets/abouticon3.png';
import AboutIcon4 from './assets/abouticon4.png';
import AboutFirst from './assets/aboutfirst.png';
import Aboutend from './assets/aboutend.png';
import AboutRight1 from './assets/aboutright1.png';
import AboutRight2 from './assets/aboutright2.png';
import AboutLeft1 from './assets/aboutleft1.png';
import AboutLeft2 from './assets/aboutleft2.png';

function About() {
  return (
    <>
      <section className="xl:min-w-[1440px]  bg-[#FF9F1C] xl:mt-[30px] xl:flex xl:justify-between mt-[20px]">
        <div className="p-4 xl:p-0 xl:w-[282px] xl:h-[262px] text-white xl:flex xl:flex-col xl:justify-center xl:ml-[69px]">
          <h1 className="xl:text-[16px] text-lg">HOME/ABOUT US</h1>
          <h3 className="xl:text-[68px] font-semibold text-3xl w-[120px] ml-4 xl:ml-0 xl:w-auto">WHO</h3>
          <h4 className="xl:text-[68px] font-semibold text-3xl w-[120px] ml-4 xl:ml-4 xl:w-auto xl:mt-6">WE ARE</h4>
        </div>
        <div className="xl:w-[600px] xl:h-[262px] flex justify-end">
          <img src={Aboutimg1} alt="Aboutimg1" className="xl:max-w-full xl:h-auto h-[200px]" />
        </div>
      </section>

      <section className="xl:ml-[112px] mx-auto py-16 ">
        <div>
          <h1 className="text-xl md:text-3xl text-center xl:text-[50px] font-extralight text-[#1982C4]" style={{ fontFamily: 'Poppins' }}>
            OUR MISSION
          </h1>
          <hr className="border-[#D48D2D] mx-auto w-[100px] mt-4 font-bold border" />
        </div>
        <div className="py-4 flex justify-center">
          <p className="md:text-xl  mx-4 xl:text-[#1982C4] font-bold xl:text-[23px]">
            Inspiring Excellence in Education
          </p>
        </div>
        <div className='md:flex xl:w-[1215px] xl:h-[501px] xl:mt-[70px] xl:ml-[32px] mx-4 md:ml-12 lg:mt-10'>
          <div className='mx-4 p-2 md:mx-0 md:p-0'>
            <img src={Aboutimg2} alt="Aboutimg2" className='xl:w-[396px] xl:h-[500px] ml-2 md:ml-0' />
          </div>
          <div>
            <div className='bg-[#1982C4] mx-6 ml-8 md:ml-0 xl:w-[775px] xl:h-[403px] rounded-lg xl:ml-[43px] md:h-[400px] md:w-[300px] lg:w-[460px] lg:ml-12 lg:p-4 lg:h-[430px]'>
              <div className='p-4 md:p-0 xl:ml-[62px] xl:p-[54px] xl:w-[670px] xl:font-light xl:text-[19px] md:mx-4 md:px-4 xl:px-0'>
                <label className='text-white'>
                  At Shikshamitra, our mission is to ignite a passion for learning and personal growth in every student. We are committed to creating a dynamic educational environment that encourages innovation, resilience, and collaboration.Our focus is on nurturing each child's potential through personalized learning experiences, empowering them to become confident, responsible citizens. We believe in fostering strong partnerships with families and the community to support holistic development. Together, we aim to shape future leaders who will positively impact the world.
                </label>
              </div>
            </div>
            <button className='bg-[#FF9F1C] text-white rounded-br-full rounded-tl-full  xl:w-[210px] xl:h-[55px]  w-[140px] h-[41px] mt-[20px] ml-10 md:ml-0 xl:translate-x-12 lg:ml-12 xl:ml-0'>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className='xl:ml-[130px] lg:flex xl:max-w-[1215px] xl:min-h-[562px] bg-[#FF9F1C] rounded-xl xl:mx-auto xl:py-[62px] xl:px-[58px] mx-6 md:mx-0 py-8 px-6'>
        <div className='grid '>
          <div className='xl:w-[630px] p-4 md:p-0'>
            <h1 className='xl:text-[35px] text-white md:mb-[30px] md:text-center xl:text-start text-2xl mb-[20px] w-[130px] md:w-auto'>PLAY AS YOU LEARN</h1>
            <label className='xl:text-[21px] font-extralight text-white text-center xl:text-start text-xl '>Our philosphy is learning through play as we offer a stimulating environment for children </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 ml-4 md:ml-0 gap-6 items-center md:mt-[40px] md:gap-[30px] xl:gap-0 xl:mt-0" style={{ fontFamily: 'Poppins' }}>
            <div className="flex items-center space-x-4 xl:w-[265px] xl:h-[74px]">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <img src={AboutIcon1} alt="AboutIcon1" className="w-10 h-10" />
              </div>
              <label className="font-semibold text-md text-white xl:w-[177px] xl:text-[24px] w-[120px]">FRIENDLY PLACE</label>
            </div>
            <div className="flex items-center space-x-4 xl:w-[265px] xl:h-[74px]">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <img src={AboutIcon2} alt="AboutIcon2" className="w-10 h-10" />
              </div>
              <label className="font-semibold text-md text-white xl:w-[177px] xl:text-[24px] w-[120px]">VARIED CLASSES</label>
            </div>
            <div className="flex items-center space-x-4 ">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <img src={AboutIcon3} alt="AboutIcon3" className="w-10 h-10" />
              </div>
              <label className="font-semibold text-md text-white xl:w-[177px] xl:text-[24px] w-[120px]">ONLINE ACCESS</label>
            </div>
            <div className="flex items-center space-x-4 xl:w-[265px] xl:h-[74px]">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <img src={AboutIcon4} alt="AboutIcon4" className="w-10 h-10" />
              </div>
              <label className="font-semibold text-md text-white xl:w-[177px] xl:text-[24px] w-[120px]">TRANSPORTATION</label>
            </div>
          </div>
        </div>
        <div className='xl:mt-[50px] xl:ml-[30px] ml-[20px] mt-[30px] md:flex md:justify-center'>
          <img src={Aboutimg3} alt="Aboutimg3" className='xl:w-[421px] xl:h-[398px] h-full w-auto' />
        </div>
      </section>

      <section className="mx-auto py-16 px-4">
        <div className="py-4 text-center">
          <p className="text-xl mx-4 text-[#1982C4] font-medium xl:text-[23px]">
            OUR DIRECTORS MESSAGE
          </p>
          <hr className="border-[#1982C4] mx-auto w-[100px] mt-4 font-bold border xl:w-[260px]" />
        </div>

        <div className="md:flex gap-8 max-w-6xl mx-auto md:mt-[50px]  xl:gap-[50px] flex-col sm:flex-row">
          {/* First Box */}
          <div className="bg-[#1982C4] p-8 rounded-br-[100px] shadow-lg w-full lg:h-[246px] lg:w-[511px] mx-4 -translate-x-4 md:translate-x-0">
            <div className="flex items-center text-white">
              <span className="mr-4 text-2xl">•</span>
              <h1 className="lg:text-2xl font-semibold">
                A Vision For The Future
              </h1>
            </div>
            <p className="mt-4 text-white text-xs lg:text-xl">
              Dear Students, Parents, and Educators, we are committed to transforming education through innovative technology. Together, we can create a brighter future for our students.
            </p>
          </div>

          {/* Second Box */}
          <div className="bg-[#1982C4] p-8 rounded-br-[100px] shadow-lg w-full lg:h-[246px] lg:w-[511px] mx-4 mt-6 sm:mt-0 -translate-x-4 md:translate-x-0">
            <div className="flex items-center text-white">
              <span className="mr-4 text-2xl">•</span>
              <h1 className="lg:text-2xl font-semibold">
                Commitment To Excellence
              </h1>
            </div>
            <p className="mt-4 text-white text-xs lg:text-xl">
              We strive to simplify school management while empowering teachers and engaging students. Let’s work together to inspire creativity and excellence in every classroom.
            </p>
          </div>
        </div>
      </section>

      <section className="xl:ml-[100px] py-16 px-4 -translate-y-24 xl:translate-y-0 xl:mr-[100px] mx-4 md:mx-4">
        <div className="py-4 text-center mb-[20px] xl:mb-0">
          <p className="text-xl mx-4 text-[#1982C4] xl:text-[34px]">
            OUR GALLERY
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:mt-[60px]">
          {/* Left Section */}
          <div className="xl:col-span-6 space-y-4">
            <div>
              <img 
                src={AboutFirst} 
                alt="School facility entrance" 
                className="w-full h-[298px] object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img 
                  src={AboutLeft1} 
                  alt="Students in classroom" 
                  className="w-full h-[293px] object-cover rounded-lg"
                />
              </div>
              <div>
                <img 
                  src={AboutLeft2} 
                  alt="School activities" 
                  className="w-full h-[293px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="xl:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img 
                  src={AboutRight1} 
                  alt="Learning environment" 
                  className="w-full h-[293px] object-cover rounded-lg"
                />
              </div>
              <div>
                <img 
                  src={AboutRight2} 
                  alt="Student activities" 
                  className="w-full h-[293px] object-cover rounded-lg"
                />
              </div>
            </div>
            <div>
              <img 
                src={Aboutend} 
                alt="School library" 
                className="w-full h-[298px] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
