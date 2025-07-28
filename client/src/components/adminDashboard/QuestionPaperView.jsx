import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionPaperById } from '../../redux/adminEntranceSlice';
import { useNavigate } from 'react-router-dom';

const QuestionPaperView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questionPaper, loading, error } = useSelector((state) => state.adminEntrance);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassClick = (classNumber) => {
    setSelectedClass(classNumber);
    dispatch(fetchQuestionPaperById(classNumber));
    setCurrentQuestionIndex(0); // Reset to first question on class change
  };

  const handleNext = () => {
    if (questionPaper && currentQuestionIndex < questionPaper.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const renderOptions = (question) => {
    const options = [question.option1, question.option2, question.option3, question.option4];
    return options.map((opt, i) => (
      <li key={i}>
        <input type="checkbox" className="mr-2" disabled />
        <span className={opt?.isAnswer ? 'font-bold text-green-700' : ''}>{opt?.text}</span>
      </li>
    ));
  };

  return (
    <div className="p-4 space-y-6 font-sans">
      {/* Header Buttons */}
      <div className="flex justify-end gap-4">
        <button className="bg-[#e0e7f0] px-4 py-2 rounded shadow">Question Paper</button>
        <button className="bg-[#e0e7f0] px-4 py-2 rounded shadow">Applicant Exam Details</button>
      </div>

      {/* Class Selector */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-3">
        {Array.from({ length: 12 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleClassClick(i + 1)}
            className={`px-4 py-2 border rounded ${
              selectedClass === i + 1
                ? 'bg-orange-500 text-white'
                : 'border-orange-400 text-orange-500'
            }`}
          >
            Class {i + 1}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-blue-500">Loading question paper...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* No Questions Case */}
      {!loading &&
        questionPaper &&
        Array.isArray(questionPaper.questions) &&
        questionPaper.questions.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">No questions available for this class.</p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              onClick={() => navigate(`/create-paper/${questionPaper.class}`)}
            >
              Create Paper
            </button>
          </div>
        )}

      {/* Show One Question at a Time */}
      {!loading &&
        questionPaper &&
        Array.isArray(questionPaper.questions) &&
        questionPaper.questions.length > 0 && (
          <div className="border p-4 rounded shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-4">Entrance Exam (2025)</h2>

            {/* Show current question */}
            <div className="mb-6">
              <p className="font-medium">
                #{questionPaper.questions[currentQuestionIndex].questionNumber}
              </p>
              <p className="text-gray-700 mt-1">
                {questionPaper.questions[currentQuestionIndex].question}
              </p>
              <ul className="space-y-2 pl-4 mt-2">
                {renderOptions(questionPaper.questions[currentQuestionIndex])}
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleNext}
                className="bg-[#1E3A8A] text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={currentQuestionIndex >= questionPaper.questions.length - 1}
              >
                Next
              </button>
            <button
  onClick={() => navigate(`/admin/editpaper/${questionPaper.class}`)}
  className="bg-[#1E3A8A] text-white px-4 py-2 rounded"
>
  Edit
</button>

            </div>
          </div>
        )}
    </div>
  );
};

export default QuestionPaperView;
