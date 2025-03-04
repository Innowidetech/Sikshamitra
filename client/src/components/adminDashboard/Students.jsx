import React,{useState} from 'react';
import Header from './layout/Header';
import StudentsTable from './studentsPage/StudentsTable';
import AddStudent from './studentsPage/AddStudents';

function Students() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddStudent = (studentData) => {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="flex justify-between items-center mx-8">
        <div>
          <h1 className="md:text-2xl font-light text-black xl:text-[38px]">Student</h1>
          <hr className="mt-2 border-[#146192] border-[1px] md:w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs md:text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xs md:text-xl font-medium text-[#146192]">Student's data</span>
          </h1>
        </div>
        <div>
          <Header />
        </div>
      </div>
      <div>
      <div className='flex justify-end md:mx-16 mx-10'>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146192] text-white mb-4 rounded-lg"
          style={{fontFamily:'Poppins'}}
        >
          Add Student
        </button>
        <AddStudent
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddStudent}
        />
        </div>
      <StudentsTable/>
      </div>
    </>
  );
}

export default Students;