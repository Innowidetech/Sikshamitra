import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createQuestionPaper } from '../../redux/adminEntranceSlice';

const EditPaper = () => {
  const dispatch = useDispatch();
  const { classId } = useParams();

  const [className, setClassName] = useState(classId || '');
  const [questions, setQuestions] = useState([
    { text: '', image: null, options: ['', '', '', ''], answer: '' },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'image') {
      updated[index][field] = value.target.files[0];
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleAnswerSelect = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', image: null, options: ['', '', '', ''], answer: '' },
    ]);
  };

  const handleSubmit = () => {
    const formatted = questions.map(q => ({
      question: q.text,
      options: q.options,
      answer: q.answer,
    }));

    const imageFile = questions.find(q => q.image)?.image || null;

    dispatch(createQuestionPaper({
      className,
      questions: formatted,
      question2: imageFile,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-500">ONLINE TEST</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Class</label>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">Select Class</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
        </select>
      </div>

      {questions.map((q, index) => (
        <div key={index} className="mb-6 border border-gray-300 rounded p-4 bg-white shadow">
          <p className="font-medium text-gray-700 mb-2">Question No. #{index + 1}</p>

          <textarea
            value={q.text}
            onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
            placeholder="Enter your question here"
            className="w-full border border-gray-300 p-2 rounded mb-3"
            rows={3}
          />

          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleQuestionChange(index, 'image', e)}
              className="w-full"
            />
          </div>

          {q.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center mb-2">
              <input
                type="radio"
                name={`answer-${index}`}
                value={opt}
                checked={q.answer === opt}
                onChange={(e) => handleAnswerSelect(index, e.target.value)}
                className="mr-2"
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, optIdx, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                className="flex-1 border border-gray-300 p-2 rounded"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-between">
        <button
          onClick={addQuestion}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Add Question
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditPaper;
