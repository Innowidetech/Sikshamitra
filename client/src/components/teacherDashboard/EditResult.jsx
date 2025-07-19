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

  const {
    loading,
    error,
    submitSuccessMessage,
    results,
  } = useSelector((state) => state.teacherResults);

  // Result passed via navigation state (when coming from Results.jsx)
  const passedResult = location.state?.result;

  const [resultData, setResultData] = useState(null);

  // Set resultData either from passed state or Redux store
  useEffect(() => {
    if (passedResult) {
      setResultData(passedResult);
    } else if (results.length > 0) {
      const existing = results.find((res) => res._id === resultId || res.id === resultId);
      setResultData(existing || null);
    }
  }, [passedResult, resultId, results]);

  // If results empty, fetch
  useEffect(() => {
    if (results.length === 0) {
      dispatch(fetchTeacherResults());
    }
  }, [dispatch, results.length]);

  // States for form fields
  const [subjects, setSubjects] = useState([]);
  const [classs, setClasss] = useState('');
  const [section, setSection] = useState('');
  const [exam, setExam] = useState('');
  const [student, setStudent] = useState({});

  // When resultData changes, update form states
  useEffect(() => {
    if (resultData) {
      setSubjects(resultData.result || []);
      setClasss(resultData.class || '');
      setSection(resultData.section || '');
      setExam(resultData.exam?.examType || '');
      setStudent(resultData.student?.studentProfile || {});
    }
  }, [resultData]);

  // Handle input changes in subjects
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

    // Validate all subjects
    for (const subject of subjects) {
      if (!subject.marksObtained || !subject.totalMarks || !subject.grade) {
        alert('Please fill all fields for each subject.');
        return;
      }
    }

    const cleanedSubjects = subjects.map((entry) => ({
      subjectCode: entry.subjectCode, // Ensure this exists
      subject: entry.subject,
      marksObtained: Number(entry.marksObtained),
      totalMarks: Number(entry.totalMarks),
      grade: entry.grade,
    }));

    const payload = {
      id: resultId,
      classs,
      section,
      exam: resultData.exam._id, // Use ObjectId
      student: resultData.student._id, // Use ObjectId
      result: cleanedSubjects,
    };

    try {
      await dispatch(editTeacherResult(payload)).unwrap();
      navigate('/teacher/results');
      // Optionally, reset the form after submission
      alert('Result successfully updated!');
    } catch (err) {
      console.error('Error saving result:', err);
      alert('Failed to update the result. Please try again.');
    }
  };

  // Clear submit success message after 3 seconds
  useEffect(() => {
    if (submitSuccessMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSubmitMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccessMessage, dispatch]);

  // Loading and error states
  if (loading && !resultData) {
    return (
      <p className="text-center mt-20 text-blue-600 font-semibold">
        Loading results...
      </p>
    );
  }

  if (error && !resultData) {
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        {error}
      </p>
    );
  }

  if (!resultData) {
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        Result not found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4">
      {/* Header */}
      <div className="flex justify-between items-center mx-8 mt-20 md:ml-72">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Results</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}{' '}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Results</span>
          </h1>
        </div>
        <Header />
      </div>

      {/* Form */}
      <div className="flex justify-center items-start mt-10 ml-0 md:ml-64">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-gray-50 shadow-md p-6 rounded-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold bg-[#146192] text-white p-3 rounded-md mb-6 text-center">
            EDIT STUDENT RESULT
          </h2>

          {/* Messages */}
          {loading && (
            <p className="text-center text-blue-600 font-semibold mb-4">
              Updating result...
            </p>
          )}
          {submitSuccessMessage && (
            <p className="text-center text-green-600 font-semibold mb-4">
              {submitSuccessMessage}
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 font-semibold mb-4">
              {error}
            </p>
          )}

          {/* Class, Section */}
          <div className="border border-gray-300 rounded-md p-4 mb-6 mx-auto max-w-md">
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
              <div className="mt-6 text-[#146192]">
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
                value={exam}
                readOnly
                className="w-full bg-blue-100 border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Subjects */}
          {subjects.map((subject, index) => (
            <div key={index} className="border-t border-gray-300 pt-4 mt-4">
              <div className="flex gap-4 mb-4">
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

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-[#146192] text-white py-2 px-6 rounded-md text-xl"
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
