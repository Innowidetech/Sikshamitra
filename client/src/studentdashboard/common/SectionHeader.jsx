import React from 'react';

export const SectionHeader = ({ title }) => {
  return (
    <div className="bg-[#146192] text-white p-3 mb-6 rounded-tl-xl rounded-tr-xl ">
      <h2 className="text-lg lg:text-2xl font-semibold xl:text-[23px]">{title}</h2>
    </div>
  );
};