import React from 'react';
import Header from '../adminDashboard/layout/Header';

function Lectures() {
  return (
    <>
    <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Lectures</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Lectures</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>
    </>
  )
}

export default Lectures