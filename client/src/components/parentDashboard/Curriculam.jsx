import React from 'react';
import Header from './layout/Header';

function Curriculam() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mx-4 sm:mx-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-black xl:text-[38px]">Curriculam</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="text-base sm:text-xl xl:text-[17px]">Home</span> {'>'}
            <span className="text-base sm:text-xl xl:text-[17px] font-medium text-[#146192]">Curriculam</span>
          </h1>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <Header />
        </div>
      </div>
    </>
  );
}

export default Curriculam;