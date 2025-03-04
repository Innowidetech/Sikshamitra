import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './layout/Header';
import { fetchExams } from '../../redux/parent/examSlice';
import Calendar from '../adminDashboard/Calendar';

function Exams() {
  const dispatch = useDispatch();
  const { examList, loading, error } = useSelector((state) => state.exams);
  const [filter, setFilter] = useState('all');
  
  const studentClass = "8";
  const studentSection = "c";

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const getStudentExams = () => {
    if (!examList?.exams || !Array.isArray(examList.exams)) return [];
    
    return examList.exams.filter(exam => 
      exam.class === studentClass && 
      exam.section === studentSection
    );
  };

  const getCurrentExam = () => {
    const studentExams = getStudentExams();
    if (studentExams.length === 0) return null;

    const currentDate = new Date();
    let currentExam = null;
    let earliestDate = new Date('9999-12-31');

    studentExams.forEach(exam => {
      if (exam.schedule && Array.isArray(exam.schedule)) {
        exam.schedule.forEach(schedule => {
          const scheduleDate = new Date(schedule.date);
          if (scheduleDate >= currentDate && scheduleDate < earliestDate) {
            earliestDate = scheduleDate;
            currentExam = {
              ...exam,
              currentSchedule: exam.schedule
            };
          }
        });
      }
    });

    return currentExam;
  };

  const getExamTypeSummaries = () => {
    const studentExams = getStudentExams();
    const examTypeSummaries = [];
    const colors = [
      { bg: 'rgba(77, 193, 82, 0.6)', text: '#2D7331' },  
      { bg: 'rgba(246, 173, 43, 0.6)', text: '#8B5E0F' }, 
      { bg: 'rgba(246, 43, 43, 0.6)', text: '#8B1717' }   
    ];
    const currentDate = new Date();
    
    const examsByType = studentExams.reduce((acc, exam) => {
      if (!acc[exam.examType]) {
        acc[exam.examType] = [];
      }
      
      const futureSchedules = exam.schedule.filter(s => new Date(s.date) >= currentDate);
      if (futureSchedules.length > 0) {
        acc[exam.examType].push({
          ...exam,
          schedule: futureSchedules
        });
      }
      
      return acc;
    }, {});

    Object.entries(examsByType).forEach(([examType, exams], index) => {
      if (exams.length > 0) {
        const allDates = exams.flatMap(exam => 
          exam.schedule.map(s => new Date(s.date))
        ).sort((a, b) => a - b);

        if (allDates.length > 0) {
          examTypeSummaries.push({
            examType,
            startDate: allDates[0],
            endDate: allDates[allDates.length - 1],
            duration: exams[0].duration,
            colors: colors[index % colors.length]
          });
        }
      }
    });

    return examTypeSummaries.sort((a, b) => a.startDate - b.startDate);
  };

  const currentExam = getCurrentExam();
  const examTypeSummaries = getExamTypeSummaries();

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-light text-black xl:text-[38px]">Exams</h1>
            <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xl">Home</span> {'>'}
              <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Exams</span>
            </h1>
          </div>
          <Header />
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Current Exam Timetable */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Current Exam TimeTable - {currentExam?.examType}
                </h2>
                <div className="overflow-x-auto -mx-6">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200" style={{fontFamily:'Poppins'}}>
                      <thead className="bg-[#285A87]">
                        <tr>
                          <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Date-Time
                          </th>
                          <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Subject
                          </th>
                          <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Subject Code
                          </th>
                          <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Syllabus
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentExam?.currentSchedule.map((schedule, index) => (
                          <tr key={schedule._id || index}>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#146192]">
                                  {new Date(schedule.date).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-[#146192] font-medium">{currentExam.duration}</span>
                                <span className="text-xs text-[#146192] font-medium">{schedule.day}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-[#146192] font-medium">
                              {schedule.subject}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-[#146192] font-medium">
                              {schedule.subjectCode}
                            </td>
                            <td className="py-3 px-4 text-sm text-[#146192] font-medium">
                              {schedule.syllabus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Upcoming Exams */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Calendar />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6" style={{fontFamily:'Poppins'}}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Exams</h3>
              </div>
              
              <div className="space-y-4">
                {examTypeSummaries.map((examSummary, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                    style={{ 
                      background: examSummary.colors.bg,
                      color: examSummary.colors.text
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-medium text-black">{examSummary.examType}</h4>
                        <p className="text-sm opacity-90 text-black">{examSummary.duration}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-black">
                          {examSummary.startDate.toLocaleDateString()} - {examSummary.endDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exams;