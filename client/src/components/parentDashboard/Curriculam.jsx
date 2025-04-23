import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './layout/Header';
import classImage from '../../assets/class.png';
import syllabusImage from '../../assets/Syllabus.jpg';
import {
  fetchAimObjective,
  fetchSyllabus,
  fetchClassPlans,
} from '../../redux/parent/curriculumSlice';

function Curriculam({ setActiveTab }) {
  const dispatch = useDispatch();
  const { aimObjective, syllabus, classPlans } = useSelector((state) => state.curriculum);

  useEffect(() => {
    dispatch(fetchAimObjective());
    dispatch(fetchSyllabus());
    dispatch(fetchClassPlans());
  }, [dispatch]);

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center mx-6 md:mx-10 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Curriculam</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Curriculam</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Aims and Objectives Section */}
      <div className="my-10 mx-6 md:mx-10 bg-white rounded-xl shadow-lg py-8 px-4 md:ml-72">
        <h1 className="text-xl font-semibold text-center underline mb-6 text-black">
          School Aims and Objectives
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aimObjective?.aimObjectives?.length > 0 ? (
            aimObjective.aimObjectives.map((aim) => (
              <div
                key={aim._id}
                className="bg-[#285A87] rounded-lg p-6 h-full flex flex-col justify-center text-white shadow-md"
              >
                <h2 className="text-lg font-semibold underline text-center mb-4">{aim.title}</h2>
                <p className="text-sm text-center">{aim.description || 'No description available.'}</p>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3">No aim and objectives available.</p>
          )}
        </div>
      </div>

      {/* Syllabus and Class Plan Section */}
      <div className="my-10 mx-6 md:mx-10 md:ml-72">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Syllabus Card */}
          <div
            className="relative h-[220px] rounded-lg overflow-hidden shadow-md"
            style={{
              backgroundImage: `url(${syllabusImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <h2 className="text-white text-xl mb-4">Syllabus</h2>
              {syllabus?.syllabus?.length > 0 ? (
                <button
                  onClick={() => setActiveTab('syllabus')}
                  className="px-6 py-2 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition"
                >
                  View Syllabus
                </button>
              ) : (
                <p className="text-white">No syllabus available.</p>
              )}
            </div>
          </div>

          {/* Class Plan Card */}
          <div
            className="relative h-[220px] rounded-lg overflow-hidden shadow-md"
            style={{
              backgroundImage: `url(${classImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <h2 className="text-white text-xl mb-4">Class Plan</h2>
              {classPlans?.classPlan?.length > 0 ? (
                <button
                  onClick={() => setActiveTab('classplans')}
                  className="px-6 py-2 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition"
                >
                  View Class Plan
                </button>
              ) : (
                <p className="text-white">No class plans available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Curriculam;