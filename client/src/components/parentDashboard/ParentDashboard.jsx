import React, { useEffect } from "react";
import Header from "./layout/Header";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setSelectedStudent } from '../../redux/parent/pkidsSlice';

function ParentDashboard() {
  const dispatch = useDispatch();
  const { profile, selectedStudent, status, error } = useSelector((state) => state.pkids);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardData());
    }
  }, [status, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleStudentChange = (event) => {
    const studentName = event.target.value;
    dispatch(setSelectedStudent(studentName));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mx-8 overflow-x-hidden">
        <div className="flex justify-between items-center py-6 px-8">
          <h1 className="text-xl font-bold text-[#1982C4] xl:text-[36px]" style={{ fontFamily: "Poppins" }}>
            Dashboard
          </h1>
        </div>
        <div className="relative flex items-center space-x-6">
          <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 text-[#146192] w-5 h-5" />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#1982C4]/20 md:w-40 lg:w-64 shadow-[4px_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
        <div>
          <Header />
        </div>
      </div>

      {/* Section Below the Header - Aligned Left */}
      <div className="bg-white p-4 flex items-center justify-start space-x-4  mt-4">
        <span className="text-lg text-[#303972]">Student :</span>
        <div className="relative w-48 md:w-64">
          <select
            value={selectedStudent}
            onChange={handleStudentChange}
            className="border border-[#1982C4] rounded-md p-2 text-[#303972] focus:outline-none w-full"
          >
            <option value="Student 1">Student 1</option>
            <option value="Student 2">Student 2</option>
          </select>
        </div>
      </div>


      
      
    </>
  );
}

export default ParentDashboard;
