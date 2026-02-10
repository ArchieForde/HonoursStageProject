import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import questions from "../data/questions";
import QuestionCard from "../components/questioncard";

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const currentQuestion = questions[currentIndex];

  function handleAnswer(key, value) {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
    setShowError(false);
  }

  function isAnswered(question) {
    const answer = answers[question.key];
    if (question.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== null && answer !== "";
  }

  function nextQuestion() {
    if (!isAnswered(currentQuestion)) {
      setShowError(true);
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowError(false);
    }
  }

  function prevQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowError(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-2xl">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-sm text-purple-300">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-purple-900/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            value={answers[currentQuestion.key]}
            onChange={handleAnswer}
          />
        </div>

        {/* Error Message */}
        {showError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 animate-slideIn">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <span className="text-red-200">Please select an answer before continuing</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-700/30 border border-purple-500/30 hover:bg-purple-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            {currentIndex < questions.length - 1 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
