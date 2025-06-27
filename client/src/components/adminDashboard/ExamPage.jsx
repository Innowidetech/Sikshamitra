// ExamPage.js
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { X } from "lucide-react";
import { fetchExams } from "../../redux/curriculum";

const ExamPage = () => {
  const dispatch = useDispatch();
  const examsData = useSelector((state) => state.adminCurriculum.exams?.exams || []);
  const [filterClass, setFilterClass] = useState("");
  const contentRef = useRef();

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const uniqueClasses = [...new Set(examsData.map((e) => e.class))];

  const filteredExams = examsData.filter((exam) => {
    return filterClass ? String(exam.class) === String(filterClass) : true;
  });

  const handleDownload = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `exam_timetable_class_${filterClass || "all"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-16 mb-16">
        <div>
          <h1 className="text-xl font-light text-black xl:text-[30px]">
            Curriculum
          </h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {">"}
            <span className="xl:text-[17px] text-lg font-medium text-[#146192]">
              Exams
            </span>
          </h1>
        </div>
      <h2 className="text-2xl font-semibold text-[#146192] mb-6 text-center">Exam Timetable</h2>

      <div className="mb-6 flex justify-center">
        <label className="mr-2 text-sm self-center">Class - </label>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      <div ref={contentRef} className="overflow-x-auto border rounded-md p-4 bg-white">
        {filteredExams.length === 0 ? (
          <p className="text-center text-gray-500">No exams found for selected class.</p>
        ) : (
          filteredExams.map((schedule) => (
            <div key={schedule._id} className="mb-6 border border-gray-300 rounded-lg overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border px-4 py-2">DATE</th>
                    <th className="border px-4 py-2">SUBJECT NAME</th>
                    <th className="border px-4 py-2">TIMINGS</th>
                    <th className="border px-4 py-2">SYLLABUS</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.exam.map((e) => (
                    <tr key={e._id}>
                      <td className="border px-4 py-2">
                        {new Date(e.date).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{e.subject}</td>
                      <td className="border px-4 py-2">10:00 am - 1:00 pm</td>
                      <td className="border px-4 py-2">{e.syllabus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleDownload}
          className="bg-[#146192] hover:bg-[#0f4c7a] text-white px-6 py-2 rounded-md"
        >
          Download ⤓
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
