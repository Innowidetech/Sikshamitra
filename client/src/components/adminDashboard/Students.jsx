import React from "react";
import StudentsTable from "./studentsPage/StudentsTable";
import { History } from "lucide-react";

function Students({ openHistory }) {
  return (
    <>
      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[32px]">
            Student
          </h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
              Student's Data
            </span>
          </h1>
        </div>

        <div className="flex justify-end lg:mx-16 overflow-x-hidden">
          <button
            onClick={openHistory}
            className="bg-[#146192] text-white text-xs lg:text-lg md:px-4 py-2 p-1 rounded-md flex items-center gap-2 hover:bg-[#0f4c7a] transition-colors"
          >
            <History size={20} />
            History
          </button>
        </div>
      </div>

      <div>
        <StudentsTable />
      </div>
    </>
  );
}

export default Students;


