import React, { useRef, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from './layout/Header';

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#146192', '#A569BD'];

const mockData = {
  message: "Results fetched successfully.",
  totalExams: 7,
  attendedExams: 1,
  pendingExams: 6,
  examsPercentage: "14.29",
  attendance: 12,
  present: 9,
  absent: 3,
  attendancePercentage: "75.00",
  totalMarks: 300,
  marksObtained: 270,
  remainingMarks: 30,
  marksPercentage: "90.00",
  performancePercentage: "59.76",
  banner: "https://res.cloudinary.com/dixhganq6/image/upload/v1747397525/s2trtvjyqslihij8php7.jpg",
  result: [
    {
      _id: "67a9c656b480f7d0d9855590",
      schoolId: "67987506ac1a5dcfa3056aee",
      class: "6",
      section: "A",
      exam: {
        _id: "683ae255fb856c77d8a1f667",
        examType: "half yearly "
      },
      student: {
        studentProfile: {
          fullname: "Unnati",
          gender: "female",
          dob: "2004-12-27T00:00:00.000Z",
          photo: "https://res.cloudinary.com/dixhganq6/image/upload/v1744874338/yghvtvvc1qaxrtvdhf0y.png",
          address: "mumbai",
          registrationNumber: "Reg16a1",
          class: "6",
          section: "A",
          classType: "secondary",
          childOf: "679b448ff7ccf1742a3b1067",
          fees: "70000",
          additionalFees: 60,
          about: "Hello I am a Student of class 6.",
          rollNumber: "",
          previousEducation: [
            {
              study: "6",
              schoolName: "vidyabharti",
              duration: "2015-2018",
              _id: "6800d749fa31828d67c8b034"
            },
            {
              study: "9",
              schoolName: "model juniar school",
              duration: "2021-2023",
              _id: "6800d749fa31828d67c8b035"
            }
          ]
        },
        _id: "679b448ff7ccf1742a3b1069",
        schoolId: "67987506ac1a5dcfa3056aee",
        userId: "679b448ff7ccf1742a3b1065",
        createdBy: "67986e3bd7a5e04dc550ba31",
        createdAt: "2025-01-30T09:21:19.479Z",
        updatedAt: "2025-06-03T11:41:57.855Z",
        __v: 18
      },
      result: [
        {
          subjectCode: "sub3",
          subject: "Chemistry",
          marksObtained: 90,
          totalMarks: 100,
          grade: "A",
          createdBy: "679ca8ac0d28f2d8b4ad9825",
          _id: "67a9c656b480f7d0d9855591"
        },
        {
          subjectCode: "sub1",
          subject: "Mathematics",
          marksObtained: 90,
          totalMarks: 100,
          grade: "A",
          createdBy: "679ca8430d28f2d8b4ad981c",
          _id: "67a9cbd2b480f7d0d985559e"
        },
        {
          subjectCode: "sub2",
          subject: "English",
          marksObtained: 90,
          totalMarks: 100,
          grade: "A",
          createdBy: "679ca8430d28f2d8b4ad981c",
          _id: "67a9d51a56761d09598a3ad9"
        }
      ],
      total: "270/300",
      totalPercentage: "90.00%",
      createdAt: "2025-02-10T09:26:46.456Z",
      updatedAt: "2025-02-10T10:29:46.234Z",
      __v: 5
    }
  ]
};

function Results() {
  const resultCardRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedExamIndex, setSelectedExamIndex] = useState(null);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    // Simulate fetching data and setting it
    const payload = mockData;

    if (payload?.result?.length > 0) {
      setResultData({
        stats: {
          present: payload.present || 0,
          absent: payload.absent || 0,
          performancePercentage: parseFloat(payload.performancePercentage) || 0,
          totalExams: payload.totalExams || payload.result.length,
          attemptedExams: payload.attendedExams || payload.present || 0,
        },
        exams: payload.result,
        totalMarks: payload.totalMarks,
        marksObtained: payload.marksObtained,
      });
    } else {
      setResultData(null);
    }
  }, []);

  if (!resultData) {
    return (
      <div className="text-center mt-10 text-gray-600 text-xl">No result data found.</div>
    );
  }

  const { exams, stats, totalMarks, marksObtained } = resultData;

  const examsPercentage = exams.map((exam, index) => ({
    name: exam.exam?.examType?.trim() || `Exam ${index + 1}`,
    percent: parseFloat(exam.totalPercentage) || 0,
    examId: exam._id,
    index,
  }));

  // totalMarks and marksObtained from mockData.stats already available
  // But let's also compute totalMarksObtained from exams to keep consistent
  // (Here only one exam, so just marksObtained from state is fine)

  const handleDownloadOption = async () => {
    const input = resultCardRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('result_card.pdf');
    setIsDropdownOpen(false);
  };

  const handleBarClick = (data, index) => {
    if (index !== null && index >= 0) {
      setSelectedExamIndex(index);
    }
  };

  const selectedExam = selectedExamIndex !== null ? exams[selectedExamIndex] : null;
  const studentProfile = selectedExam?.student?.studentProfile || {};

  return (
     <div className="mx-4 md:mx-8 mt-8">
    {/* Page Heading – Visible only on md (tablet) and above */}
    <div className="hidden md:flex justify-between items-start md:items-center -mt-12 mb-4">
      {/* Left: Title + Breadcrumb */}
      <div>
        <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">Results</h1>
        <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
        <h1 className="mt-1 text-sm sm:text-base">
          <span>Home</span> {">"}{" "}
          <span className="font-medium text-[#146192]">Results</span>
        </h1>
      </div>

      {/* Right: Header Icons */}
      <Header />
    </div>

    {/* Header only for mobile and tablet (below md) */}
    <div className="md:hidden mb-4">
      <Header />
    </div>


      <div ref={resultCardRef} className="bg-white rounded-xl shadow-xl p-6 mt-20">
        {/* Bar Chart */}
        <div className="w-full mb-8">
          <h2 className="text-lg font-semibold mb-4">Percentage of Exams</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={examsPercentage}
              onClick={(state) => {
                if (state && state.activeTooltipIndex != null) {
                  handleBarClick(null, state.activeTooltipIndex);
                }
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percent" cursor="pointer">
                {examsPercentage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={selectedExamIndex === index ? '#000' : 'none'}
                    strokeWidth={selectedExamIndex === index ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-center mb-8">Overall Performance</h2>

          <div className="flex flex-wrap justify-center gap-10">
            {/* Exams Pie Chart */}
            <div className="flex flex-col items-center relative">
              <PieChart width={160} height={160}>
                <Pie
                  data={[
                    { name: 'Attempted Exam', value: stats.attemptedExams || 0 },
                    { name: 'Exams Not Taken', value: (stats.totalExams || 0) - (stats.attemptedExams || 0) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  dataKey="value"
                >
                  <Cell fill="#00C2FF" />
                  <Cell fill="#A889FF" />
                </Pie>
              </PieChart>
              <div className="absolute top-[60px] left-[50%] -translate-x-1/2 text-center">
                <div className="font-semibold text-sm text-[#146192]">Exams</div>
                <div className="text-xs text-gray-600">Total: {stats.totalExams || 0}</div>
                <div className="text-xs text-gray-500">
                  {stats.totalExams
                    ? `${((stats.attemptedExams / stats.totalExams) * 100).toFixed(0)}%`
                    : '0%'}
                </div>
              </div>
            </div>

            {/* Attendance Pie Chart */}
            <div className="flex flex-col items-center relative">
              <PieChart width={160} height={160}>
                <Pie
                  data={[
                    { name: 'Present', value: stats.present || 0 },
                    { name: 'Absent', value: stats.absent || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  dataKey="value"
                >
                  <Cell fill="#FF91CA" />
                  <Cell fill="#7D5AFC" />
                </Pie>
              </PieChart>
              <div className="absolute top-[60px] left-[50%] -translate-x-1/2 text-center">
                <div className="font-semibold text-sm text-[#146192]">Attendance</div>
                <div className="text-xs text-gray-600">
                  Total: {stats.present + stats.absent}
                </div>
                <div className="text-xs text-gray-500">
                  {stats.present + stats.absent
                    ? `${((stats.present / (stats.present + stats.absent)) * 100).toFixed(0)}%`
                    : '0%'}
                </div>
              </div>
            </div>

            {/* Result Pie Chart */}
            <div className="flex flex-col items-center relative">
              <PieChart width={160} height={160}>
                <Pie
                  data={[
                    { name: 'Marks Obtained', value: marksObtained },
                    { name: 'Remaining', value: totalMarks - marksObtained },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  dataKey="value"
                >
                  <Cell fill="#FF91CA" />
                  <Cell fill="#7D5AFC" />
                </Pie>
              </PieChart>
              <div className="absolute top-[60px] left-[50%] -translate-x-1/2 text-center">
                <div className="font-semibold text-sm text-[#146192]">Result</div>
                <div className="text-xs text-gray-600">Total: {totalMarks}</div>
                <div className="text-xs text-gray-500">
                  {totalMarks
                    ? `${((marksObtained / totalMarks) * 100).toFixed(0)}%`
                    : '0%'}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Percentage */}
          <div className="text-center mt-6">
            <div className="bg-[#E8F4FA] text-[#146192] inline-block px-6 py-2 rounded-xl font-semibold text-lg shadow">
              Performance Percentage: {stats.performancePercentage}%
            </div>
          </div>
        </div>

        {/* Conditionally render result only when an exam is selected */}
        {selectedExam && (
          <>
            <h2 className="mt-10 mb-2 text-xl font-bold text-[#146192] border-b border-gray-300 pb-2">
              {selectedExam.exam?.examType || 'Exam'} Result Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p>
                  <strong>Name:</strong> {studentProfile.fullname}
                </p>
                <p>
                  <strong>Class:</strong> {studentProfile.class}
                </p>
                <p>
                  <strong>Exam Type:</strong> {selectedExam.exam?.examType}
                </p>
                <p>
                  <strong>Total Marks:</strong> {selectedExam.total || 'N/A'}
                </p>
                <p>
                  <strong>Percentage:</strong> {selectedExam.totalPercentage}
                </p>
              </div>
              <div className="text-center">
                <img
                  src={studentProfile.photo}
                  alt={studentProfile.fullname}
                  className="rounded-full w-24 h-24 object-cover mx-auto"
                />
              </div>
            </div>

            {/* Subjects and marks */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
                <thead className="bg-[#146192] text-white">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2">Subject</th>
                    <th className="border border-gray-300 px-3 py-2">Marks Obtained</th>
                    <th className="border border-gray-300 px-3 py-2">Total Marks</th>
                    <th className="border border-gray-300 px-3 py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExam.result.map((subject, i) => (
                    <tr key={subject._id || i} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">{subject.subject}</td>
                      <td className="border border-gray-300 px-3 py-2">{subject.marksObtained}</td>
                      <td className="border border-gray-300 px-3 py-2">{subject.totalMarks}</td>
                      <td className="border border-gray-300 px-3 py-2">{subject.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Download Button */}
        <div className="relative mt-10 flex justify-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#146192] hover:bg-[#0f4e7c] text-white font-semibold py-2 px-6 rounded-full shadow-md"
          >
            Download
          </button>

          {isDropdownOpen && (
            <div className="absolute top-12 bg-white rounded-md shadow-lg border border-gray-300 right-0 w-40 z-50">
              <button
                onClick={handleDownloadOption}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download PDF
              </button>
              {/* You can add more options here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;

