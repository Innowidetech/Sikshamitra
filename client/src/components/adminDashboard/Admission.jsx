import React,{useEffect} from 'react';
import Header from './layout/Header';
import { School } from 'lucide-react';
import { FaUserGraduate } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import AdmissionTable from './admissionpage/AdmissionTable';
import { useDispatch, useSelector } from 'react-redux';
import {fetchAdmissions} from '../../redux/admission';


function Admission() {
  const dispatch = useDispatch();
    const { admissions, loading, error, } = useSelector((state) => state.admissions);

    useEffect(() => {
      if (!admissions || admissions.length === 0) {
        dispatch(fetchAdmissions());
      }
    }, [dispatch, admissions]);


    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  

  return (
    <>
    <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Admission</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Admission</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 px-4 mb-6 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-around space-x-4 border-l-[8px] border-[#5C4E8E]">
          <div className="rounded-full">
            <FaUserGraduate className="h-6 w-6 text-[#5C4E8E]" />
          </div>
          <hr className="h-14 w-[2px] bg-gray-300" />
          <div>
            <p className="">Students</p>
            <h3 className="text-2xl font-medium">{admissions.totalStudentsOfSchool}</h3>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-around  space-x-4  border-l-[8px] border-[#FFC000]">
          <div className="rounded-full">
            <School className="h-6 w-6 text-[#FFC000]" />
          </div>
          <hr className="h-14 w-[2px] bg-gray-300" />
          <div>
            <p className="">New Admissions</p>
            <h3 className="text-2xl font-medium">{admissions.total}</h3>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-around space-x-4 border-l-[8px] border-[#3FB56F]">
          <div className="rounded-full">
            <FaFemale className="h-6 w-6 text-[#3FB56F]" />
          </div>
          <hr className="h-14 w-[2px] bg-gray-300" />
          <div>
            <p className="">Female</p>
            <h3 className="text-2xl font-medium">{admissions.female}</h3>
          </div>
        </div>
      </div>
      <div>
      <AdmissionTable admissions={admissions}/>
      </div>
    </>
  )
}

export default Admission