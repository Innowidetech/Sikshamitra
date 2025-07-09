import React from 'react';
import { FaUserGraduate, FaFemale, FaMale } from "react-icons/fa";
import AdmissionTable from './admissionpage/AdmissionTable';
import { useSelector } from 'react-redux';

function Admission({ setActiveTab }) {
    const { newAdmissions, newAdmissionsCounts } = useSelector((state) => state.admissions);

    // Use counts directly from newAdmissionsCounts
    const total = newAdmissionsCounts?.total || 0;
    const male = newAdmissionsCounts?.male || 0;
    const female = newAdmissionsCounts?.female || 0;

    return (
        <>
            <div className="flex justify-between items-center mx-8 py-10">
                <div className="inline-block">
                    <h1 className="text-xl font-light text-black xl:text-[38px]">Admission</h1>
                    <hr className="border-t-2 border-[#146192] mt-1" />
                    <h1 className="mt-2">
                        <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
                        {">"}
                        <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
                            Admission
                        </span>
                    </h1>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 px-4 gap-6 mx-4 lg:mx-8 mb-6">
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-around space-x-4 border-l-[8px] border-[#5C4E8E]">
                    <div className="rounded-full">
                        <FaUserGraduate className="h-6 w-6 text-[#5C4E8E]" />
                    </div>
                    <hr className="h-14 w-[2px] bg-gray-300" />
                    <div>
                        <p className="">New Admissions</p>
                        <h3 className="text-center text-2xl font-medium">{total}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-around space-x-4 border-l-[8px] border-[#FFC000]">
                    <div className="rounded-full">
                        <FaMale className="h-6 w-6 text-[#FFC000]" />
                    </div>
                    <hr className="h-14 w-[2px] bg-gray-300" />
                    <div>
                        <p className="">Male</p>
                        <h3 className="text-center text-2xl font-medium">{male}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-around space-x-4 border-l-[8px] border-[#3FB56F]">
                    <div className="rounded-full">
                        <FaFemale className="h-6 w-6 text-[#3FB56F]" />
                    </div>
                    <hr className="h-14 w-[2px] bg-gray-300" />
                    <div>
                        <p className="">Female</p>
                        <h3 className="text-center text-2xl font-medium">{female}</h3>
                    </div>
                </div>
            </div>
            <div>
               <AdmissionTable setActiveTab={setActiveTab} />
            </div>
        </>
    );
}

export default Admission;
