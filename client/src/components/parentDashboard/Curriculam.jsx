import React from 'react';
import Header from './layout/Header';
import classImage from "../../assets/class.png"; 
import syllabusImage from '../../assets/Syllabus.jpg'

function Curriculam() {
  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Curriculam</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Curriculam</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Container with 3 horizontal boxes */}
      <div className="my-10 mx-10 bg-[#94A7B829] h-96 rounded-lg shadow-lg">
        <h1 className="p-6 font-semibold text-center text-black text-xl underline">School Aim And Objectives</h1>
        {/* Container for the 3 boxes */}
        <div className="flex justify-between items-center space-x-4 ml-10 mr-10">
          {/* Box 1 */}
          <div className="flex flex-col justify-center items-center border p-6 mt-16 rounded-lg shadow-md bg-[#285A87] w-full sm:w-1/3">
            <h2 className="text-center text-lg font-semibold text-white underline">Academic Excellence</h2>
            <p className="text-center text-sm text-white mt-4">
              Focusing on high-quality education that nurtures critical thinking, creativity, and academic success.
            </p>
          </div>

          {/* Box 2 */}
          <div className="flex flex-col justify-center items-center border p-6 mt-16 rounded-lg shadow-md bg-[#285A87] w-full sm:w-1/3">
            <h2 className="text-center text-lg font-semibold text-white underline">Holistic Development</h2>
            <p className="text-center text-sm text-white mt-4">
              Promoting personal growth, physical well-being, emotional intelligence, and leadership skills.
            </p>
          </div>

          {/* Box 3 */}
          <div className="flex flex-col justify-center items-center border p-6 mt-16 rounded-lg shadow-md bg-[#285A87] w-full sm:w-1/3">
            <h2 className="text-center text-lg font-semibold text-white underline">Social Responsibility</h2>
            <p className="text-center text-sm text-white mt-4">
              Encouraging students to engage in community service and develop a sense of social responsibility.
            </p>
          </div>
        </div>
      </div>

      {/* New Container with 2 horizontal boxes */}
      <div className="my-10 mx-10 h-80">

        <div className="flex justify-between items-center space-x-4 ml-10 mr-10">
          {/* Box 1 */}
          <div className="relative flex flex-col justify-center items-center border p-8 mt-16 rounded-lg shadow-md w-full sm:w-1/2">
            {/* Image as background with opacity */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${syllabusImage})` }}></div>
            
            
            <button className="relative mt-4 px-6 py-2 bg-[#146192] text-white font-semibold rounded-md">View Syllabus</button>
          </div>

          {/* Box 2 */}
          <div className="relative flex flex-col justify-center items-center border p-8 mt-16 rounded-lg shadow-md w-full sm:w-1/2">
            {/* Image as background with opacity */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40 " style={{ backgroundImage: `url(${classImage})` }}></div>
            
           
            <button className="relative mt-4 px-6 py-2 bg-[#146192] text-white font-semibold rounded-md">View Class Plan</button>
          
          </div>
        </div>
      </div>
    </>
  );
}

export default Curriculam;
