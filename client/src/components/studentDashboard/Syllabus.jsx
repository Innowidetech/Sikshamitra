import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ added
import Header from "./layout/Header";
import classImage from "../../assets/class.png";
import syllabusImage from "../../assets/syllabus1.jpg";
import { fetchSyllabus } from "../../redux/student/syllabusSlice";

function Syllabus() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ hook to navigate
  const { data, loading, error } = useSelector((state) => state.syllabus);

  useEffect(() => {
    dispatch(fetchSyllabus());
  }, [dispatch]);

  return (
    <>
      {/* Header Section */}
       {/* Page Heading – Visible only on md (tablet) and above */}
<div className="hidden md:flex justify-between items-start md:items-center mx-4 md:mx-8 -mt-12">
  {/* Left: Title + Breadcrumb */}
  <div>
    <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Curriculum</h1>
    <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
    <h1 className="mt-1 text-sm sm:text-base">
      <span>Home</span> {">"}{" "}
      <span className="font-medium text-[#146192]">Curriculum</span>
      
    </h1>
  </div>

  {/* Right: Header Icons (also visible in mobile) */}
  <Header />
</div>

{/* Header only for mobile and tablet (below md) */}
<div className="md:hidden">
  <Header />
</div>

      {/* Main Container */}
      <div className="my-10 mx-4 md:mx-10">
        <div className="bg-[#94A7B829] rounded-lg shadow-lg w-full p-6">
          <h1 className="font-semibold text-center text-black text-xl underline">
            School Aim And Objectives
          </h1>

          {loading ? (
            <p className="text-center text-gray-600 mt-4">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
              {data?.aimObjectives?.length > 0 ? (
                data.aimObjectives.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col justify-center items-center border p-6 rounded-lg shadow-md bg-[#285A87]"
                  >
                    <h2 className="text-center text-lg font-semibold text-white underline">
                      {item.title}
                    </h2>
                    <p className="text-center text-sm text-white mt-4">
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">No objectives available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="my-10 mx-4 md:mx-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Box 1 */}
          <div className="relative flex flex-col justify-center items-center border p-6 md:p-8 rounded-3xl shadow-md w-full md:w-1/2 h-[400px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 rounded-3xl"
              style={{ backgroundImage: `url(${syllabusImage})` }}
            ></div>
            <button
              className="relative mt-4 px-6 py-3 bg-[#146192] text-white font-semibold rounded-full"
              onClick={() => navigate("/student/syllabus-view")} // ✅ navigation on click
            >
              View Syllabus
            </button>
          </div>

        {/* Box 2 - View Class Plan */}
        <div className="relative flex flex-col justify-center items-center border p-6 md:p-8 rounded-3xl shadow-md w-full md:w-1/2 h-[400px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 rounded-3xl"
              style={{ backgroundImage: `url(${classImage})` }}
            ></div>
            <button
              className="relative mt-4 px-6 py-3 bg-[#146192] text-white font-semibold rounded-full"
              onClick={() => navigate("/student/class-plan")}
            >
              View Class Plan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Syllabus;
