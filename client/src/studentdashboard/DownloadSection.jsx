import React from 'react';
import { SectionHeader } from './common/SectionHeader';

const DownloadSection = () => {
  return (
    <div className="p-6 w-full md:mt-10 lg:mt-16 grid xl:max-w-5xl mx-auto" style={{fontFamily:'Poppins'}}>
      <SectionHeader title="DOWNLOAD" />
      <div className="md:max-w-xl lg:max-w-3xl xl:max-w-5xl space-y-6 text-[#1982C4]">
        <p>Download your application details here.</p>
      </div>
    </div>
  );
};

export default DownloadSection;