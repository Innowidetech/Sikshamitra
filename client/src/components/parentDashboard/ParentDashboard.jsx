import React, { useEffect } from "react";
import Header from "./layout/Header";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setSelectedStudent } from '../../redux/parent/pkidsSlice';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart elements for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

function ParentDashboard() {
  const dispatch = useDispatch();
  const { profile, selectedStudent, status, error } = useSelector((state) => state.pkids);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardData());
    }
  }, [status, dispatch]);

  const handleStudentChange = (e) => {
    const selectedStudentData = e.target.value;
    dispatch(setSelectedStudent(selectedStudentData));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // Example data for the pie chart
  const pieData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [60, 30, 10], // Sample data
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

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

      {/* Student dropdown section */}
      <div className="flex items-center mx-8 my-4">
        <label htmlFor="student-dropdown" className="text-lg font-semibold text-[#121313]" style={{ fontFamily: "Poppins" }}>
          Student:
        </label>
        <select
          id="student-dropdown"
          value={selectedStudent?.id || ''}
          onChange={handleStudentChange}
          className="ml-4 px-4 py-2 rounded-lg w-36 bg-[#D8E7F5]"
        >
          <option value="">Select a student</option>
          <option value="student1">Student 1</option>
          <option value="student2">Student 2</option>
        </select>
      </div>

      {/* Main Content Section: Left Box (Pie Chart & 4 Boxes) */}
      <div className="flex justify-start my-6 bg-white shadow-lg rounded-lg p-6 w-1/2 ">
  {/* Left Side: Pie Chart */}
  <div className="flex justify-center items-center w-1/4 h-full">
    <Pie
      data={pieData}
      options={{
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
          },
        },
        maintainAspectRatio: false,
        aspectRatio: 1, // Makes the pie chart circular
        height: 150, // Set the height of the pie chart
        width: 150,  // Set the width of the pie chart
      }}
    />
  </div>

  {/* Right Side: 4 Boxes */}
  <div className="w-3/4 flex flex-col gap-6">
    {/* First row: Box 1 and Box 2 */}
    <div className="flex gap-6">
      {/* Box 1 */}
      <div className="w-1/2 bg-[#D8E7F5] p-4 rounded-lg shadow-md h-32">
        <h3 className="text-lg font-semibold text-[#1982C4]">Box 1</h3>
        <p className="mt-4 text-sm text-gray-600">Content for box 1</p>
      </div>

      {/* Box 2 */}
      <div className="w-1/2 bg-[#D8E7F5] p-4 rounded-lg shadow-md h-32">
        <h3 className="text-lg font-semibold text-[#1982C4]">Box 2</h3>
        <p className="mt-4 text-sm text-gray-600">Content for box 2</p>
      </div>
    </div>

    {/* Second row: Box 3 and Box 4 */}
    <div className="flex gap-6">
      {/* Box 3 */}
      <div className="w-1/2 bg-[#D8E7F5] p-4 rounded-lg shadow-md h-32">
        <h3 className="text-lg font-semibold text-[#1982C4]">Box 3</h3>
        <p className="mt-4 text-sm text-gray-600">Content for box 3</p>
      </div>

      {/* Box 4 */}
      <div className="w-1/2 bg-[#D8E7F5] p-4 rounded-lg shadow-md h-32">
        <h3 className="text-lg font-semibold text-[#1982C4]">Box 4</h3>
        <p className="mt-4 text-sm text-gray-600">Content for box 4</p>
      </div>
    </div>
  </div>
</div>

    </>
  );
}

export default ParentDashboard;
