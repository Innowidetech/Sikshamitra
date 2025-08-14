import React, { useState, useEffect } from 'react';
import Header from '../adminDashboard/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import { submitTeacherResult, fetchSubjectsAndExams, fetchTeacherResults } from '../../redux/teacher/teacherResultSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddStudentResult() {
  const dispatch = useDispatch();
  const { submitSuccessMessage, loading, error, subjectsAndExams } = useSelector(state => state.teacherResults);

  const [classs, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [student, setStudentName] = useState('');
  const [exam, setExamType] = useState('');
  const [subject, setSubjectName] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [grade, setGrade] = useState('');
  const [resultList, setResultList] = useState([]);

  const handleSearch = () => {
    if (!classs || !section) {
      toast.error('Please enter class and section');
      return;
    }
    dispatch(fetchSubjectsAndExams({ classs, section }));
  };

  const handleAddSubjectResult = () => {
    if (!subject || !marksObtained || !totalMarks || !grade) {
      toast.error('Please fill in all subject result fields');
      return;
    }
    setResultList([
      ...resultList,
      {
        subject: subject,
        marksObtained: Number(marksObtained),
        totalMarks: Number(totalMarks),
        grade: grade.toUpperCase(),
      },
    ]);
    setSubjectName('');
    setMarksObtained('');
    setTotalMarks('');
    setGrade('');
    toast.success('Subject result added successfully');
  };

  const handleSubmit = () => {
    if (!classs || !section || !student || !exam || resultList.length === 0) {
      toast.error('Please fill all required fields and add at least one subject result.');
      return;
    }
    const resultData = {
      classs,
      section,
      student,
      exam,
      result: resultList,
    };
    dispatch(submitTeacherResult(resultData));
  };

  useEffect(() => {
    if (submitSuccessMessage) {
      dispatch(fetchTeacherResults());
      setResultList([]);
      setClassName('');
      setSection('');
      setStudentName('');
      setExamType('');
      toast.success('Result submitted successfully');
    }
  }, [submitSuccessMessage, dispatch]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 mt-20 md:ml-72 md:mx-8">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
        </div>
        <Header />
      </div>

      <div className="mx-4 mt-8 md:ml-80 md:mr-12">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-white bg-[#245c88] p-3 rounded-md mb-6">ADD STUDENT RESULT</h2>

          {/* Class & Section with Search */}
          <div className="flex flex-col md:flex-row mb-6 gap-4">
            <div className="w-full md:w-[48%]">
              <input 
                value={classs} 
                onChange={(e) => setClassName(e.target.value)} 
                placeholder="Class*" 
                className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="w-full md:w-[48%]">
              <input 
                value={section} 
                onChange={(e) => setSection(e.target.value)} 
                placeholder="Section*" 
                className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="w-full md:w-auto flex justify-center items-center">
              <button 
                onClick={handleSearch} 
                className="bg-[#245c88] text-white px-4 py-2 rounded-md w-full md:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          {/* Student Name and Exam Type */}
          {subjectsAndExams.students?.length > 0 && (
            <div className="flex flex-col md:flex-row mb-6 gap-4">
              <div className="w-full md:w-[48%]">
                <select 
                  value={student} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
                >
                  <option value="">Select Student</option>
                  {subjectsAndExams.students.map((s, i) => (
                    <option key={i} value={s.studentProfile.fullname}>
                      {s.studentProfile.fullname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-[48%]">
                <select
                  value={exam}
                  onChange={(e) => setExamType(e.target.value)}
                  className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
                >
                  <option value="">Select Exam Type</option>
                  {subjectsAndExams.exams.map((e, i) => (
                    <option key={i} value={e.examType}>{e.examType}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Subject, Marks, and Grade */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                value={subject} 
                onChange={(e) => setSubjectName(e.target.value)} 
                placeholder="Subject Name*" 
                className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
              />
              <input 
                value={marksObtained} 
                onChange={(e) => setMarksObtained(e.target.value)} 
                placeholder="Marks Obtained*" 
                className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
              />
              <input 
                value={totalMarks} 
                onChange={(e) => setTotalMarks(e.target.value)} 
                placeholder="Total Marks*" 
                className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
              />
              <input 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)} 
                placeholder="Grade*" 
                className="bg-[#d4e1ec] rounded-md px-4 py-2 w-full"
              />
            </div>
            <button
              onClick={handleAddSubjectResult}
              className="mt-2 bg-[#245c88] text-white px-4 py-2 rounded-md w-full md:w-auto"
            >
              Add Subject Result
            </button>
          </div>

          {/* Result List Display */}
          <div className="mb-6">
            <h3 className="text-lg font-medium">Added Results</h3>
            <ul>
              {resultList.map((item, index) => (
                <li key={index} className="bg-[#f1f8fc] p-3 mb-2 rounded-md">
                  <strong>{item.subject}</strong>: {item.marksObtained}/{item.totalMarks} ({item.grade})
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 flex-col md:flex-row">
            <button 
              onClick={handleSubmit} 
              className="bg-[#245c88] text-white px-4 py-2 rounded-md w-full md:w-auto"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Result'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications Container */}
      <ToastContainer />
    </>
  );
}

export default AddStudentResult;
