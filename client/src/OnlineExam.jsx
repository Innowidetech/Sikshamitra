import React, { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const OnlineExam = () => {
  const [examData, setExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersState, setAnswersState] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchExamData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sikshamitra.onrender.com/api/user/questionPaper",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExamData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setLoading(false);
      toast.error("Error loading exam data.");
    }
  };

  useEffect(() => {
    fetchExamData();
  }, []);

  const questions = examData?.questionPaper?.questions || [];
  const currentQuestion = questions[currentIndex];
  const email = examData?.details?.email || "";

  const handleOptionChange = (optionKey) => {
    setAnswersState((prev) => ({
      ...prev,
      [currentQuestion._id]: optionKey,
    }));
  };

  const handleClearResponse = () => {
    setAnswersState((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion._id];
      return updated;
    });
    toast.info("Response cleared.");
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion._id]: true,
    }));
    toast.info("Question marked for review.");
    handleNext();
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const payload = {
      email,
      examId: examData?.questionPaper?._id,
      answers: Object.entries(answersState).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
    };

    try {
      setSubmitting(true);
      await axios.post(
        "https://sikshamitra.onrender.com/api/user/submitAnswers",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Exam submitted successfully! Check your email for the result.");

      // Wait 2 seconds for the toast to show, then navigate home
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("There was an error submitting your exam.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading Exam...</div>;
  }

  const { details, remainingTime } = examData || {};
  const selectedOption = answersState[currentQuestion?._id] || null;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={details?.photo}
            alt="Student"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-sm font-bold">ONLINE TEST</h1>
            <p className="text-xs mt-1">
              Class {details?.class} | {details?.school}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Time left:{" "}
            {`${remainingTime?.hours || 0}`.padStart(2, "0")}:
            {`${remainingTime?.minutes || 0}`.padStart(2, "0")}:
            {`${remainingTime?.seconds || 0}`.padStart(2, "0")}
          </p>
          <CircleUserRound size={36} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Question Section */}
        <div className="md:col-span-2 space-y-6">
          {currentQuestion ? (
            <div>
              <h2 className="text-lg font-semibold">
                Greenwood School Entrance Exam – {details?.year}
              </h2>
              <p className="mt-2 font-semibold">
                #{currentQuestion.questionNumber}
              </p>
              <p className="mt-2">{currentQuestion.question}</p>

              {/* Options */}
              <div className="space-y-3 mt-4">
                {["option1", "option2", "option3", "option4"].map((key, index) => (
                  <label key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="option"
                      value={key}
                      checked={selectedOption === key}
                      onChange={() => handleOptionChange(key)}
                      className="accent-green-500"
                    />
                    <span>{currentQuestion[key]?.text}</span>
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6 flex-wrap">
                <button
                  className="bg-gray-100 border px-4 py-2 rounded"
                  onClick={handleMarkForReview}
                >
                  Mark for Review & Next
                </button>
                <button
                  className="bg-gray-100 border px-4 py-2 rounded"
                  onClick={handleClearResponse}
                >
                  Clear Response
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleNext}
                  >
                    Save & Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>No question available</p>
          )}
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#ff4d4d] rounded"></div>
              Not Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#e0e0e0] rounded"></div>
              Not Viewed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#4caf50] rounded"></div>
              Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#9c27b0] rounded"></div>
              Marked for Review
            </div>
          </div>

          {/* Question Palette */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              let statusColor = "bg-gray-300"; // default: not viewed

              if (answersState[q._id]) {
                statusColor = "bg-[#4caf50]"; // answered
              }

              if (markedForReview[q._id]) {
                statusColor = "bg-[#9c27b0]"; // marked for review
              }

              if (!answersState[q._id] && idx !== currentIndex) {
                statusColor = "bg-[#ff4d4d]"; // not answered
              }

              if (idx === currentIndex) {
                statusColor = "bg-blue-600"; // currently viewing
              }

              return (
                <div
                  key={q._id}
                  className={`${statusColor} w-8 h-8 text-white text-sm font-medium flex items-center justify-center rounded cursor-pointer`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  {q.questionNumber.toString().padStart(2, "0")}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineExam;
