import React, { useState, useEffect } from 'react';
import Header from '../adminDashboard/layout/Header';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  editTeacherResult,
  clearSubmitMessage,
  fetchTeacherResults,
} from '../../redux/teacher/teacherResultSlice';

function EditResult() {
  const dispatch = useDispatch();
  const { id: resultId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { loading, error, submitSuccessMessage, results } = useSelector(
    (state) => state.teacherResults
  );

  const passedResult = location.state?.result;
  const [resultData, setResultData] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [classs, setClasss] = useState('');
  const [section, setSection] = useState('');
  const [exam, setExam] = useState('');
  const [student, setStudent] = useState({});

  useEffect(() => {
    if (passedResult) {
      setResultData(passedResult);
    } else if (results.length > 0) {
      const found = results.find((res) => res._id === resultId || res.id === resultId);
      if (found) setResultData(found);
    }
  }, [passedResult, resultId, results]);

  useEffect(() => {
    if (results.length === 0) {
      dispatch(fetchTeacherResults());
    }
  }, [dispatch, results.length]);

  useEffect(() => {
    if (resultData) {
      setSubjects(resultData.result || []);
      setClasss(resultData.class || '');
      setSection(resultData.section || '');
      setExam(resultData.exam || '');
      setStudent(resultData.student?.studentProfile || {});
    }
  }, [resultData]);

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index] = {
      ...updated[index],
      [field]: field === 'marksObtained' || field === 'totalMarks' ? Number(value) : value,
    };
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const s of subjects) {
      if (!s.marksObtained || !s.totalMarks || !s.grade) {
        alert('Please fill all fields for each subject.');
        return;
      }
    }

    const payload = {
      id: resultData._id,
      classs,
      section,
      exam: exam?._id || exam,
      student: resultData.student._id,
      result: subjects.map((s) => ({
        subjectCode: s.subjectCode || '',
        subject: s.subject,
        marksObtained: Number(s.marksObtained),
        totalMarks: Number(s.totalMarks),
        grade: s.grade,
      })),
    };

    try {
      await dispatch(editTeacherResult(payload)).unwrap();
      alert('Result successfully updated!');
      navigate('/teacher/results');
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Failed to update result.');
    }
  };

  useEffect(() => {
    if (submitSuccessMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSubmitMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccessMessage, dispatch]);

  if (loading && !resultData)
    return <p className="text-center mt-20 text-blue-600 font-semibold">Loading...</p>;
  if (error && !resultData)
    return <p className="text-center mt-20 text-red-600 font-semibold">{error}</p>;
  if (!resultData)
    return <p className="text-center mt-20 text-red-600 font-semibold">Result not found.</p>;

  return (
    <div className="min-h-screen bg-white px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 sm:mx-8 mt-20 md:ml-72">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl sm:text-2xl xl:text-[38px] font-light text-black">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[100px] sm:w-[150px]" />
          <h1 className="mt-2">
            <span className="text-base sm:text-lg">Home</span> {'>'}{' '}
            <span className="text-base sm:text-lg font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Form */}
      <div className="flex justify-center items-start mt-10 md:ml-64 px-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-gray-50 shadow-md p-4 sm:p-6 rounded-lg"
        >
          <h2 className="text-lg sm:text-xl font-bold bg-[#146192] text-white p-2 sm:p-3 rounded-md mb-6 text-center">
            EDIT STUDENT RESULT
          </h2>

          {/* Class and Section */}
          <div className="border border-gray-300 rounded-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">Class*</label>
                <input
                  type="text"
                  value={classs}
                  readOnly
                  className="w-full bg-blue-100 border rounded px-3 py-2"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">Section*</label>
                <input
                  type="text"
                  value={section}
                  readOnly
                  className="w-full bg-blue-100 border rounded px-3 py-2"
                />
              </div>
              <div className="mt-2 sm:mt-6 text-[#146192]">
                <FaSearch size={20} />
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name *</label>
              <input
                type="text"
                value={student?.fullname || ''}
                readOnly
                className="w-full bg-blue-100 border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exam Type *</label>
              <input
                type="text"
                value={exam?.examType || ''}
                readOnly
                className="w-full bg-blue-100 border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Subjects Loop */}
          {subjects.map((subject, index) => (
            <div key={index} className="border-t border-gray-300 pt-4 mt-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject.subject || ''}
                    onChange={(e) =>
                      handleChange(index, 'subject', e.target.value)
                    }
                    className="w-full bg-blue-100 border rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Marks Obtained *</label>
                  <input
                    type="number"
                    value={subject.marksObtained || ''}
                    onChange={(e) =>
                      handleChange(index, 'marksObtained', e.target.value)
                    }
                    className="w-full bg-blue-100 border rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Total Marks *</label>
                  <input
                    type="number"
                    value={subject.totalMarks || ''}
                    onChange={(e) =>
                      handleChange(index, 'totalMarks', e.target.value)
                    }
                    className="w-full bg-blue-100 border rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Grade *</label>
                  <input
                    type="text"
                    value={subject.grade || ''}
                    onChange={(e) =>
                      handleChange(index, 'grade', e.target.value)
                    }
                    className="w-full bg-blue-100 border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-[#146192] text-white py-2 px-6 rounded-md text-lg sm:text-xl"
            >
              {loading ? 'Updating...' : 'Update Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditResult;
