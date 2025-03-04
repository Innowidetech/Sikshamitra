import React, { useState } from 'react'
import TeachersTable from './TeachersPage/TeachersTable'
import AddTeacherModal from './TeachersPage/AddTeachers'

function Teachers() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleAddTeacher = (teacherData) => {
    setIsModalOpen(false);
  }

  return (
    <>
       <div className="flex justify-between items-center mx-8 py-10 ">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">Teachers</h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
             Teacher's data
            </span>
          </h1>
        </div> 
        <div className='flex justify-end md:mx-16 overflow-x-hidden mx-6'>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146192] text-white mb-4 rounded-lg"
          style={{ fontFamily: 'Poppins' }}
        >
          Add Teachers
        </button>
        <AddTeacherModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddTeacher}
        />
      </div>
      </div>
      
      <div>
        <TeachersTable />
      </div>
    </>
  )
}

export default Teachers