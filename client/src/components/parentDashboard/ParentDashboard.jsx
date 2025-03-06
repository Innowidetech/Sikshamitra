import React, { useEffect, useState } from "react";
import Header from "./layout/Header"; // Ensure this is correctly exported
import { Phone, Search } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setSelectedStudent } from '../../redux/parent/pkidsSlice';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Calendar } from "react-calendar";
import studentImage from "../../assets/studentImage.jpg";


// Register chart elements for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

function ParentDashboard() {
  const dispatch = useDispatch();
  const { profile, selectedStudent, status, error } = useSelector((state) => state.pkids);
  const [date, setDate] = useState(new Date()); // State for selected date in calendar

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

  // Example data for the pie chart (could be dynamic based on the student's data)
  const pieData = {
    datasets: [
      {
        data: [60, 30, 10], 
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const student = {
    name: "John Doe",
    grade: "Grade 5",
    email: "john@gmail.com",
    Phone : 24342346778,
    gender: "male",  
    dob:   "26-03-2000",
    address: "123 Main Street, City, Country",  // Added address as personal detail
   
    imageUrl: studentImage, // Use the imported image here

  };

  return (
    <>
      {/* Header and search bar */}
      <div className="flex justify-between items-center mx-8 overflow-x-hidden mt-6">
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

      {/* Main Content Area */}
      <div className="flex justify-between mt-8 mx-8">
        {/* Left Side Content (Dashboard Sections) */}
        <div className="w-2/3">
          {/* Student dropdown section */}
          <div className="flex items-center my-4">
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
              <option value=""> student1</option>
              <option value=""> student2</option>  
            </select>
          </div>

          {/* Attendance Section */}
          <div className="w-full bg-white rounded-lg shadow-lg  p-6 border border-[#DBDBDB] mt-10">
            <h2 className="text-xl font-bold text-[#285A87] mb-3">Attendance</h2>

            <div className="flex gap-4">
              {/* Left Side: Donut Chart */}
              <div className="flex items-center justify-center w-1/3 p-4">
                <div className="relative w-24 h-24">
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
                      aspectRatio: 1,
                      cutout: '70%', // This creates the donut effect
                      rotation: Math.PI, // Optional: Rotate the donut chart
                    }}
                  />
                  {/* Optional: Add a text label inside the donut */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white">
                    <p>Attendance</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Attendance Data */}
              <div className="w-2/3 relative ">
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2 bg-white rounded-lg shadow-lg  p-4 text-center border border-[#DBDBDB]">
                    <h3 className="text-xs font-bold text-[#292929]">Total</h3>
                    <p className="text-2xl font-bold text-[#5FE33E]">49</p>
                  </div>
                  <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                    <h3 className="text-xs font-bold text-[#292929]">Present</h3>
                    <p className="text-2xl font-bold text-[#5FE33E]">45</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                    <h3 className="text-xs font-bold text-[#292929]">Absent</h3>
                    <p className="text-2xl font-bold text-[#5FE33E]">4</p>
                  </div>
                  <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 text-center border border-[#DBDBDB]">
                    <h3 className="text-xs font-bold text-[#292929]">Holidays</h3>
                    <p className="text-2xl font-bold text-[#5FE33E]">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notices Section */}
          <div className="w-full bg-white rounded-lg shadow-lg shadow-black p-6 border border-[#DBDBDB] mt-10 min-h-[400px]">
            <h2 className="text-xl font-bold text-[#000000] mb-3">Notices</h2>
            <div className="w-full bg-[#14619259] shadow-xl p-6 border border-[#14619259] mt-10 min-h-[150px]">
              <h2 className='text-xl font-bold text-[#000000] text-center'>Annual Sports Day - 20th Jan 2025</h2>
              <p className='text-base font-poppins text-[#000000] text-center'>
                The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.
              </p>
            </div>
            <div className="w-full bg-[#FF9F1C80]  shadow-xl p-6 border border-[#FF9F1C80] mt-10 min-h-[150px]">
              <h2 className='text-xl font-bold text-[#000000] text-center'>Annual Sports Day   - 20th jan 2025</h2>
              <p className='text-base font-poppins text-[#000000] text-center'>The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.</p>
            </div>
            <div className="w-full bg-[#14619259] shadow-xl p-6 border border-[#14619259] mt-10 min-h-[150px]">
              <h2 className='text-xl font-bold text-[#000000] text-center'>Annual Sports Day - 20th Jan 2025</h2>
              <p className='text-base font-poppins text-[#000000] text-center'>
                The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.
              </p>
            </div>
            <div className="w-full bg-[#FF9F1C80]  shadow-xl p-6 border border-[#FF9F1C80] mt-10 min-h-[150px]">
              <h2 className='text-xl font-bold text-[#000000] text-center'>Annual Sports Day   - 20th jan 2025</h2>
              <p className='text-base font-poppins text-[#000000] text-center'>The Annual Sports Day on January 20, 2025, celebrates sports, teamwork, and school spirit with exciting competitions.</p>
            </div>
            
          </div>
          
        </div>

       
        {/* Calendar Section (Right-side) */}
        <div className=" mt-12 ml-8  ">
          <h2 className="text-xl font-bold text-[#000000] mb-8">Calendar</h2> {/* Calendar Heading */}

          {/* Calendar Component */}
          <div className="flex justify-center items-center ">
            <Calendar
              value={date}
              onChange={setDate}
              className="border border-[#DBDBDB] rounded-lg shadow-lg transform -translate-y-4 p-6" // Shift the calendar slightly upwards
            />
          </div>

          {/* Student ID Card Section */}
          <div className="w-full lg:w-1/1  mt-8 lg:mt-0">
            <h2 className="text-xl font-bold text-[#000000] mb-4">Student Information</h2>
            <div className="flex justify-center items-center bg-white rounded-lg shadow-lg p-6 border border-[#DBDBDB]">
              <div className="flex flex-col items-center">
                {/* Student Image */}
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                  <img
                    src={student.imageUrl}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Student Info */}
                <div className="text-center w-full h-auto ">
                  <h3 className="text-xl font-bold text-[#285A87]">{student.name}</h3>

                </div>

                {/* Personal Details Section */}
                <div className="w-full mt-4 bg-gradient-to-r from-[#bad8ec] to-[#f8e3b7] border border-black rounded-xl p-10">
                  <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87]">
                    Personal Details
                  </h4>


                  <ul className="mt-2 text-sm text-[#666666]">
                    <li className="flex justify-between py-2">
                      <span className=" text-base text-[#285A87]">Name -</span>
                      <span className="text-base text-[#000000]">{student.name}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="text-base text-[#285A87]">Email -</span>
                      <span className="text-base text-[#000000]">{student.email}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="text-base text-[#285A87]">Phone - </span>
                      <span className="text-base text-[#000000]">{student.Phone}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="text-base text-[#285A87]">Gender -</span>
                      <span className="text-base text-[#000000]">{student.gender}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="text-base text-[#285A87]">DOB -</span>
                      <span className="text-base text-[#000000]">{student.dob}</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className="text-base text-[#285A87]">Address -</span>
                      <span className="text-base text-[#000000]"> {student.address}</span>
                    </li>
                  </ul>
                  <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87] mt-2">
                    Previous Education Details
                  </h4>
                  <li className="flex justify-between py-2">
                      <span className=" text-base text-[#285A87]">Vidya Arts And Science School -</span>
                      <span className="text-base text-[#000000]">1st To 9th</span>
                    </li>


                    <h4 className="text-xl font-semibold text-[#285A87] underline decoration-[#285A87] mt-2">
                  Student details
                  </h4>
                  <li className="flex justify-between py-2">
                      <span className=" text-base text-[#285A87]">Registration No-</span>
                      <span className="text-base text-[#000000]">22</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span className=" text-base text-[#285A87]">Joining Date-</span>
                      <span className="text-base text-[#000000]">09/08/2025</span>
                    </li>
                </div>
                 
              </div>
            </div>
          </div>
        </div>
      </div>




    </>
  );
}

export default ParentDashboard;
